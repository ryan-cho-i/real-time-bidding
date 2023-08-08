FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY dsp.js /app

CMD ["node", "dsp.js"]