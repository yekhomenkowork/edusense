FROM node:22.22.0-alpine AS tooling
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit
COPY . .
USER node

FROM tooling AS test
CMD ["node", "--test"]

FROM tooling AS builder
USER root
RUN npm run build

FROM nginx:1.28.2-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
USER 101:101
ENTRYPOINT ["nginx", "-g", "daemon off;"]
