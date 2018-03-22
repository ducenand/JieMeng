# 周公解梦数据抓取

抓取链接：http://tools.2345.com/zhgjm.htm

目标：周公解梦所有数据

## step1 npm install 

安装puppeteer、mysql等抓包工具、mysql服务。

## step2 创建mysql数据表，配置mysql.config.js

数据库sql 在config/data.sql，自行运行创建

配置config/mysql.config.js

## step3 配置jm.config.js

1.按分组抓取
配置config/jm.config.js，填写分组id，分组对应的url.

> 运行 
```
npm run index
```

2.关键词抓取完成后,抓取keywords表中href链接
> 运行
```
npm run details
```


 

