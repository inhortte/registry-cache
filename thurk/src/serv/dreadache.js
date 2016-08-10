'use strict';

import Hapi from 'hapi';
import { update } from './store';

const server = new Hapi.Server();
server.connection({
  port: 3049
});

server.route({
  method: 'POST',
  path: '/revent',
  handler: (req, reply) => {
    update(req.payload.events);
    reply('beat me senseless');
  }
});

server.start(err => {
  if(err) { throw err; }
  console.log(`You will be beaten senseless at: ${server.info.uri}`);
});
