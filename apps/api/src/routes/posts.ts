import { FastifyInstance } from "fastify"
import { prisma } from "../db.js"
import { redis } from "../redis.js"

export async function postsRoutes(app: FastifyInstance) {
  app.get("/posts", async (req, reply) => {
    const cacheKey = "posts:all"

    const cached = await redis.get(cacheKey)
    if (cached) {
      reply.header("x-cache", "HIT")
      return JSON.parse(cached)
    }

    const posts = await prisma.post.findMany()

    await redis.setex(cacheKey, 60, JSON.stringify(posts))
    reply.header("x-cache", "MISS")
    return posts
  })

  app.post("/posts", async (req) => {
    const { title, content } = req.body as any
    const post = await prisma.post.create({
      data: { title, content }
    })
    await redis.del("posts:all")
    return post
  })
}