'use strict';

import Redis from 'ioredis';

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
  let reptagStats = events.reduce((stats, event) => {
    console.log(`\nevent.id: ${event.id}\nevent.action: ${event.action}\n\n`);
    if(stats.repository === undefined) {
      stats['repository'] = event.target.repository;
    }
    if(stats.action === undefined) {
      stats['action'] = event.action;
    }
    stats['timestamp'] = event.timestamp;
    let _tag = event.target.tag;
    if(_tag !== undefined) {
      redis.sadd(stats.repository, _tag);
      stats['tag'] = _tag;
    }
    stats['size'] = stats['size'] + event.target.size;
    return stats;
  }, {
    size: 0
  });
  let key = `${reptagStats.repository}:${reptagStats.tag}`;
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
              'size', reptagStats.size);
};
