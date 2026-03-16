import Redis from "ioredis"

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  lazyConnect: true
})

redis.on("connect", () => console.log("Redis connesso"))
redis.on("error", (err) => console.error("Redis errore:", err))