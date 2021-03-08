FROM node:12.7.0-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY src ./src
EXPOSE 3000
CMD ["node", "src/app.js"]
