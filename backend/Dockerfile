# ==================================
# STAGE 1: Dependencias base
# ==================================
FROM node:20-alpine AS base

# Instala pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copia archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# ==================================
# STAGE 2: Desarrollo
# ==================================
FROM base AS development

# Pasar argumento en build  *********
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Instala todas las dependencias
RUN pnpm install --frozen-lockfile

# Copia el código fuente
COPY . .

# Expone el puerto
EXPOSE 3000

# Genera cliente de Prisma en build time, esto es lo añadido ***********
RUN pnpm prisma generate

# Iniciar proyecto con hot reload
CMD ["pnpm", "run", "dev"]


# ==================================
# STAGE 3: Builder (compilación)
# ==================================
FROM base AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Instala todas las dependencias para compilar
RUN pnpm install --frozen-lockfile

# Copia código fuente
COPY . .

# Genera cliente de Prisma
RUN pnpm prisma generate

# Compila TypeScript
RUN pnpm run build


# ==================================
# STAGE 4: Producción
# ==================================
FROM node:20-alpine AS production

# Instala pnpm y dumb-init
RUN npm install -g pnpm && \
    apk add --no-cache dumb-init

WORKDIR /app

# Copia package.json para instalar solo dependencias de producción
COPY package.json pnpm-lock.yaml ./

# Instala SOLO dependencias de producción
RUN pnpm install --prod --frozen-lockfile && \
    pnpm store prune

# Copia el esquema de Prisma y genera el cliente
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

# Crea usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Cambia al usuario no-root
USER nodejs

# Usa dumb-init para manejar señales
ENTRYPOINT ["dumb-init", "--"]

EXPOSE 3000

# Variable de entorno por defecto
ENV NODE_ENV=production

# Comando para producción
CMD ["pnpm", "start"]