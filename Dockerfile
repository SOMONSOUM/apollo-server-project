FROM node:16.14.0

ARG NODE_ENV
ARG DATABASE
ARG USERNAME
ARG PASSWORD
ARG PORT
ARG HOST
ARG JWT_SECRET_KEY
ARG JWT_EXPIRE_IN
ARG CLOUD_NAME
ARG API_KEY
ARG API_SECRET
ARG API_VARIABLE
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

EXPOSE ${PORT}
CMD [ "yarn", "start" ]