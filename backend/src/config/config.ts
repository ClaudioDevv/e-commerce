import dotenv from 'dotenv'
dotenv.config()

interface Config {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  database: {
    url: string;
  };
  jwt: {
    accessTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenSecret: string;
    refreshTokenExpiry: string;
  };
  bcrypt: {
    saltRounds: number;
  };
}

// Validar variables críticas
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
]

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(
    `Faltan variables de entorno: ${missingEnvVars.join(', ')}\n` +
      'Comprueba tu archivo .env.'
  )
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '90d',
  },

  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  },
}

export default config
