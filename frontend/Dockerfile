# Етап 1: Збірка React додатку
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Використовуємо npm ci замість npm install для більш надійної і швидкої збірки
RUN npm ci
COPY . .
RUN npm run build

# Етап 2: Production сервер
FROM nginx:stable-alpine
# Видаляємо дефолтну статику та конфіг
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

# Копіюємо наш оптимізований конфіг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копіюємо скомпільований React-код
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
