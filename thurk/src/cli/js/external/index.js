import { localServer } from '../config';

export const queryServer = () => new Promise((resolve, reject) => {
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

export const deleteImage = (iName, tName) => new Promise((resolve, reject) => {
  fetch(`${localServer.serverName}rdelete/${iName}/${tName}`, { method: 'post' }).then(res => {
    return res.json();
  }).then(json => {
    resolve(json.status);
  }).catch(err => {
    if(err) throw err;
  });
});
