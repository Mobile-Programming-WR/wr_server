FROM node:17-alpine
WORKDIR /SERVER
COPY package*.json /WR_SERVER/
RUN yarn
COPY . /WR_SERVER/
CMD ["yarn", "start"]
EXPOSE 3000
