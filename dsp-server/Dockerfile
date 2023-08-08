FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY dsp-server.js /app

CMD ["node", "dsp-server.js"]