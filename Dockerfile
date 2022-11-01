FROM node:alpine
COPY . /app
WORKDIR /app
CMD npm install
CMD npm run dev
