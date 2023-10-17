FROM node:12.7.0-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY server ./server
COPY client ./client
COPY ../softmessage-common ../softmessage-common
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
