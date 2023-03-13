#FROM nginx:latest
FROM registry.cn-shanghai.aliyuncs.com/smartx/nginx:base-latest

WORKDIR /usr/share/nginx/html
COPY dist /usr/share/nginx/html

# RUN ls -la

EXPOSE 80 443