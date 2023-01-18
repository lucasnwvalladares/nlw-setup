import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import { appRoutes } from "./routes"

const app = Fastify()

app.register(fastifyCors)
app.register(appRoutes)

app.listen({
  port: 3333,
}).then(() => {
  console.log('Server runing on port 3333')
})