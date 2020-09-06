# RateLimit-Server

此專案為在一個 http server 上建立『 ip 的限流服務 』。

> 在 60 秒內，每個 ip 只能進入 10 次，超過則回應錯誤。

## Tech

* Nodejs V10.15.3
* Redis
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

"error":"To many request ! Please wait 48 sec"}
```

## Design Process

### Step 1. 設計測試案例 

### Step 2. 設計基礎架構 

### Step 3. Redis 選擇與計數處理

### Step 4. 後續擴展問題

