// Load and type environment variables
import dotenv from 'dotenv'
dotenv.config()

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  bcrypt: {
    saltRounds: number;
  };
}

// Validar variables críticas
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET'
]

const missingEnvVars = requiredEnvVars.filter(
  envVar => !process.env[envVar]
)

if (missingEnvVars.length > 0) {
  throw new Error(
    `Faltan variables de entorno: ${missingEnvVars.join(', ')}\n` +
    'Comprueba tu archivo .env.'
  )
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  },
}

export default config
