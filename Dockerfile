# DOCKER-VERSION 0.3.4
FROM dockerfile/nodejs

ADD . /data

RUN cd /data; npm install;
RUN cd /data; npm install -g grunt-cli bower;
RUN cd /data; bower install --allow-root;

EXPOSE  9000

CMD ["grunt", "build", "server"]