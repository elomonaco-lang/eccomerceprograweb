# MusicTrack — Monorepo

> **Donde nace tu sonido.**
>
> E-commerce de instrumentos musicales (guitarras eléctricas, acústicas, bajos y accesorios) — proyecto académico para la materia **71.38 Programación Web**.

## Estructura

```
.
├── frontend/        # Next.js 14 + React 18 + CSS Modules
├── backend/         # Schema Supabase: migraciones SQL + seed
├── presentacion/    # Slides HTML del oral
├── README.md        # Este archivo
├── PRESENTACION.md  # Versión texto de las slides
├── PITCH.md         # Guion oral de 10 min
├── GUION.md         # Guion literal slide por slide
├── PROMPTS.md       # Documentación de prompts de IA (anexo módulo 4)
└── EXPLICACION_SLIDES.md  # Glosario detallado de cada término
```

## Quick start

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # opcional: completar con creds de Supabase
npm run dev                  # http://localhost:3000
```

Sin `.env.local` configurado, la app usa los **12 productos mock** de `frontend/src/data/products.js` como fallback. Apenas completes las env vars de Supabase, las páginas leen de la base real.

### Backend (Supabase)

1. Crear proyecto en [supabase.com](https://supabase.com).
2. SQL Editor → ejecutar [backend/supabase/migrations/001_init.sql](backend/supabase/migrations/001_init.sql) (4 tablas + RLS).
3. SQL Editor → ejecutar [backend/supabase/seed.sql](backend/supabase/seed.sql) (12 instrumentos).
4. Settings → API → copiar `Project URL` y `anon public key`.
5. Pegar en `frontend/.env.local`.

Detalle completo: [backend/README.md](backend/README.md).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 14** · App Router |
| Lenguaje | **JavaScript** ES6 modules |
| UI | React 18 · CSS Modules · HTML semántico |
| Estado global | React Context + `localStorage` |
| Backend | **Supabase** (PostgreSQL + RLS) |
| CI / Hosting | GitHub + **Vercel** |

## Funcionalidades

- Home con hero, instrumentos destacados, categorías, beneficios.
- Catálogo con búsqueda, filtro por categoría, ordenamiento.
- Detalle dinámico (`/productos/[id]`) **prerenderizado en build (SSG)**.
- Carrito persistido en `localStorage` bajo la key `musictrack_cart`.
- Checkout con validación → **POST a `/api/orders`** que inserta en Supabase.
- Order ID humano: `MT-XXXXXX`.

## Deploy

### Vercel (frontend)

1. Importar el repo en Vercel.
2. **Root Directory: `frontend`** (importante en monorepo).
3. Agregar las env vars (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en *Settings → Environment Variables*.
4. Deploy.

URL pública actual: [musictrack.vercel.app](https://musictrack.vercel.app).

### Backend

Supabase es totalmente gestionado: el "deploy" es ejecutar las migraciones y el seed desde el SQL Editor. No requiere infraestructura propia.

## Próximos pasos (módulos siguientes)

- **S11 · Auth**: Supabase Auth + completar `profiles` con trigger.
- **S12 · Admin panel**: rutas server-only para gestionar productos y órdenes.
- **S13–S15 · Mercado Pago**: checkout real + webhook que actualiza `orders.status`.

## Materiales del oral

- [presentacion/index.html](presentacion/index.html) — slides interactivas.
- [PITCH.md](PITCH.md) / [GUION.md](GUION.md) — guion del oral.
- [PROMPTS.md](PROMPTS.md) — anexo de prompts de IA.
- [EXPLICACION_SLIDES.md](EXPLICACION_SLIDES.md) — glosario.

## Licencia

Proyecto académico, sin fines comerciales.
