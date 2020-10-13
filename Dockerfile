FROM node:12

WORKDIR ${HOME}/app

COPY package*.json yarn.lock* ./

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
