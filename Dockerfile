FROM node:12-alpine

MAINTAINER minhpq331@gmail.com

WORKDIR /app

ADD package.json package-lock.json /app/
RUN npm install 

ADD . /app

CMD ["npm", "start"]
