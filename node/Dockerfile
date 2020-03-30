# node slim image
FROM node:12.10.0-slim
WORKDIR /usr/src/app

# installing packages
COPY ./package*.json ./
RUN npm install --quiet
RUN npm install -g nodemon --quiet

# copy files
COPY . .
EXPOSE 4000

# start dev server
CMD ["nodemon", "server.js"]