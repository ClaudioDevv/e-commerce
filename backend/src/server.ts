import app from './app'
import config from './config/config'
import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' }
  ]
})

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
prisma.$on('error', (e) => {
  console.error('⚠️ Prisma perdió conexión con la BD:', e)
  // Reintentar o delegar a PM2 / Docker reinicio
})
