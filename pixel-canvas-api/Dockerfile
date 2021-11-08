FROM node:14-alpine

ENV NODE_ENV=production
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production --silent

COPY dist ./dist
COPY .env ./

EXPOSE 4000

CMD ["npm", "run", "serve"]
