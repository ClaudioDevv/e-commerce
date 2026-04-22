# 🍕 Pizzería E-commerce — Fullstack MVP

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

MVP de una plataforma de e-commerce de alto rendimiento para una pizzería, con fuerte enfoque en la **robustez del backend, seguridad y escalabilidad**. El proyecto implementa una arquitectura profesional preparada para producción.

---

## 🚀 Aspectos Técnicos

- **Backend Type-Safe** — Implementación integral de TypeScript con validaciones en tiempo de ejecución mediante **Zod**.
- **Autenticación Avanzada** — Sistema completo con **JWT** utilizando la estrategia *Access & Refresh Tokens* para sesiones seguras y persistentes.
- **Gestión de Pagos Real** — Integración de **Stripe** con manejo de **Webhooks** para garantizar la integridad de las transacciones.
- **Arquitectura de Datos** — **Prisma ORM** sobre **PostgreSQL**, con migraciones controladas y consultas eficientes.
- **Resiliencia** — **Rate Limiting** para prevenir ataques de fuerza bruta y **logging con Winston** para trazabilidad de errores.

---

## 🛠️ Stack Tecnológico

### Backend
| Capa | Tecnología |
|---|---|
| Runtime | Node.js v22 |
| Framework | Express.js + TypeScript |
| Base de datos | PostgreSQL + Prisma ORM |
| Validación | Zod |
| Seguridad | Bcrypt, JWT, CORS, Helmet |
| Logs | Winston |

### Frontend
| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router) |
| Estilos | Tailwind CSS |
| Estado | LocalStorage (carrito anónimo) + DB Sync (usuario autenticado) |

### Infraestructura / DevOps
| Herramienta | Uso |
|---|---|
| Docker & Docker Compose | Containerización con perfiles Dev/Prod |
| pnpm | Gestor de paquetes (Monorepo) |

---

## 📁 Estructura del Proyecto

```
e-commerce/
├── backend/                # API REST
│   └── src/
│       ├── config/         # Variables de entorno y constantes
│       ├── controllers/    # Lógica de orquestación
│       ├── middlewares/    # Auth, validaciones, error handling
│       ├── models/         # Definición de tipos y esquemas
│       ├── routes/         # Definición de endpoints
│       ├── services/       # Lógica de negocio (Stripe, Auth...)
│       └── app.ts          # Configuración de Express
├── frontend/               # Cliente en Next.js
└── docker-compose.yml      # Orquestación de servicios
```

---

## ⚙️ Instalación y Uso

### Requisitos previos

- Node.js v22
- pnpm (`npm install -g pnpm`)
- Docker (opcional, para levantar la base de datos)

### 1. Clonar el repositorio

```bash
git clone https://github.com/ClaudioDevv/e-commerce.git
cd e-commerce
```

### 2. Configurar variables de entorno

Crear un archivo `.env` dentro de `/backend`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/pizzeria"
JWT_ACCESS_SECRET="tu_secreto_access"
JWT_REFRESH_SECRET="tu_secreto_refresh"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Instalar dependencias

```bash
pnpm install
```

### 4. Ejecutar con Docker (recomendado)

```bash
# Modo desarrollo (con hot-reload)
docker-compose --profile dev up --build

# Modo producción (optimizado)
docker-compose --profile prod up --build
```

---

## 👤 Autor

**Claudio Rivas** — Ingeniería Informática, especialización en Backend y futuro DevOps.

[![GitHub](https://img.shields.io/badge/GitHub-@ClaudioDevv-181717?style=flat&logo=github)](https://github.com/ClaudioDevv)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/claudio-rivas-boza)
