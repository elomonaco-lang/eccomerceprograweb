# Documentación de Prompts — Origen (cápsulas de café)

> Anexo del parcial oral de Programación Web (71.38). Lista los prompts más importantes utilizados con **Claude Code** durante el desarrollo del frontend de **Origen**, una tienda online de cápsulas de café compatibles. Los prompts están agrupados por feature. La idea es mostrar cómo se usó la IA de forma fundamentada: prompts específicos, validación, iteración.

---

## Índice

1. [Setup inicial Next.js](#1-setup-inicial-nextjs)
2. [Datos mock de productos](#2-datos-mock-de-productos)
3. [Estado global del carrito](#3-estado-global-del-carrito)
4. [Componentes reutilizables](#4-componentes-reutilizables)
5. [Páginas (Home, Catálogo, Detalle)](#5-páginas-home-catálogo-detalle)
6. [Carrito y Checkout](#6-carrito-y-checkout)
7. [Estilos y diseño responsive](#7-estilos-y-diseño-responsive)
8. [Deploy a Vercel y README](#8-deploy-a-vercel-y-readme)
9. [Rebrand del proyecto a Origen](#85-rebrand-del-proyecto-de-genérico-a-origen)
10. [Debugging y correcciones](#9-debugging-y-correcciones)
11. [Presentación del parcial](#10-presentación-del-parcial)

---

## 1. Setup inicial Next.js

### Prompt
> Necesito que crees desde cero un frontend para un e-commerce de **cápsulas de café compatibles** (tipo Nespresso) llamado **Origen**, para una materia de la facultad llamada Programación Web. Stack: Next.js 14 con App Router, JavaScript (no TypeScript), CSS Modules. Sin backend, sin DB, sin auth, sin pagos. Tiene que poder subirse a GitHub y deployarse en Vercel. Empezá creando: `package.json`, `next.config.mjs`, `jsconfig.json` con alias `@/*` apuntando a `src/*`, `.gitignore` y `.eslintrc.json`. No uses `create-next-app` — armá la estructura manualmente para tener control.

### Por qué este prompt
- **Limita el stack explícitamente** (no TS, no Tailwind, no librerías de UI) para evitar que la IA agregue cosas fuera de la consigna.
- **Pide la estructura mínima de config** en una sola pasada para no quedar atrapado en idas y vueltas.

### Validación
- Confirmé que el alias `@/*` funcionaba importando `@/data/products` desde una página.
- `npm install` + `npm run build` después de cada cambio de config.

---

## 2. Datos mock de productos (catálogo de cápsulas)

### Prompt
> Creá `src/data/products.js` con 12 cápsulas de café como productos. Cada una representa una caja de 10 cápsulas. Campos: id, name, price (en pesos argentinos, rango $4.990 a $11.990), description (incluyendo notas de cata: cuerpo, intensidad, aromas, origen si aplica), category, image (URL pública de Unsplash), stock. Categorías: **Intenso, Suave, Descafeinado, Saborizado**, distribuidas así: 4 intensos, 3 suaves, 2 descafeinados, 3 saborizados. Que haya cafés de origen único (Colombia, Brasil, Etiopía) en los intensos/suaves, y saborizados como vainilla, caramelo y avellana. Exportá también un array `categories` y dos helpers: `getProductById(id)` y `getRelatedProducts(productId, category, limit)` que filtre por misma categoría excluyendo el actual.

### Por qué este prompt
- Define el **shape del producto** (id, name, price, etc.) para que después todos los componentes puedan tipar mentalmente lo que reciben.
- **Pide los helpers** anticipando que los voy a usar en la página de detalle (productos relacionados).
- **Especifica la distribución por categoría** y nombres con sentido cafetero (origen único + saborizados típicos) para que el catálogo se sienta real, no genérico.

### Validación
- Verifiqué que las URLs de Unsplash se vieran correctamente (cápsulas, espresso, granos).
- Probé `getProductById(99)` para confirmar que devuelve `undefined` y la página de detalle dispara `notFound()`.
- Confirmé que el filtrado por categoría devuelve el conteo esperado (4 / 3 / 2 / 3).

---

## 3. Estado global del carrito

### Prompt
> Creá `src/context/CartContext.js`. Necesito un `CartProvider` y un hook `useCart()`. Funcionalidades: `addItem(product, quantity)`, `removeItem(id)`, `updateQuantity(id, qty)`, `increment(id)`, `decrement(id)`, `clearCart()`. Persistir en localStorage con la key `origen_cart`. **Importante:** evitar el bug de hidratación — no escribir en localStorage hasta haber leído primero, sino se pisa con el array vacío del primer render. Exponer también `totalItems`, `totalPrice` y un flag `hydrated`. Tiene que llevar `"use client"`.

### Por qué este prompt
- **El bug de hidratación es real y conocido.** Mencionarlo explícitamente fuerza a la IA a poner el flag `hydrated` y dos `useEffect` separados, no uno solo.
- Listar las funciones por nombre evita inconsistencias de naming en los componentes que las consumen.

### Validación
- Probé: agregar producto → recargar → debería seguir ahí. ✅
- Probé: agregar → vaciar → recargar → debería estar vacío. ✅
- Inspeccioné `localStorage` en DevTools para ver el JSON real.

---

## 4. Componentes reutilizables

### Prompt
> Creá los componentes en `src/components/` con su CSS Module al lado:
> - `Navbar.js`: links a Inicio / Productos / Carrito, badge con la cantidad del carrito (sólo si `hydrated`), menú hamburguesa para mobile, sticky en top.
> - `Footer.js`: 4 columnas (info, tienda, ayuda, redes), año dinámico.
> - `ProductCard.js`: imagen, categoría, nombre, precio, botón "Ver detalle" + "Agregar". Hover con leve elevación.
> - `ProductGrid.js`: grilla responsive 4/3/2/1 columnas. Mostrar `emptyMessage` si está vacío.
> - `ProductFilters.js`: input de búsqueda, select de categoría, select de orden (relevancia / precio asc / precio desc / nombre A-Z). Usar `onChange` callbacks pasados por props.
> - `CartItem.js`: imagen + info + selector de cantidad (+/-) + subtotal + botón quitar.
>
> Todos los botones deben tener hover. `aria-label` en botones sin texto. Bordes redondeados, sombra suave.

### Por qué este prompt
- **Lista todos los componentes en una pasada** para mantener consistencia visual (mismas variables CSS, mismas convenciones de naming).
- Las exigencias de **accesibilidad y hover** se piden explícitamente porque la IA tiende a omitirlas si no se mencionan.

### Validación
- Revisé que cada `<button>` sin texto visible tuviera `aria-label`.
- Probé el menú hamburguesa redimensionando a < 720px.

---

## 5. Páginas (Home, Catálogo, Detalle)

### Prompt
> Armá las páginas en `src/app/`:
>
> **`app/page.js` (Home):** hero con título *"Café de origen, en cada cápsula"*, subtítulo y dos botones (Ver cápsulas, Conocer más con anchor a `#beneficios`). Sección "Productos destacados" con las primeras 4 cápsulas. Sección de categorías (4 cards clicables que linkean a `/productos?categoria=Intenso`, etc.). Sección de beneficios (4 cards específicos del rubro: **Café fresco, Envío rápido, 100% compatibles, Orígenes seleccionados**).
>
> **`app/productos/page.js` (Catálogo):** Server Component que envuelve un Client Component `ProductsView` en `<Suspense>`. `ProductsView` lee `useSearchParams()` para precargar la categoría desde la URL, maneja estado local de búsqueda + filtro + orden, y renderiza el `ProductGrid` filtrado.
>
> **`app/productos/[id]/page.js` (Detalle):** dinámico con `generateStaticParams()` para SSG. Mostrar imagen grande, categoría, nombre, precio, descripción, meta (stock, código), `AddToCartButton` (Client Component aparte). Sección de productos relacionados al final usando `getRelatedProducts`. Si el id no existe, `notFound()`.

### Por qué este prompt
- **Especifica explícitamente Server vs Client Component** para evitar que la IA marque toda la página como `"use client"` por inercia.
- Pide `<Suspense>` alrededor de `useSearchParams` porque sin eso el build estático falla.
- `generateStaticParams` queda claro para SSG.

### Validación
- `npm run build` muestra `● (SSG)` para `/productos/[id]` y los 12 paths generados.
- Navegar a `/productos/999` debería ir al `not-found.js` correspondiente. ✅

---

## 6. Carrito y Checkout

### Prompt
> **`app/carrito/page.js`:** vista del carrito leyendo `useCart()`. Si está vacío, mostrar empty state con CTA. Si tiene items, layout en dos columnas (lista de items + sidebar con resumen). Resumen: subtotal por cantidad de productos, envío "A calcular", total. Botón "Vaciar carrito", botón "Seguir comprando" y botón "Finalizar compra" que linkea a `/checkout`. No renderizar nada hasta `hydrated === true`.
>
> **`app/checkout/page.js`:** formulario con nombre, email, teléfono, dirección, comentarios. Validación manual:
> - Nombre obligatorio.
> - Email obligatorio + regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
> - Teléfono: al menos 6 dígitos numéricos.
> - Dirección obligatoria.
> Errores en `useState` mostrados debajo de cada campo. Al hacer submit válido: generar un orderId tipo `ORG-123456`, mostrar pantalla de éxito con número de orden, total, email, y dos botones (volver / seguir comprando). Vaciar el carrito al confirmar.

### Por qué este prompt
- **Detalla las reglas de validación** exactas para que el profe pueda verlas en el código y coincidan con la presentación.
- Pide explícitamente **vaciar el carrito al confirmar** — comportamiento esperado en e-commerce.

### Validación
- Probé el form sin completar nada → 4 errores. ✅
- Email "asd" → error. Email "asd@asd" → error. Email "asd@asd.com" → pasa. ✅
- Después de confirmar, navegar al carrito muestra el empty state. ✅

---

## 7. Estilos y diseño responsive

### Prompt
> Configurá los estilos globales en `src/app/globals.css`. Variables CSS en `:root` para colores, sombras, radios, max-width. Reset básico. Clases utilitarias: `.container`, `.btn`, `.btn-accent`, `.btn-outline`, `.btn-danger`, `.btn-block`, `.section`, `.section-title`, `.text-muted`. **Paleta inspirada en café:** crema claro (`#faf6f0`) como fondo, espresso oscuro (`#3e2723`) como primario, caramelo/cobre (`#b87333`) como acento, marrón profundo como texto. Body con `display: flex; flex-direction: column` para que el footer quede al fondo.

### Prompt complementario
> Asegurate de que en cada `*.module.css` haya media queries para breakpoints de 1024px, 768px, 480px. Grilla del catálogo: 4 → 3 → 2 → 1 columnas. Layout del carrito y checkout: dos columnas en desktop, una sola debajo de 900px.

### Validación
- Redimensioné la ventana en cada breakpoint y verifiqué que no se rompiera el layout.
- Confirmé que las variables CSS centralizadas permiten **cambiar la paleta en un solo lugar**.

---

## 8. Deploy a Vercel y README

### Prompt
> Generá un `README.md` claro para el proyecto **Origen** (cápsulas de café). Incluí: nombre y tagline (*"Café de origen, en cada cápsula"*), descripción de qué hace, stack, estructura de carpetas, listado del catálogo agrupado por categoría, funcionalidades implementadas, instrucciones para `npm install` / `npm run dev` / `npm run build`, pasos exactos para subir a GitHub (con los comandos `git init`, `git remote add`, etc.), pasos para deployar en Vercel (login con GitHub, Add New Project, deploy automático). Sección de "qué falta" honesta: backend, auth, pagos, suscripción mensual. Sección de "cómo personalizar" mostrando dónde editar el catálogo, la marca y los colores (las 4 variables CSS en `:root`).

### Por qué este prompt
- Pide **comandos exactos** para que el lector (y yo durante el oral) pueda copiar/pegar.
- La sección "qué falta" es honesta y muestra que entiendo los límites del entregable.

---

## 8.5. Rebrand del proyecto (de genérico a Origen)

### Prompt
> Quiero rebrandear el e-commerce a una marca específica: **Origen**, una tienda de cápsulas de café compatibles. Aplicá el rebrand completo: (1) reemplazá los 12 productos genéricos por 12 cápsulas reales con cuatro categorías nuevas (Intenso / Suave / Descafeinado / Saborizado), nombres con sentido cafetero y descripciones con notas de cata; (2) cambiá la paleta a tonos café (crema de fondo, espresso oscuro como primario, caramelo como acento) modificando solo las variables CSS en `:root`; (3) actualizá el logo a un emoji de café, el nombre a "Origen", la metadata SEO, el copy del hero y los beneficios; (4) cambiá la storage key del carrito de `webcommerce_cart` a `origen_cart` y el prefijo del orderId de `WC-` a `ORG-`; (5) actualizá el README para reflejar el catálogo y la marca. Verificá con `npm run build` que siga compilando.

### Por qué este prompt
- **Demuestra que la app está bien arquitecturada:** un solo prompt rebrandea toda la UI porque los colores están centralizados en variables CSS y el catálogo en un único archivo.
- **El rebrand es una prueba de extensibilidad** — un argumento que vale la pena traer al oral si el profe pregunta por mantenibilidad.

### Validación
- Después del rebrand, `npm run build` siguió compilando las 19 páginas en limpio.
- Probé que las URLs de query (`/productos?categoria=Intenso`) sigan funcionando con las categorías nuevas.
- Verifiqué que el carrito viejo en localStorage (con la key `webcommerce_cart`) no rompa la app — el nuevo provider arranca con array vacío bajo `origen_cart`.

---

## 9. Debugging y correcciones

### Prompt 9.1 — Build estático rompía con `useSearchParams`
> El `npm run build` falla en `app/productos/page.js` con un error sobre `useSearchParams` y `Suspense`. ¿Cuál es la solución correcta para Next.js 14 App Router?

**Resultado:** la IA explicó que `useSearchParams` requiere un Suspense boundary para SSG. Refactor: `page.js` queda como Server Component que renderiza `<Suspense fallback="Cargando..."><ProductsView /></Suspense>`, y `ProductsView.js` (nuevo archivo) lleva `"use client"` y consume `useSearchParams`. **Entendí el porqué:** durante el prerender no hay query string, así que React necesita un fallback para suspender hasta el hidrate.

### Prompt 9.2 — Aviso de seguridad en Next.js
> Después de `npm install` aparece un aviso de seguridad para `next@14.2.5`. ¿Hay un patch dentro de la rama 14.x?

**Resultado:** actualicé a `next@^14.2.34`. Re-validé con `npm run build` y `npm run lint`.

### Prompt 9.3 — Mismatch de hidratación en el badge del carrito
> Cuando recargo la página estando con productos en el carrito, el badge del navbar parpadea: muestra "0" un instante y después salta al número real. ¿Por qué?

**Resultado:** durante el SSR el Provider arranca con `items = []` (no hay localStorage en el server). En el cliente, el `useEffect` lee localStorage y actualiza. La solución fue **no renderizar el badge hasta `hydrated === true`**: `{hydrated && totalItems > 0 && <span>...</span>}`. Esto es exactamente lo que muestra `Navbar.js`.

---

## 10. Presentación del parcial

### Prompt
> Armá la presentación del parcial oral en Markdown (5-6 slides separadas por `---`). Antes de escribirla, revisá el repo y marcá honestamente qué cosas del rúbrica no están implementadas (por ejemplo: Supabase, fetch async, variables de entorno) — esos puntos van como "pendiente", **no se inventan**, porque el profe va a tener acceso al código. Diagrama de arquitectura en Mermaid con los 6 elementos requeridos: usuario + navegador, separación HTML/CSS/JS, componentes reales del repo, flechas de flujo, re-render por state, pipeline de deploy.

### Por qué este prompt
- **El "marcá honestamente" es la línea más importante**: sin eso la IA tiende a rellenar con tecnologías que no están en el repo, y eso explota durante el oral.
- Pedir el diagrama en Mermaid permite editarlo después y mantenerlo en el mismo archivo de la presentación.

---

## Reflexión final sobre el uso de IA

**Lo que aporté yo:**
- Decisiones arquitectónicas (Context vs Redux, mock data vs Supabase para este alcance, qué componentes son Client).
- Validación crítica con `npm run build`, lint y testeo manual.
- Cortar sugerencias fuera de scope (Tailwind, librerías de UI, TypeScript).
- Honestidad sobre lo no implementado.

**Lo que aportó la IA:**
- Boilerplate (CSS Modules con breakpoints, plumbing de props, regex de validación).
- Detección y explicación de errores como el de `Suspense + useSearchParams`.
- Generación rápida de los 12 productos mock con descripciones coherentes.

**Lo que no delegué:**
- Entender por qué hay dos `useEffect` en el `CartContext` y por qué uno depende de `[]` y el otro de `[items, hydrated]`.
- Entender por qué `generateStaticParams` necesita strings.
- Entender la diferencia entre Server y Client Components y decidir caso por caso.
