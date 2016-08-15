'use strict';

import Hapi from 'hapi';
import Inert from 'inert';
import path from 'path';
import { update, query, deleteImage } from './store';

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
server.route({
  method: 'POST',
  path: '/revent',
  handler: (req, reply) => {
    if(req.payload) {
      update(req.payload.events);
    }
    reply('beat me senseless');
  }
});
server.route({
  method: 'POST',
  path: '/rquery',
  handler: (req, reply) => {
    console.log(`rquery called, vole...`);
    query().then(res => {
      console.log(`RESPONSE:\n${JSON.stringify(res)}`);
      reply(res);
    });
  }
});
server.route({
  method: 'POST',
  path: '/rdelete/{iName}/{tName}',
  handler: (req, reply) => {
    /*
     * For now, deleteImage simply returns a boolean.
     */
    deleteImage(req.params.iName, req.params.tName).then(res => {
      reply({
        status: res
      });
    });
  }
});

server.start(err => {
  if(err) { throw err; }
  console.log(`You will be beaten senseless at: ${server.info.uri}`);
});
