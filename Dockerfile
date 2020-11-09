FROM node:12-alpine

# RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# USER node

WORKDIR ${HOME}/app

COPY package*.json yarn.lock* ./

RUN npm ci --only=production
# RUN yarn install --pure-lockfile

# COPY --chown=node:node . .
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "serve" ]
