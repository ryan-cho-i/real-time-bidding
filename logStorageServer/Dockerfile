FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY Log.js /app

COPY consumer2.js /app

CMD ["node", "consumer2.js"]