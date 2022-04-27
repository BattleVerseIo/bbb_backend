FROM node:16
WORKDIR /usr/src/app
COPY . .
EXPOSE 5000
CMD [ "node", "index.js" ]
