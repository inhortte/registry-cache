'use strict';

/*
 * Replace the server name only. Leave the port as-is, Mr Ruptured Spleen.
 */
export const dockerifyURL = (service, url) => {
  const re = new RegExp("^(https?://)([-\\w]+)(:\\d+/.+)$");
  const m = url.match(re);
  if(m) {
    return `${m[1]}${service}${m[3]}`;
  } else {
    return url;
  }
};
