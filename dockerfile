FROM node:22.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

COPY . .

EXPOSE 6969

CMD ["npm", "start"]
