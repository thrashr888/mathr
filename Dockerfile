# DOCKER-VERSION 0.3.4
FROM dockerfile/nodejs

ADD . /data

RUN cd /data; npm install; ./node_modules/bower/bin/bower install;

EXPOSE  9000

CMD ["node", "./node_modules/grunt-cli/bin/grunt", "build", "server"]