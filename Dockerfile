FROM node as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

FROM base as test
CMD [ "npm", "test" ]

FROM base as dev
EXPOSE 3020
CMD [ "npm", "run", "dev:server" ]