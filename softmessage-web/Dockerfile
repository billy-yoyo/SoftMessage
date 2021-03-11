FROM node:12.7.0-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY server ./server
COPY web ./web
EXPOSE 3000
CMD ["npm", "start"]
