FROM node:18.18.0-alpine As e2e-test

RUN apk update && apk upgrade
RUN apk add python3 g++ make

RUN mkdir -p /usr/src/app/node_modules
# RUN chown -R node:node /usr/src/app

WORKDIR /usr/src/app

# USER node

# COPY --chown=node:node package*.json ./

COPY package*.json ./

RUN npm install

# copy the project code (e.g. consider: --only=production)
# COPY --chown=node:node . .

COPY . .

# expose port 3500
EXPOSE 80