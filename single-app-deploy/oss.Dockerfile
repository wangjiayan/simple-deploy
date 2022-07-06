FROM node:14-alpine as builder

ARG SecretId
ARG SecretKey
# 设置环境变量
ENV PUBLIC_URL https://www.wangjiayan.cn/
ENV SecretId SecretId
ENV SecretKey SecretKey

WORKDIR /code

# # 单独分离 package.json，是为了安装依赖可最大限度利用缓存
# ADD package.json yarn.lock /code/


ADD . /code
RUN yarn
RUN npm run build 
RUN npm run oss:script

# 选择更小体积的基础镜像
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/build /usr/share/nginx/html