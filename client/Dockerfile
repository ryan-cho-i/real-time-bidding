FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY client.js /app

COPY client.html /app

CMD ["node", "client.js"]