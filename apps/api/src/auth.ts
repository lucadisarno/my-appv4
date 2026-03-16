import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./db.js"
import { redis } from "./redis.js"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: "http://localhost:3001",
  basePath: "/auth",
  secondaryStorage: {
    get: async (key) => redis.get(key),
    set: async (key, value, ttl) => {
      if (ttl) await redis.setex(key, ttl, value)
      else await redis.set(key, value)
    },
    delete: async (key) => { await redis.del(key) }
  }
})

