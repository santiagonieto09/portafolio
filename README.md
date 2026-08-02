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

| Variable       | Descripción                                                     | Requerida |
| -------------- | --------------------------------------------------------------- | --------- |
| `GITHUB_TOKEN` | Token personal de GitHub para evitar el límite de peticiones    | No        |
| `CRON_SECRET`  | Secreto compartido para proteger el endpoint `/api/public/sync` | No        |
| `SITE_URL`     | URL canónica del sitio (para sitemap y metadatos)               | No        |

## Scripts

| Comando             | Descripción                         |
| ------------------- | ----------------------------------- |
| `bun run dev`       | Inicia el servidor de desarrollo    |
| `bun run build`     | Compila el proyecto para producción |
| `bun run build:dev` | Compila en modo desarrollo          |
| `bun run preview`   | Previsualiza la build de producción |
| `bun run lint`      | Ejecuta ESLint                      |
| `bun run format`    | Formatea el código con Prettier     |

## Sincronización con GitHub

El portafolio consulta la API de GitHub en cada carga y mantiene una caché en memoria. Para forzar la actualización semanalmente existe el endpoint protegido `POST /api/public/sync`, configurable con un cron:

```bash
# Ejemplo de programación: lunes a las 06:00
0 6 * * 1  curl -X POST https://<dominio>/api/public/sync -H "x-cron-secret: $CRON_SECRET"
```

> Nota: el endpoint solo acepta `POST` y exige la cabecera `x-cron-secret`. Vercel Cron no puede enviar cabeceras personalizadas, por lo que para programarlo se recomienda un [GitHub Actions workflow](https://docs.github.com/actions) con un `curl` como el de arriba.

## Despliegue en Vercel

La aplicación usa renderizado en servidor (TanStack Start + Nitro), por lo que necesita un host con runtime de servidor. El preset `vercel` de Nitro genera la [Build Output API](https://vercel.com/docs/build-output-api) (`.vercel/output`) durante `bun run build`; Vercel sirve los estáticos y ejecuta el resto como una serverless function.

1. Sube el repositorio a GitHub y conéctalo en [Vercel](https://vercel.com/new).
2. Verifica la configuración del proyecto (o ajústala en `vercel.json`):
   - **Framework preset:** `Other` (`framework: null`).
   - **Install command:** `bun install`.
   - **Build command:** `bun run build`.
   - **Output directory:** se detecta automáticamente (Build Output API, no la configures manualmente).
3. Añade las variables de entorno en Vercel (Project → Settings → Environment Variables):
   - `GITHUB_TOKEN` — evita el límite de peticiones a la API de GitHub.
   - `CRON_SECRET` — para proteger el endpoint de sincronización.
   - `SITE_URL` — la URL canónica final, p. ej. `https://santiagonieto.vercel.app`.
4. Despliega. Cada push a `main` genera un nuevo deployment.

Los encabezados de seguridad (CSP, HSTS, etc.) se aplican en tiempo de ejecución desde `src/start.ts`, por lo que no se configuran en `vercel.json`. En Vercel la caché del snapshot usa memoria en lugar de la Cache API de Cloudflare; con `GITHUB_TOKEN` configurado el límite de peticiones no es un problema.

## Licencia

© Santiago Nieto. Todos los derechos reservados.
