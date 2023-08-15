#stage 1
FROM node:19-alpine
WORKDIR /app
COPY . .
RUN npm install --force
CMD ["npm", "start"]

