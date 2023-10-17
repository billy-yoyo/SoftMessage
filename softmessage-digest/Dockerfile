FROM node:12.7.0-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY src ./src
COPY ../softmessage-common ../softmessage-common
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/app.js"]
