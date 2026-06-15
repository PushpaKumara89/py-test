FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=builder /app/dist/kubepulse-ui/browser/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
