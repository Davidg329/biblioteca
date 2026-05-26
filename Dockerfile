
FROM node:18-alpine

LABEL maintainer="Equipo Biblioteca"
LABEL description="Node.js - Biblioteca virtual"

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
