# 第一阶段 Node 镜像: 使用 node 镜像对单页应用进行构建，生成静态资源
FROM node:14-alpine as builder
WORKDIR /code
# 单独分离 package.json，是为了安装依赖可最大限度利用缓存

ADD package.json yarn.lock /code/
# 此时，yarn 可以利用缓存，如果 yarn.lock 内容没有变化，则不会重新依赖安装
RUN yarn 
# 因为当前目录的的代码肯定会发生改变，如果发生改变，会重新生成一个层。所以这里先yarn 在加代码进来

ADD . /code
# 这里只是构建资源，没有启动服务。启动服务在nginx:alpine的基础镜像里面做了。
RUN npm run build

# 第二阶段 Nginx 镜像: 使用 nginx 镜像对单页应用的静态资源进行服务化
# 选择更小体积的基础镜像
FROM nginx:alpine
COPY --from=builder code/build /usr/share/nginx/html