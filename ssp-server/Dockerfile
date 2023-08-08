FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY ssp-server.js /app

CMD ["node", "ssp-server.js"]