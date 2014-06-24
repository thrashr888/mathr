# DOCKER-VERSION 0.3.4
FROM dockerfile/nodejs

ADD . /src

RUN cd /src; npm install; bower install; grunt build;

EXPOSE  9000

CMD ["node", "./node_modules/grunt-cli/bin/grunt", "build", "server"]