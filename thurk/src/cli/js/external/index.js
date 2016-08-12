import { localServer } from '../config';

export const queryServer = () => {
  console.log(`started queryServer`);
  fetch(`${localServer.serverName}rquery`).then(res => {
    res.json().then(json => {
      console.log(JSON.stringify(json));
    }).catch(err => {
      console.log(`error in json call: ${JSON.stringify(err)}`);
    });
  }).catch(err => {
    console.log(`error in fetch: ${JSON.stringify(err)}`);
  });
};
