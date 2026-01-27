# 🍕 E-commerce pizzería
MVP de una aplicación web para gestionar una pizzería online

### Descripción
Proyecto personal de e-commerce especializado en pizzería, desarrollado como un monorepo que incluye un backend robusto con Node.js + TypeScript y un frontend moderno con React.

## Backend
- Node.js
- Typescript
- Express

## Frontend
- React
- Typescript

## 📁 Estructura del proyecto
e-commerce/
├── backend/          # API REST con Node.js + TypeScript  
│   ├── src/  
│   │   ├── config/  
│   │   ├── controllers/  
│   │   ├── middlewares/  
│   │   ├── models/  
│   │   ├── routes/  
│   │   ├── app.ts  
│   │   └── server.ts  
│   ├── tests/  
│   └── package.json  
└── frontend/  

## Instalación
### Requisitos previos
- Node v22
- pnpm

### Clonar repositorio
git clone https://github.com/ClaudioDevv/e-commerce.git  
cd e-commerce

### Instalar dependencias del backend
cd backend  
pnpm install

## Uso
### Ejecutar el backend en modo desarrollo
cd backend  
pnpm run dev

# Levanta DB + Backend en modo dev (con hot-reload)
docker-compose --profile dev up --build

# Levanta DB + Backend en modo producción (optimizado)
docker-compose --profile prod up --build

## Autor
Claudio Rivas
- Github: @ClaudioDevv
