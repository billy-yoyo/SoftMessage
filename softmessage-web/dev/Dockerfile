FROM node:12.7.0-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY runMigrate.js ./runMigrate.js
COPY migrate.js ./migrate.js
COPY sql ./sql
CMD ["npm", "start"]
