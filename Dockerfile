FROM node:22-alpine3.24 AS build

WORKDIR /app

COPY package*.json ./
COPY babel.config*.json ./
COPY nodemon*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "server.js"]
