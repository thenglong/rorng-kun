import * as express from "express"

import * as expressWinston from "express-winston"
import helmet from "helmet"
import * as winston from "winston"

import { API_BASE_URL } from "./app/constants/api.constants"
import prisma from "./app/database/prisma-client"
import movieRouter from "./app/routes/movie.route"

const app = express()

//  apply middlewares
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.simple(),
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  meta: false,
})
app.use(requestLogger)
app.use(express.json())
app.use(helmet())

app.get("/api", async (req, res) => {
  const r = await prisma.user.findMany({
    where: { email: { contains: "r", mode: "default" } },
    take: 1,
  })
  res.json({ message: "Welcome to rorng-kun-be!", data: r })
})

app.use(`${API_BASE_URL}/movies`, movieRouter)

const port = process.env.port || 3333
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}/api`)
})

// eslint-disable-next-line no-console
server.on("error", console.error)
