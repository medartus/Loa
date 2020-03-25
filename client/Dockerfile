# node slim image
FROM node:12.10.0-slim
WORKDIR /usr/src/app

# installing packages
COPY ./package*.json ./
RUN npm install --quiet

# copy files
COPY . .
EXPOSE 3000

# start dev server
# CMD ["npm", "start"]

RUN npm run build

# production environment
FROM nginx:1.17.3-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
