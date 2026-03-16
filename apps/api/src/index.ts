import Fastify from "fastify"
import cors from "@fastify/cors"
import { auth } from "./auth.js"
import { toNodeHandler } from "better-auth/node"

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  credentials: true
} as any)

app.get("/health", async () => {
  return { status: "ok" }
})

app.all("/auth/*", async (req, reply) => {
  const handler = toNodeHandler(auth)
  await handler(req.raw, reply.raw)
  reply.hijack()
})

const port = Number(process.env.PORT) || 3001

import { postsRoutes } from "./routes/posts.js"

app.register(postsRoutes, { prefix: "/api" })

await app.listen({ port, host: "0.0.0.0" })
console.log(`API attiva su http://localhost:${port}`)
