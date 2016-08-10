FROM mhart/alpine-node:5.12

ENV NPM_CONFIG_LOGLEVEL info

RUN apk update && apk add git \
    && npm install "gulpjs/gulp.git#4.0" -g

COPY . /opt/registry-cache/
RUN cp /opt/registry-cache/package.json /tmp/package.json \
    && cd /tmp && npm install \
    && cp -a /tmp/node_modules /opt/registry-cache/
WORKDIR /opt/registry-cache
RUN gulp buildServer

EXPOSE 3049

ENTRYPOINT ["node", "server/dreadache.js"]
