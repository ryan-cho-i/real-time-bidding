FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY Log.js /app

COPY update.js /app

CMD ["node", "update.js"]