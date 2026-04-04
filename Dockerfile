FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY babel.config*.json ./
COPY nodemon*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "src/server.js"]
