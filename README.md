# RateLimit-Server

此專案為在一個 http server 上建立『 ip 的限流服務 』。

> 在 60 秒內，每個 ip 只能進入 10 次，超過則回應錯誤。

## Tech

* Nodejs V10.15.3
* Redis 6
* Docker
* Mocha

## Quick Start

### Service Start

```
git clone https://github.com/h091237557/RateLimit-Server.git
npm install
npm run docker-start
```

### Operation

以下為測試範例。

```
curl 127.0.0.1:3000/status

{ 
   "ip":"192.168.1.1",
   "count": 1, ( 此 ip 在 1 分鐘內已發送的次數 )
   "ttl":60 ( 重置時間 )
}
```

而當在 60 秒內，發送操過 10 次以後的結獰。

```
curl 127.0.0.1:3000/status

{"error":"To many request ! Please wait 48 sec"}
```

### Test

```
npm run docker-test
```

```
Given:
   The client did not do anything
When
   The client performes 2 times request
Then 
   Should return 200 http code
   And total counts equal 2 times. 

Given:
   The client had performed max times in a minutes
When
   The client performes 1 times in the minutes
Then
   Should return error http code 429

Given:
   The client had performed max times request at 61 sec ago
When
   The client performes 1 times request
Then
   Should return 200 http code
   And total counts equal 1 times. 
```

## Design Process

### [請參考此份文件](https://github.com/h091237557/RateLimit-Server/wiki/Design-Process)


