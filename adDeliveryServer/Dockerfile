FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY User.js /app

COPY consumer1.js /app

CMD ["node", "consumer1.js"]