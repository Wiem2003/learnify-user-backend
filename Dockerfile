FROM nginx:alpine

COPY dist/learnhub /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]