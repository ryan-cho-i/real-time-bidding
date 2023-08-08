FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY consumer-server2.js /app

CMD ["node", "consumer-server2.js"]