FROM node:12-alpine

WORKDIR ${HOME}/app

COPY package*.json yarn.lock* ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "serve" ]
