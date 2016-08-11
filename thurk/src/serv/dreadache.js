'use strict';

import Hapi from 'hapi';
import Inert from 'inert';
import path from 'path';
import { update } from './store';

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, '../public')
      }
    }
  }
});
server.connection({
  port: process.env.DREADACHE_PORT || 3049
});
server.register(Inert, () => {});

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: '.',
      redirectToSlash: true,
      index: true
    }
  }
});

/*
server.route({
  method: 'POST',
  path: '/revent',
  handler: (req, reply) => {
    update(req.payload.events);
    reply('beat me senseless');
  }
});
*/

server.start(err => {
  if(err) { throw err; }
  console.log(`You will be beaten senseless at: ${server.info.uri}`);
});
