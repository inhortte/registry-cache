'use strict';

import Hapi from 'hapi';
import Redis from 'ioredis';

const redis = new Redis();

const server = new Hapi.Server();
server.connection({
  port: 3049
});

server.route({
  method: 'POST',
  path: '/revent',
  handler: (req, reply) => {
    console.log(JSON.stringify(req.payload));
    reply('beat me senseless');
  }
});

server.start(err => {
  if(err) { throw err; }
  console.log(`You will be beaten senseless at: ${server.info.uri}`);
});
