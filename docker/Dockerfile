FROM nginx:1.15-alpine

RUN rm -rf /usr/share/nginx/html/*

# 设置nginx conf
COPY docker/site.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf

# 从builder内copy部署文件
COPY pages /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
