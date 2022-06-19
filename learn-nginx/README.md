# Nginx配置指南

## root 与 index
- `root`: 静态资源的根路径。见 [文档](https://nginx.org/en/docs/http/ngx_http_core_module.html#root)
- `index`: 当请求路径以 `/` 结尾时，则自动寻找该路径下的 index 文件。见 [文档](https://nginx.org/en/docs/http/ngx_http_index_module.html#index)

`root` 与 `index` 为前端部署的基础，在默认情况下 root 为 `/usr/share/nginx/html`，因此我们部署前端时，往往将构建后的静态资源目录挂载到该地址。

## location

location 用以匹配路由，配置语法如下。


```
location [ = | ~ | ~* | ^~ ] uri { ... }
```
其中 `uri` 前可提供以下修饰符

-   `=` 精确匹配。优先级最高
-   `^~` 前缀匹配，优先级其次
-   `~` 正则匹配，优先级再次 (~* 只是不区分大小写，不单列)
-   `/` 通用匹配，优先级再次

## proxy_pass
`proxy_pass` 反向代理：位于Web服务器前面的服务器，它将客户端的请求转发到这些Web服务 ，通常用于解决跨域的问题。


当使用 `proxy_pass` 代理路径时，有两种情况

1.  代理服务器地址不含 URI，则此时客户端请求路径与代理服务器路径相同。**强烈建议这种方式**
2.  代理服务器地址含 URI，则此时客户端请求路径匹配 location，并将其 location 后的路径附在代理服务器地址后。

```
# 不含 URI
proxy_pass http://api:3000;

# 含 URI
proxy_pass http://api:3000/;
proxy_pass http://api:3000/api;
proxy_pass http://api:3000/api/;

```

```
server {
    listen       80;
    server_name  localhost;

    root   /usr/share/nginx/html;
    index  index.html index.htm;

    # 建议使用此种 proxy_pass 不加 URI 的写法，原样路径即可
    # http://localhost:8700/api1/hello -> proxy:3000/api1/hello
    location /api1 {
        # 可通过查看响应头来判断是否成功返回
        add_header X-Config A;
        proxy_pass http://api:3000;
    }

    # http://localhost:8700/api2/hello -> proxy:3000/hello
    location /api2/ {
        add_header X-Config B;
        proxy_pass http://api:3000/;
    }

    # http://localhost:8700/api3/hello -> proxy:3000/hello/hello
    location /api3 {
        add_header X-Config C;
        proxy_pass http://api:3000/hello;
    }

    # http://localhost:8700/api4/hello -> proxy:3000//hello
    location /api4 {
        add_header X-Config D;
        proxy_pass http://api:3000/;
    }
}
```