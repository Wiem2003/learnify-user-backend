# Stage 1: build Angular
FROM node:20 AS build

WORKDIR /app

# install deps first (cache optimization)
COPY package.json package-lock.json ./
RUN npm ci

# copy full project
COPY . .

# build Angular
RUN npm run build

# Stage 2: Nginx serve
FROM nginx:alpine

# Angular output (SAFE wildcard)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
