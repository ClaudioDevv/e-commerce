import app from './app'
import config from './config/config'
import { prisma } from './lib/prisma'

async function startServer () {
  try {
    await prisma.$connect()
    console.log('✅ Conexión con PostgreSQL establecida')

    app.listen(config.port, () => {
      console.log(`Escuchando en http://localhost:${config.port}`)
    })
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error)
    process.exit(1)
  }
}

startServer()

// Detectar desconexión en runtime
process.on('SIGINT', async () => {
  console.log('⚠️ Recibida señal SIGINT, cerrando conexiones...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('⚠️ Recibida señal SIGTERM, cerrando conexiones...')
  await prisma.$disconnect()
  process.exit(0)
})
