'use strict';

import Wreck from 'wreck';
import Redis from 'ioredis';
import R from 'ramda';
import { dockerifyURL } from './utils';

let redisOpts = {
  port: 6379
};
if(process.env.NO_DOCKER) {
  redisOpts['host'] = 'localhost';
} else {
  redisOpts['host'] = 'redis';
}

const redis = new Redis(redisOpts);
const wreck = Wreck.defaults({
  headers: "Host: registry:5000"
});

/* check for manifest */
const mediaTypeRe = /manifest/;

export const update = events => {
  console.log(`registry update called...`);
  let reptagStats = R.reduce((stats, event) => {
    stats['action'] = event.action;
    if(event.action === "push" || event.action === "pull") {
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
      if(event.target.mediaType.match(mediaTypeRe)) {
        stats['digest'] = event.target.digest;
        stats['url'] = dockerifyURL('registry', event.target.url);
      } else {
        redis.sadd(`image:${event.target.repository}:blobs`, event.target.digest);
        redis.sadd(`image:${event.target.repository}:urls`, dockerifyURL('registry', event.target.url));
      }
    }
    return stats;
  }, {
    size: 0
  }, events);
  if(reptagStats.action === "push" || reptagStats.action === "pull") {
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
                'size', reptagStats.size,
                'url', reptagStats.url,
                'digest', reptagStats.digest).then(res => {
                  console.log(`${key} thurked`);
                });;
  }
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

export const deleteImage = (iName, tName) => new Promise((resolve, reject) => {
  redis.hget(`image:${iName}:${tName}`, 'url').then(url => {
    console.log(`deleteImage url: ${url}`);
    wreck.delete(url, (err, res) => {
      if(err) throw err;
      console.log(`fetch DELETE response statusCode: ${res.statusCode}`);
      if(res.statusCode === 202) {
        redis.del(`image:${iName}:${tName}`).then(_ => {
          return redis.srem(`image:${iName}`, tName);
        }).then(_ => {
          return redis.smembers(`image:${iName}`);
        }).then(tArr => {
          if(tArr.length === 0) {
            /*
             * Delete all of the blobs associated with this image
             */
            redis.smembers(`image:${iName}:urls`).then(urlArr => {
              let blobCount = urlArr.length;
              let blobFetches = R.map(url => {
                let blobReq = wreck.request('DELETE', url);
                blobReq.on('response', res => {
                  console.log(`blob returned status ${res.statusCode}`);
                  if(res.statusCode === 202) {
                    blobCount = blobCount - 1;
                    if(blobCount === 0) {
                      resolve(true);
                    }
                  } else {
                    resolve(false);
                  }
                });
                return blobReq;
              }, urlArr);
              return redis.srem('images', iName);
            }).then(_ => {
              return redis.del(`image:${iName}`, `image:${iName}:blobs`, `image:${iName}:urls`);
            }).then(_ => {
              /*
               * And resolve to true when everything concerning the image is expunged.
               */
              resolve(true);
            }).catch(err =>  {
              if(err) throw err;
            });
          } else {
            /*
             * Simply resolve to true (the manifest of this particular tag removed).
             */
            resolve(true);
          }
        }).catch(err => {
          if(err) throw err;
        });
      } else {
        resolve(false);
      }
    });
  });
});
