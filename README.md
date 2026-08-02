# Portafolio — Santiago Nieto

Portafolio profesional de desarrollo de software, generado en tiempo de ejecución y sincronizado automáticamente con la cuenta de GitHub [@santiagonieto09](https://github.com/santiagonieto09). Proyectos, tecnologías, releases y estadísticas se obtienen en vivo desde la API de GitHub.

## Tecnologías

![TanStack Start](https://img.shields.io/badge/TanStack%20Start-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-F9F1E1?style=for-the-badge&logo=bun&logoColor=black)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![GitHub API](https://img.shields.io/badge/GitHub%20API-181717?style=for-the-badge&logo=github&logoColor=white)

## Características

- **Perfil y redes** — Datos del usuario, avatar y enlaces a redes sociales obtenidos de GitHub.
- **Estadísticas** — Total de repositorios, estrellas, forks y releases con sincronización semanal.
- **Lenguajes** — Distribución de lenguajes por bytes de código con gráficos y colores oficiales de GitHub.
- **Explorador de repositorios** — Búsqueda y filtrado por nombre, tecnología, estado y tema; badges de tecnologías detectadas automáticamente.
- **Actividad reciente** — Feed con los últimos eventos públicos (commits, releases, PRs, stars).
- **SSR y SEO** — Renderizado en servidor, metadatos Open Graph, Twitter Card, sitemap y JSON-LD.
- **Modo degradado** — Si la API de GitHub no responde, se sirve el último snapshot en caché en lugar de romper la página.

## Estructura del proyecto

```
src/
├── components/
│   ├── portfolio/     # Componentes específicos del portafolio
│   └── ui/            # Componentes de interfaz (shadcn/ui + Radix)
├── domain/
│   ├── github/        # Tipos, detección de tecnologías y colores de lenguajes
│   └── portfolio/     # Lógica de consultas del portafolio
├── infrastructure/
│   └── github/        # Cliente de la API de GitHub (solo servidor)
├── lib/               # Utilidades, queries y server functions
└── routes/            # Rutas de TanStack Router (página, sitemap, API)
```

## Requisitos

- [Bun](https://bun.sh) 1.x (o [Node.js](https://nodejs.org) 20+ y npm)
- Cuenta de GitHub (opcional: token para ampliar el límite de peticiones)

## Instalación

```bash
# Clonar el repositorio
git clone <this-repository-url>
cd <repository-name>

# Instalar dependencias
bun install

# Configurar variables de entorno (opcional)
cp .env.example .env   # o crea .env con GITHUB_TOKEN y CRON_SECRET

# Iniciar en modo desarrollo
bun run dev
```

Abre `http://localhost:5173` para ver el proyecto en desarrollo.

## Variables de entorno

| Variable | Descripción | Requerida |
| --- | --- | --- |
| `GITHUB_TOKEN` | Token personal de GitHub para evitar el límite de peticiones | No |
| `CRON_SECRET` | Secreto compartido para proteger el endpoint `/api/public/sync` | No |

## Scripts

| Comando | Descripción |
| --- | --- |
| `bun run dev` | Inicia el servidor de desarrollo |
| `bun run build` | Compila el proyecto para producción |
| `bun run build:dev` | Compila en modo desarrollo |
| `bun run preview` | Previsualiza la build de producción |
| `bun run lint` | Ejecuta ESLint |
| `bun run format` | Formatea el código con Prettier |

## Sincronización con GitHub

El portafolio consulta la API de GitHub en cada carga y mantiene una caché en memoria. Para forzar la actualización semanalmente existe el endpoint protegido `GET /api/public/sync`, configurable con un cron:

```bash
# Ejemplo de programación: lunes a las 06:00
0 6 * * 1  curl -X GET https://<dominio>/api/public/sync -H "x-cron-secret: $CRON_SECRET"
```

## Licencia

© Santiago Nieto. Todos los derechos reservados.
