FROM node:12

WORKDIR ${HOME}/app

COPY package*.json yarn.lock* ./

RUN npm install --only=prod

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
