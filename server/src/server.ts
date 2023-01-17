import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import { PrismaClient } from "@prisma/client"

const app = Fastify()
const prisma = new PrismaClient()

app.register(fastifyCors)

app.get('/hello', async () => {
  const habits = await prisma.habit.findMany({
    where: {
      title: {
        startsWith: 'Fazer'
      }
    }
  })
  return habits
})

app.listen({
  port: 3333,
}).then(() => {
  console.log('Server runing on port 3333')
})