# ------------------------------- ENV ---------------------------------
FROM node:18.15-alpine3.16 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build 

# ---------------------------------------------------------------------
FROM nginx:1.23-alpine

# set timezone
ENV TZ='Asia/Bangkok'

# update images and change timezone
RUN apk update && apk add ca-certificates && apk add --update tzdata && rm -rf /var/cache/apk/*

COPY --from=build /app/dist/grandora /usr/share/nginx/grandora
CMD ["nginx", "-g", "daemon off;"]