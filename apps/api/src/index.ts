import Fastify from "fastify"
import cors from "@fastify/cors"

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  credentials: true
})

app.get("/health", async () => {
  return { status: "ok" }
})

const port = Number(process.env.PORT) || 3001

await app.listen({ port, host: "0.0.0.0" })
console.log(`API attiva su http://localhost:${port}`)