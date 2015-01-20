FROM dockerfile/nodejs

ADD package.json /src/
WORKDIR /src
RUN npm install
RUN npm install -g nodemon
ADD . /src

CMD nodemon index.js
