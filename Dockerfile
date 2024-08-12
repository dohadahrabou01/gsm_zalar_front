
FROM node:18-alpine


WORKDIR /gsm_zalar_front
COPY package.json package-lock.json ./


RUN npm install --legacy-peer-deps
COPY . .

Run npm run build


EXPOSE 3000

CMD ["npm", "start"]
