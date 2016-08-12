'use strict';

import Redis from 'ioredis';
import R from 'ramda';

let redisOpts = {
  port: 6379
};
if(process.env.NO_DOCKER) {
  redisOpts['host'] = 'localhost';
} else {
  redisOpts['host'] = 'redis';
}

const redis = new Redis(redisOpts);

export const update = events => {
  console.log(`registry update called...`);
  let reptagStats = events.reduce((stats, event) => {
    if(stats.repository === undefined) {
      stats['repository'] = event.target.repository;
    }
    if(stats.action === undefined) {
      stats['action'] = event.action;
    }
    stats['timestamp'] = event.timestamp;
    let _tag = event.target.tag;
    if(_tag !== undefined) {
      redis.sadd(`image:${stats.repository}`, _tag);
      stats['tag'] = _tag;
    }
    stats['size'] = stats['size'] + event.target.size;
    return stats;
  }, {
    size: 0
  });
  redis.sadd('images', reptagStats.repository);
  let key = `image:${reptagStats.repository}:${reptagStats.tag}`;
  switch(reptagStats.action){
  case "pull":
    redis.hincrby(key, 'pulls', 1);
      break;
  case "push":
    redis.hincrby(key, 'pushes', 1);
    break;
  default:
    break;
  };
  redis.hmset(key,
              'last_update', reptagStats.timestamp,
              'size', reptagStats.size).then(res => {
                console.log(`${key} thurked`);
              });;
};

/*
 * Return value:
 * {
 *   images: {
 *     image-name: {
 *       tag-name: {
 *         last_update: ...,
 *         pulls: ...,
 *         pushes: ...,
 *         size: ...
 *       }, ...
 *     }, ...
 *   }
 * }
 */
export const query = () => new Promise((resolve, reject) => {
  const imageStats = (iName, tName) => new Promise((resolve, reject) => {
    let key = `image:${iName}:${tName}`;
    Promise.all([
      redis.hget(key, 'last_update'),
      redis.hget(key, 'size'),
      redis.hget(key, 'pushes'),
      redis.hget(key, 'pulls')
    ]).then(stats => {
      resolve(R.zipObj([tName], [ R.zipObj(['last_update', 'size', 'pushes', 'pulls'], stats) ]));
    });
  });

  const imageTags = (iName) => new Promise((resolve, reject) => {
    redis.smembers(`image:${iName}`).then(tagSet => {
      Promise.all(tagSet.map(tName => {
        return imageStats(iName, tName);
      })).then(tStats => {
        resolve(R.zipObj([iName], [ R.mergeAll(tStats) ]));
      });
    });
  });

  redis.smembers('images')
    .then(imageSet => Promise.all(imageSet.map(iName => imageTags(iName)))
          .then(images => resolve({ images: R.mergeAll(images) })));
});
