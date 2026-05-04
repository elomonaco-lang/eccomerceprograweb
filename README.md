# Origen — Cápsulas de café

> **Café de origen, en cada cápsula.**

Frontend de un e-commerce de cápsulas de café compatibles (tipo Nespresso) desarrollado con **Next.js** como proyecto académico para la materia **Programación Web**. Sitio totalmente funcional del lado del cliente, sin backend ni base de datos: los productos están mockeados localmente y el carrito se persiste en `localStorage`.

> El catálogo, la marca y los estilos son fácilmente personalizables (ver sección "Cómo personalizar").

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **JavaScript** (sin TypeScript)
- **CSS Modules** + CSS global con paleta basada en variables
- **HTML semántico** y diseño **responsive**
- Sin backend, sin base de datos, sin autenticación, sin pagos reales

## Estructura del proyecto

```
.
├── src/
│   ├── app/                 # Rutas (App Router)
│   │   ├── layout.js        # Layout raíz con Navbar y Footer
│   │   ├── page.js          # Home
│   │   ├── productos/       # Listado y detalle de cápsulas
│   │   ├── carrito/         # Vista del carrito
│   │   └── checkout/        # Checkout simple
│   ├── components/          # Componentes reutilizables
│   ├── context/             # CartContext (estado global)
│   ├── data/                # Catálogo de cápsulas mockeado
│   └── lib/                 # Helpers (formato de precio, etc.)
├── public/
├── next.config.mjs
├── jsconfig.json
└── package.json
```

## Catálogo

12 cápsulas de café distribuidas en 4 categorías:

- **Intenso** — Ristretto Forte, Espresso Italiano, Colombia Supremo, Brasil Santos Reserva
- **Suave** — Lungo Crema, Café con Leche, Etiopía Yirgacheffe
- **Descafeinado** — Descafeinado Premium, Descafeinado Lungo
- **Saborizado** — Vainilla Dolce, Caramelo Macchiato, Avellana Tostada

Cada producto representa una caja de 10 cápsulas.

## Funcionalidades

- Home con hero, cápsulas destacadas, categorías y beneficios.
- Catálogo con grilla responsive, **buscador** por nombre, **filtro** por categoría y **ordenamiento** por precio o nombre.
- Página de detalle dinámica para cada cápsula (`/productos/[id]`) con productos relacionados.
- Carrito global con React Context, persistido en `localStorage` bajo la key `origen_cart`.
  - Agregar / quitar / aumentar / disminuir cantidad / vaciar carrito.
  - Contador de productos en la Navbar.
- Checkout simple con formulario validado (nombre, email, teléfono, dirección, comentarios) y mensaje de confirmación con número de orden `ORG-XXXXXX`.
- Diseño responsive para desktop, tablet y mobile.

## Cómo correrlo

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar el entorno de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### 3. Build de producción

```bash
npm run build
npm start
```

### 4. Lint

```bash
npm run lint
```

## Cómo subirlo a GitHub

1. Crear un repositorio nuevo en GitHub.
2. Desde la carpeta del proyecto:

   ```bash
   git init
   git add .
   git commit -m "Origen — cápsulas de café"
   git branch -M main
   git remote add origin https://github.com/<TU-USUARIO>/<NOMBRE-DEL-REPO>.git
   git push -u origin main
   ```

## Cómo deployarlo en Vercel

1. Entrar a [https://vercel.com](https://vercel.com) e iniciar sesión con GitHub.
2. Click en **Add New… → Project** y elegir el repositorio recién creado.
3. Vercel detecta automáticamente que es Next.js. Dejar las opciones por defecto.
4. Click en **Deploy**.
5. En menos de un minuto la app va a estar online en una URL del estilo `https://<nombre-del-proyecto>.vercel.app`.

Cada `git push` a la rama principal va a generar un nuevo deploy automáticamente.

## Cómo personalizar

- **Catálogo:** editar [src/data/products.js](src/data/products.js) — cambiar nombres, precios, descripciones, categorías, stock o imágenes. Las imágenes pueden ser URLs públicas (Unsplash) o archivos locales en `public/`.
- **Marca / nombre:**
  - [src/components/Navbar.js](src/components/Navbar.js) — texto del brand y emoji/logo.
  - [src/components/Footer.js](src/components/Footer.js) — descripción del footer.
  - [src/app/layout.js](src/app/layout.js) — title y description SEO.
  - [src/app/page.js](src/app/page.js) — hero y bloque de beneficios.
- **Paleta de colores:** centralizada como variables CSS en [src/app/globals.css](src/app/globals.css) (`:root`). Cambiando 4 variables (`--color-primary`, `--color-accent`, `--color-bg`, `--color-text`) se rebrandea toda la UI.

## Qué falta / próximos pasos sugeridos

- Backend real (Next.js API Routes o Supabase) y base de datos de productos.
- Autenticación de usuarios y historial de pedidos.
- Pasarela de pagos (Mercado Pago, Stripe).
- Suscripción mensual a una caja sorpresa de cápsulas.
- Panel de administración para gestionar el catálogo.
- Tests automatizados.

## Licencia

Proyecto académico, sin fines comerciales.
