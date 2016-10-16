# 个人博客网站
> 主要用于学习nodejs，以及开发完整的项目

### 依赖的npm包
- **express** ： 项目主体框架
- **less** ： 支持less
- **less-middleware** ： less于nodejs集成的中间件，编译less文件等
- **grunt**：nodejs项目管理工具
```
// 全局安装grunt管理工具
npm install -g grunt-cli
```

> 网站所有静态文件全部交由nginx进行管理

**nginx配置文件**
```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;
	rewrite_log on;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;
		root D:/src/personal-site/webapp;
		
		location ~* \.(js|css|html)$ {
			root D:/src/personal-site/webapp;
		}
		
		location /api/ {
			proxy_pass http://127.0.0.1:8888;
		}

        location / {
			add_header Pragma "no-cache";
			add_header Cache-Control "no-store, no-cache, must-revalidate, post-check=0, pre-check=0";
			try_files $uri $uri/ /index.html =404;
			#proxy_pass   http://127.0.0.1:8888;
            #root   html;
            #index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```