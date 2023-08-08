FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY ssp.js /app

CMD ["node", "ssp.js"]