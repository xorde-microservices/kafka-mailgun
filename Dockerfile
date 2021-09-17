FROM node:lts-alpine as builder

WORKDIR /opt/app

COPY . .

RUN npm install; npm run build

FROM node:lts-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/templates ./templates
COPY --from=builder /opt/app/node_modules ./node_modules

CMD ["node", "dist/main"]