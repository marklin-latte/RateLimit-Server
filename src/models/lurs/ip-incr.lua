-- ip-incr.lua

local key = KEYS[1]
local max = tonumber(ARGV[1])
local ttl = tonumber(ARGV[2])
local current = tonumber(ARGV[3])
local user = redis.call("HGETALL", key)
local reset_time = tonumber(user[4])
local count = tonumber(user[2])
local result = {}

if(#user == 0 or reset_time < current)
then
    reset_time = current + (ttl * 1000)
    redis.call("HMSET", key, "count", 1, "reset_time", reset_time)
    redis.call("EXPIRE", key, ttl)
    result[1] = 1
    result[2] = reset_time 
    return result
end

if(count < max)
then
    redis.call("HINCRBY", key, "count", 1)
    result[1] = count + 1
    result[2] = reset_time 
    return result 
end

result[1] = count + 1
result[2] = reset_time
return result 
