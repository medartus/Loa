FROM node:12.8.1-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app/package.json
RUN npm install

# Bundle app source
COPY . /app

EXPOSE 80

ENV ENVIRONMENT=dev

CMD [ "node", "server.js" ]