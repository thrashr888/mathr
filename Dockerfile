# start with docker's base ubuntu image
FROM ubuntu:precise

# update package sources
RUN apt-get -y update

# NVM with default node version installed
RUN apt-get -y install git

RUN apt-get -y install build-essential libssl-dev curl

RUN git clone https://github.com/creationix/nvm.git /.nvm

RUN echo &quot;. /.nvm/nvm.sh&quot; &gt;&gt; /etc/bash.bashrc

RUN /bin/bash -c '. /.nvm/nvm.sh &amp;&amp; nvm install v0.10.20 &amp;&amp; nvm use v0.10.20 &amp;&amp; nvm alias default v0.10.20 &amp;&amp; ln -s /.nvm/v0.10.20/bin/node /usr/bin/node &amp;&amp; ln -s /.nvm/v0.10.20/bin/npm /usr/bin/npm'

# forever for running node apps as daemons and automatically restarting on file changes
RUN npm install forever -g


RUN npm install --production
RUN npm install grunt-cli bower-cli
RUN bower install
RUN grunt build

WORKDIR ./dist

EXPOSE 9000

CMD forever sampleapp.js