# build environment
FROM node:12.8.1-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app

# CMD ["npm", "start"]

RUN npm run build

# production environment
FROM nginx:1.17.3-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]