import { localServer } from '../config';

export const queryServer = () => new Promise((resolve, reject) => {
  console.log(`started queryServer`);
  return fetch(`${localServer.serverName}rquery`, { method: 'post' }).then(res => {
    res.json().then(json => {
      resolve(json);
    }).catch(err => {
      console.log(`error in json call: ${JSON.stringify(err)}`);
    });
  }).catch(err => {
    console.log(`error in fetch: ${JSON.stringify(err)}`);
  });
});
