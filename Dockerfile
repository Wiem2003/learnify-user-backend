FROM nginx:alpine

COPY dist/learnhub/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]