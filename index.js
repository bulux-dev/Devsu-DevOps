import sequelize from './shared/database/database.js'
import { usersRouter } from "./users/router.js"
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/api/users', usersRouter)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

async function startServer() {
  await sequelize.sync({ force: true })
  console.log('db is ready')

  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export { app, startServer }
