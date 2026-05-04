# Glosario detallado de las slides — MusicTrack

> Este archivo explica cada término, concepto y referencia que aparece en las 7 slides. Pensado para que puedas **defender en el oral cualquier cosa que diga la pantalla**, sin que te agarren con un "¿qué quisiste decir con X?".
>
> Cada slide tiene tres bloques:
> 1. **Qué dice literalmente** — el texto que se ve.
> 2. **Qué significa cada parte** — definición y contexto.
> 3. **Cómo defenderlo** — qué responder si el profe pregunta.

---

## 📄 Slide 1 — Portada

### Qué dice
- Título: **MusicTrack · instrumentos musicales**
- Subtítulo: *"Donde nace tu sonido."* + descripción del producto
- Tabla de stack con 6 filas:
  - Framework: Next.js 14 · App Router
  - Lenguaje: JavaScript · ES6 modules
  - UI: React 18 · CSS Modules · HTML semántico
  - Estado global: React Context + localStorage
  - Datos: 12 instrumentos en `src/data/products.js` · 4 categorías · *backend pendiente*
  - CI / Hosting: GitHub + Vercel · deploy automático

### Qué significa cada cosa

#### Next.js 14
- **Framework** = un "kit de herramientas" sobre React que agrega cosas que React solo no tiene (ruteo, optimización, build, server-side rendering).
- **Versión 14** es la mayor estable; usa el **App Router** (la API nueva, basada en carpetas en `app/`).
- Alternativa que NO usé: el "Pages Router" (la API vieja, basada en `pages/`). Lo aclaro porque a veces se mezclan.

#### App Router
- Sistema de ruteo donde **cada carpeta dentro de `app/` se convierte en una URL**.
- Ejemplo: `app/carrito/page.js` → `/carrito`.
- Soporta rutas dinámicas (carpeta entre corchetes: `[id]`), layouts compartidos, Server Components y Client Components.

#### JavaScript ES6 modules
- **ES6** = ECMAScript 2015, la versión que estandarizó muchas features modernas (`let`, `const`, arrow functions, `import`/`export`).
- **Modules** = sistema para dividir código en archivos: cada archivo exporta cosas y otro las importa.
- Ejemplo en mi repo: `export const products = [...]` en [products.js](src/data/products.js), `import { products } from "@/data/products"` en otra página.

#### React 18
- **React** = librería para construir interfaces componiendo "componentes" (funciones que devuelven HTML).
- **Versión 18** trae soporte mejorado para Suspense, concurrent rendering, automatic batching.

#### CSS Modules
- Forma de escribir CSS donde **los nombres de clase tienen scope local** automáticamente.
- Si en `Navbar.module.css` declaro `.brand`, el HTML final lleva una clase tipo `Navbar_brand__a3f7`.
- **Beneficio**: nunca chocan dos `.brand` de archivos distintos. Borrás el componente, borrás su CSS, sin riesgo de afectar otra parte.
- **Por qué no Tailwind**: la consigna pedía CSS Modules. Y para un proyecto académico es más legible — querés ver el CSS, no inferirlo de utility classes.

#### HTML semántico
- Usar **etiquetas con significado** en vez de `<div>` para todo.
- Ejemplos: `<header>` para encabezado, `<nav>` para navegación, `<article>` para contenido independiente, `<main>` para contenido principal, `<footer>` para pie.
- **Por qué**: lectores de pantalla, SEO, mantenibilidad. Un `<article>` le dice a Google "esto es contenido independiente" — un `<div>` no.

#### React Context
- API de React para **compartir estado entre componentes que no son padre-hijo directos** sin tener que pasar props por todos los niveles ("prop drilling").
- En mi app: el `CartContext` permite que el `Navbar` (que muestra el badge) y el `CartItem` (que aumenta cantidad) compartan el mismo carrito sin pasarse props.

#### localStorage
- API del navegador para **guardar pares clave-valor que persisten incluso si cerrás la pestaña**.
- Mi carrito vive en `localStorage` bajo la key `musictrack_cart`. Si cerrás el navegador y volvés mañana, el carrito sigue ahí.
- Limitaciones: solo strings (uso `JSON.stringify`/`JSON.parse`), ~5MB max, accesible solo desde el mismo dominio.

#### GitHub + Vercel
- **GitHub** = donde vive el código (repositorio remoto).
- **Vercel** = servicio que toma el código de GitHub, lo buildea y lo publica en una URL pública.
- **Deploy automático** = cada `git push` a `main` dispara un nuevo deploy sin que yo haga nada.

#### Backend pendiente
- Hoy no hay servidor propio: los productos se importan estáticamente desde `src/data/products.js`.
- "Pendiente" = decisión consciente de scope. Para un parcial frontend, mock data alcanza.

### Cómo defender
- *"¿Por qué Next.js y no React puro?"* → "Necesito ruteo, optimización de imágenes, generación estática y deploy fácil. React solo no trae nada de eso."
- *"¿Por qué CSS Modules y no Tailwind?"* → "La consigna lo pedía, pero además: scope local sin convención de naming, lectura más directa del CSS, y para un proyecto académico es más explícito."
- *"¿Por qué localStorage y no cookies o session?"* → "Persiste entre sesiones sin necesidad de servidor. Cookies necesitan backend. SessionStorage se borra al cerrar la pestaña."

---

## 📸 Slide 2 — Recorrido por la app

### Qué dice
4 capturas de pantalla en grilla 2×2 con labels:
- **Home** — Hero, destacados, categorías y beneficios
- **Catálogo** — Buscador, filtro por categoría, orden por precio/nombre
- **Detalle** — SSG (`generateStaticParams`) + productos relacionados
- **Carrito** — Persistido en `localStorage` · checkout validado

Footnote: *"Demo en vivo: `npm run dev` en local · o la URL de Vercel."*

### Qué significa cada cosa

#### Home
- Página principal (`/`).
- Tiene un **hero** (sección grande con imagen + título + CTAs), una sección de productos destacados (4 primeros), categorías clicables, y bloque de beneficios (4 cards).
- En el código: [src/app/page.js](src/app/page.js).

#### Catálogo
- URL: `/productos`.
- **Buscador** = input que filtra productos por nombre en tiempo real (estado local de React, sin recargar).
- **Filtro por categoría** = `<select>` que filtra (Electricas / Acusticas / Bajos / Accesorios).
- **Orden** = `<select>` con opciones (relevancia, precio asc, precio desc, nombre A-Z).
- Implementado en [src/app/productos/ProductsView.js](src/app/productos/ProductsView.js) usando `useState` y `useMemo`.

#### Detalle
- URL: `/productos/1`, `/productos/2`, etc. — una por producto.
- **SSG** = Static Site Generation. Las 12 páginas se generan en build time (no en cada request). Más rápidas, sirven HTML pre-renderizado desde CDN.
- **`generateStaticParams`** = función de Next que le dice qué params dinámicos tiene que pre-generar. En mi caso, devuelve `[{id:"1"}, {id:"2"}, ..., {id:"12"}]`.
- **Productos relacionados** = sección al final que muestra otros productos de la misma categoría, generada por el helper `getRelatedProducts(id, categoria, limit=4)` en [src/data/products.js](src/data/products.js).

#### Carrito
- URL: `/carrito`.
- **Persistido en localStorage** = aunque cierres la pestaña y vuelvas, los productos siguen ahí.
- **Checkout validado** = el formulario de `/checkout` valida nombre, email (regex), teléfono (≥6 dígitos), dirección antes de aceptar.

#### Demo en vivo
- `npm run dev` = comando para correr la app localmente en `http://localhost:3000`.
- URL de Vercel = `https://musictrack.vercel.app` (o similar). Ahí está deployado.

### Cómo defender
- *"¿Las screenshots son del producto real?"* → "Sí, son capturas de la app andando. La URL de Vercel está activa, podemos verlo en vivo si querés."
- *"¿Por qué prerenderizás los detalles?"* → "Performance. Sirve HTML estático desde CDN, no hay request al server por cada visita. Y SEO: Google ve el contenido sin ejecutar JS."

---

## 🧱 Slide 3 — Fundamentos HTML / CSS / JS

### Qué dice
4 cards en grilla 2×2:

#### Card 1: HTML semántico
- `<header>` + `<nav>` en `Navbar.js`
- `<main>` en `app/layout.js:15`
- `<article>` por producto en `ProductCard.js:18`
- `<section>` separa hero / destacados / categorías / beneficios
- `<footer>` con `h3/h4/ul` jerárquicos

#### Card 2: Accesibilidad / ARIA
- `aria-label="Abrir menu"` + `aria-expanded` en hamburguesa
- `<nav aria-label="Breadcrumb">` en detalle
- `aria-label` dinámico en cada botón "Agregar"
- `<label htmlFor>` asociado a cada input del checkout

#### Card 3: Responsive · Grid + Flex
- Catálogo: 4 → 3 → 2 → 1 col en `ProductGrid.module.css`
- Carrito: `1fr 340px` → `1fr` bajo 900px
- Flexbox en navbar y barra de acciones
- Variables CSS en `:root` centralizan paleta

#### Card 4: Eventos en JS
- `onClick` agregar al carrito · `ProductCard.js:11`
- `onClick` +/− cantidad · `CartItem.js:30`
- `onSubmit` + `preventDefault` · `checkout/page.js:42`
- `onChange` en buscador y selects de filtros

Footnote: **Módulos ES6** con `import`/`export` y alias `@/*`.

### Qué significa cada cosa

#### `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Etiquetas HTML5 con significado semántico.
- `<header>`: encabezado de la página o sección.
- `<nav>`: bloque de links de navegación.
- `<main>`: contenido principal único de la página (uno solo por página).
- `<article>`: contenido independiente que tendría sentido fuera de contexto (un producto, un post).
- `<section>`: agrupación temática de contenido relacionado.
- `<footer>`: pie de página o sección.

#### `aria-label`
- Atributo HTML que **provee un nombre accesible** a un elemento que no tiene texto visible.
- Ejemplo: el botón "+" del carrito no tiene texto, así que llevá `aria-label="Aumentar cantidad"`. Un screen reader lee eso.

#### `aria-expanded`
- Indica si un elemento expandible/colapsable está abierto. Ejemplo: el menú hamburguesa.
- Valores: `"true"` (abierto) o `"false"` (cerrado).

#### `<label htmlFor>`
- En React se llama `htmlFor` (en HTML puro es `for`, pero `for` es palabra reservada en JS).
- Asocia un `<label>` con su `<input>` por id. Click en el label = focus en el input.
- Mejora accesibilidad y UX.

#### CSS Grid
- Sistema de layout 2D: filas y columnas a la vez.
- Ejemplo del catálogo: `grid-template-columns: repeat(4, 1fr)` = 4 columnas iguales.
- Con media queries cambio a 3, 2, 1 columnas según ancho de pantalla.

#### Flexbox
- Sistema de layout 1D: alinear elementos en fila o columna.
- Ejemplo: `display: flex; align-items: center; justify-content: space-between` en el navbar.

#### `1fr`
- Unidad CSS Grid = "una fracción del espacio disponible".
- `1fr 340px` = la primera columna toma todo el espacio que sobre, la segunda es fija de 340px.

#### Breakpoints / Media queries
- Reglas CSS que se activan según el ancho de pantalla.
- En mi app: 1024px (tablet), 768px (mobile horizontal), 480px (mobile vertical).
- Sintaxis: `@media (max-width: 768px) { ... }`.

#### Variables CSS en `:root`
- Variables nativas de CSS (también llamadas "custom properties").
- Se declaran en `:root` (que apunta al `<html>`) y se usan en cualquier parte con `var(--nombre)`.
- Ejemplo en mi `globals.css`:
  ```css
  :root { --color-accent: #b87333; }
  .btn { background: var(--color-accent); }
  ```
- **Beneficio**: cambio una variable y se actualiza toda la app.

#### `onClick`, `onSubmit`, `onChange`
- **Event handlers** de React (en HTML puro serían `onclick`, `onsubmit`, `onchange`).
- `onClick`: cuando se hace click en un elemento.
- `onSubmit`: cuando se envía un formulario (apretás Enter en un input o un `<button type="submit">`).
- `onChange`: cuando cambia el valor de un input/select.

#### `preventDefault`
- Método del evento (`e.preventDefault()`) que **cancela el comportamiento default del navegador**.
- En un `<form>`, sin esto, el navegador recargaría la página al enviar. Con esto, manejo el submit yo en JS.

#### Módulos ES6 · `import` / `export`
- Sistema oficial de módulos en JavaScript moderno.
- `export const x = 1` en un archivo, `import { x } from "./archivo"` en otro.
- Permite organizar el código en archivos chicos con responsabilidades claras.

#### Alias `@/*`
- Configurado en `jsconfig.json`: `"@/*": ["src/*"]`.
- Permite hacer `import { useCart } from "@/context/CartContext"` en lugar de `import { useCart } from "../../../context/CartContext"`.
- **Beneficio**: si muevo un archivo, no rompe imports relativos.

### Cómo defender
- *"¿Qué hace `aria-expanded`?"* → "Le dice a un screen reader si el menú hamburguesa está abierto o cerrado, así anuncia 'menu, expanded' o 'menu, collapsed'."
- *"¿Por qué grid y no flexbox para el catálogo?"* → "Grid es 2D, Flexbox es 1D. Para una grilla de productos con filas y columnas que se adaptan, Grid es la elección correcta."
- *"¿Qué hace `preventDefault`?"* → "En el `<form>` del checkout, cancela el reload default del navegador. Sin eso, al apretar 'Confirmar pedido' recargaría la página."

---

## ⚛️ Slide 4 — React + Next.js

### Qué dice
4 secciones:

#### Props vs State (tabla)
| Concepto | Props | State |
|---|---|---|
| Qué | Datos de afuera, read-only | Datos internos, mutables |
| Ejemplo | `<ProductCard product={p} />` en `ProductGrid.js:14` | `const [quantity, setQuantity] = useState(1)` en `AddToCartButton.js:10` |
| Más | `onSortChange`, `item`, `categories` | `items` en Context, `open` del menú, `form` y `errors` |

#### useEffect (con código real)
```js
// 1) Hidratar al montar (deps: [])
useEffect(() => {
  const stored = localStorage.getItem("musictrack_cart");
  if (stored) setItems(JSON.parse(stored));
  setHydrated(true);
}, []);

// 2) Persistir (deps: [items])
useEffect(() => {
  if (!hydrated) return;
  localStorage.setItem("musictrack_cart", JSON.stringify(items));
}, [items, hydrated]);
```
Caption: dos efectos con dependencias distintas. Flag `hydrated` evita pisar storage con array vacío.

#### Re-render — paso a paso
1. Click en "Agregar" en `ProductCard`
2. `addItem(product)` ejecuta `setItems(...)` en el Context
3. React detecta nuevo estado → re-renderiza todos los suscriptores de `useCart()`: badge del navbar, totales, items
4. `useEffect` con deps `[items]` dispara → guarda en `localStorage`

#### Rutas en Next App Router
```
src/app/
├── page.js                   →  /
├── productos/
│   ├── page.js               →  /productos
│   └── [id]/page.js          →  /productos/3
├── carrito/page.js           →  /carrito
├── checkout/page.js          →  /checkout
└── not-found.js              →  404
```
Caption: `generateStaticParams()` pre-renderiza las 12 páginas en build.

#### Server vs Client Components
| Server (default) | Client (`"use client"`) |
|---|---|
| `app/layout.js` | `Navbar.js` (`useState`) |
| `app/page.js` | `CartContext.js` (hooks + storage) |
| `productos/[id]/page.js` | `AddToCartButton.js` (`onClick`) |
| `productos/page.js` + `<Suspense>` | `ProductsView.js` (`useSearchParams`) |

### Qué significa cada cosa

#### Componente
- Función de JavaScript que recibe `props` y devuelve JSX (que parece HTML).
- Se "instancia" usándolo como tag: `<ProductCard product={p} />`.
- Es **reutilizable**: el mismo `ProductCard` se usa en home (destacados), catálogo y productos relacionados.

#### Props
- "Properties". Son los **argumentos que un componente recibe desde su padre**.
- Sintaxis: el padre escribe `<ProductCard product={p} />`, el hijo recibe `function ProductCard({ product }) {...}`.
- **Read-only**: el componente hijo NO debe modificarlas. Si necesita cambios, le pide al padre.

#### State
- Datos **internos del componente** que pueden cambiar a lo largo del tiempo.
- Hook: `const [valor, setValor] = useState(inicial)`.
- Cuando llamás `setValor(nuevo)`, React **re-renderiza el componente** con el nuevo valor.

#### `useState`
- Hook de React que crea un estado local.
- Devuelve un array de 2 elementos: el valor actual y la función para cambiarlo.
- Ejemplo: `const [open, setOpen] = useState(false)`.

#### `useEffect`
- Hook que ejecuta código **después de que el componente se renderiza**.
- Sintaxis: `useEffect(() => { ... }, [dependencias])`.
- **Sin dependencias** (`[]`): corre una sola vez, al montarse el componente.
- **Con dependencias** (`[a, b]`): corre cada vez que `a` o `b` cambian.

#### Dependency array
- El segundo argumento de `useEffect`. Lista de variables que el efecto observa.
- Si NO se pasa, el efecto corre en cada render (peligroso, suele causar loops).
- Si se pasa `[]`, corre una sola vez.
- Si se pasa `[items]`, corre cuando `items` cambia.

#### Hidratación
- Proceso por el cual una página HTML estática se "vuelve interactiva" cuando el JS de React se carga y se "engancha" al HTML existente.
- En mi caso: el SSR genera el HTML con carrito vacío (no hay localStorage en el server). En el cliente, después de hidratar, leo localStorage y actualizo. Si no manejo bien la transición, hay un "flash" del carrito vacío.

#### Flag `hydrated`
- Booleano que indica si **ya se leyó localStorage**.
- Inicia en `false`. El primer `useEffect` lo prende a `true` después de leer.
- El segundo `useEffect` (que escribe) tiene `if (!hydrated) return` — no escribe hasta que `hydrated === true`.
- **Por qué**: sin esto, el segundo efecto correría con el array vacío inicial y **pisaría** lo guardado en localStorage.

#### Re-render
- Cuando el estado de un componente cambia, React **vuelve a ejecutar la función del componente** y actualiza el DOM si hay diferencias.
- No es "recargar la página". Es eficiente: solo cambia lo que cambió.
- Cuando el Context cambia, **todos los componentes que llaman `useCart()` se re-renderizan**.

#### Suscriptor de Context
- Cualquier componente que llama a `useCart()` (o sea, `useContext(CartContext)`) está "suscrito" al Context.
- Cuando el valor del Context cambia, todos los suscriptores re-renderizan.

#### Routing file-based (App Router)
- Next.js mapea **carpetas a URLs automáticamente**.
- `app/page.js` → `/`
- `app/carrito/page.js` → `/carrito`
- `app/productos/[id]/page.js` → `/productos/X` (dinámica)

#### Ruta dinámica `[id]`
- Carpeta entre corchetes = **parámetro de URL**.
- En el componente, lo recibo con `function Page({ params }) { params.id }`.
- En mi app, `[id]` matchea cualquier número (Stratocaster, Les Paul, etc.).

#### `generateStaticParams`
- Función que devuelve un array de objetos con los valores que tiene que pre-generar.
- Para mis 12 productos: `return products.map(p => ({ id: String(p.id) }))`.
- Next genera 12 HTML estáticos en build time, uno por producto.

#### SSG (Static Site Generation)
- Estrategia donde el HTML se genera **en build time**, no en cada request.
- Más rápido (sirve desde CDN), más barato (no necesita servidor activo), mejor SEO.
- Marcado en `npm run build` como `● (SSG)`.

#### Server Component
- Componente que **se renderiza en el servidor** y manda HTML al cliente.
- Por default en App Router. Más rápido y manda menos JS al navegador.
- **No puede** usar `useState`, `useEffect`, `onClick`, ni nada interactivo.

#### Client Component
- Componente con la directiva `"use client"` arriba del archivo.
- Se hidrata en el navegador y puede usar hooks, eventos, browser APIs (`localStorage`, `window`).
- Más pesado: el JS viaja al cliente.

#### `"use client"`
- Directiva que **convierte un archivo en Client Component**.
- Va en la primera línea del archivo, antes de los imports.
- Hace que React Server Components serialicen este archivo y lo manden al cliente.

#### Suspense
- Componente de React que **renderiza un fallback mientras un hijo está cargando**.
- Sintaxis: `<Suspense fallback={<Loading />}><Componente /></Suspense>`.
- Lo uso para `useSearchParams`: durante el prerender no hay query string, así que envuelvo en Suspense.

#### `useSearchParams`
- Hook de Next.js que **lee los query params de la URL** (lo que viene después del `?`).
- Ejemplo: en `/productos?categoria=Electricas`, `searchParams.get("categoria")` devuelve `"Electricas"`.
- Solo funciona en Client Components.

### Cómo defender
- *"¿Por qué dos `useEffect` y no uno?"* → "Tienen disparadores distintos. Uno corre al montar (deps `[]`) para LEER. El otro corre cuando cambia `items` (deps `[items]`) para ESCRIBIR. Si los unía, o leía en cada cambio o escribía sin haber leído. La separación deja cada uno con su responsabilidad."
- *"¿Para qué sirve el flag `hydrated`?"* → "Evita un bug específico: durante el primer render, antes de leer localStorage, items es `[]`. Si el efecto de escritura corre antes del de lectura, pisaría el storage real con vacío. El flag bloquea la escritura hasta confirmar que ya leí."
- *"¿Cuál es la diferencia entre Server y Client Components?"* → "Server Components renderizan HTML en el servidor y mandan menos JS al cliente. Client Components corren en el navegador y pueden usar hooks, eventos y APIs del browser. El default es Server. Marco un componente como Client con `'use client'` solo si necesita interactividad o estado."
- *"¿Qué pasa cuando hago click en 'Agregar'?"* → "Se llama `addItem(product)` del Context, que ejecuta `setItems(...)`. React detecta nuevo estado y re-renderiza todos los suscriptores de `useCart()` — el badge del navbar, los totales del carrito, lo que sea. Y el `useEffect` con dep `[items]` dispara y guarda en localStorage. Todo en un solo ciclo."

---

## 🗺️ Slide 5 — Diagrama de arquitectura

### Qué dice
Diagrama de Mermaid que muestra:
- **Usuario** → **Navegador** → **Frontend**
- Subgraph **Frontend Next.js** con: Pages, Globals, Modules, Components, Context, Storage
- Subgraph **CI CD Pipeline** con: Local → GitHub → Vercel → Site
- Flechas con labels: `useCart`, `sync`, `setState`, `push`, `webhook`, `deploy`, `sirve`

Footnote: 6 elementos requeridos:
1. usuario+navegador
2. HTML/CSS/JS diferenciados
3. componentes y rutas reales
4. flechas de flujo
5. setState → re-render
6. pipeline local → GitHub → Vercel → URL

### Qué significa cada cosa

#### Subgraph
- Concepto de Mermaid: una caja que **agrupa nodos** dentro del diagrama.
- En mi diagrama hay dos: "Frontend Next.js" (todo lo del cliente) y "CI CD Pipeline" (todo lo del deploy).

#### Usuario y Navegador
- **Usuario**: la persona real.
- **Navegador**: Chrome, Safari, Firefox — donde corre la app.
- El usuario interactúa con el navegador, el navegador pide assets a Vercel.

#### Pages (Rutas y páginas)
- Las 5 rutas del sitio: `/`, `/productos`, `/productos/[id]`, `/carrito`, `/checkout`.
- Viven en `src/app/`.

#### Globals (`globals.css`)
- Archivo de CSS global con variables (`--color-primary`, etc.) y clases utilitarias (`.btn`, `.container`).
- Importado una sola vez en `app/layout.js`.

#### Modules (CSS Modules)
- Archivos `*.module.css` con scope local.
- Cada componente tiene el suyo: `Navbar.module.css`, `ProductCard.module.css`, etc.

#### Components (Componentes UI)
- `Navbar`, `Footer`, `ProductCard`, `ProductGrid`, `ProductFilters`, `CartItem`, `ProductImage`.
- Reutilizables, presentan UI.

#### Context (CartContext)
- Estado global del carrito (`items`, totales, funciones para modificar).
- Implementado con `createContext` + `useState` + `useEffect`.

#### Storage (localStorage)
- API del navegador donde se persiste el carrito.
- Key: `musictrack_cart`. Valor: JSON del array de items.

#### Flecha `useCart`
- Va de Components a Context. Significa: los componentes consumen el Context vía el hook `useCart()`.

#### Flecha `sync`
- Va de Context a Storage. Significa: el Context sincroniza el estado con localStorage cada vez que cambia.

#### Flecha punteada `setState`
- Va de Context a Components. Significa: cuando llamo `setState` en el Context, los componentes que lo consumen se re-renderizan.

#### Local
- Mi máquina de desarrollo. Donde corro `npm run dev` y `npm run build`.

#### GitHub main
- El repositorio remoto en GitHub, branch `main`.

#### Vercel build
- El servicio de Vercel que recibe el código y lo buildea.

#### Site (URL pública)
- La URL final donde está deployada la app: `musictrack.vercel.app`.

#### Flecha `push`
- Local → GitHub. Significa: hago `git push` y el código viaja al repo remoto.

#### Flecha `webhook`
- GitHub → Vercel. Significa: GitHub manda una notificación HTTP a Vercel cada vez que se actualiza `main`.

#### Flecha `deploy`
- Vercel → Site. Significa: Vercel publica el resultado del build en la URL.

#### Flecha `sirve`
- Site → Navegador. Significa: cuando un usuario visita la URL, Vercel sirve los assets pre-buildeados.

### Cómo defender
- *"Mostrame el flujo cuando un usuario agrega un producto"* → "El Browser renderiza una página, dentro hay componentes. Un componente llama `useCart()` que toca el Context. El Context hace `setState` y eso (flecha punteada) re-renderiza todos los suscriptores. Además, el Context sincroniza con localStorage."
- *"Mostrame el flujo de deploy"* → "Local push → GitHub recibe → webhook a Vercel → Vercel buildea → URL pública. Esa URL sirve assets al navegador del usuario, completando el círculo."
- *"¿Por qué tres colores distintos para HTML, CSS, JS?"* → "Porque la consigna pide diferenciar las tres capas. Cada una tiene su propia responsabilidad: estructura, estilo, lógica."

---

## 🚀 Slide 6 — CI/CD: del commit a la URL pública

### Qué dice
Pipeline visual: `Local` → `GitHub` → `Vercel` → `URL pública`

Card 1 — Paso a paso:
- Local: `npm run dev` en `:3000` · `lint` + `build` antes de pushear
- Repo: un único repo en GitHub, branch `main`
- Trigger: webhook de GitHub avisa a Vercel en cada push
- Pipeline Vercel: detecta Next.js → `npm install` → `npm run build`
- Si el build falla → deploy rechazado, URL anterior queda intacta
- Preview deploys: cada PR genera URL temporal de revisión

Card 2 — Variables de entorno (pendiente):
- Hoy no hay backend ni servicios externos
- Cuando se sume Supabase: `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_ANON_KEY` en Vercel

Card 2 — `.gitignore`:
- Cubre `node_modules/`, `.next/`, `.env*.local`, `.vercel/`

### Qué significa cada cosa

#### CI/CD
- **Continuous Integration / Continuous Deployment**.
- CI = cada cambio se testea/buildea automáticamente.
- CD = cada cambio aprobado se deploya automáticamente a producción.
- En mi caso, Vercel hace ambas: buildea en cada push y si pasa, publica.

#### `npm run dev`
- Comando definido en `package.json` que ejecuta `next dev`.
- Levanta un servidor local con hot-reload (los cambios se ven sin refrescar).

#### `npm run lint`
- Ejecuta ESLint con la config de Next.
- Detecta errores y warnings de estilo, imports rotos, hooks mal usados, etc.

#### `npm run build`
- Genera la versión optimizada para producción.
- Resultado: carpeta `.next/` con HTML estático, JS minificado, etc.
- Si hay errores de compilación o lint crítico, falla aquí.

#### Branch `main`
- La rama principal del repo. La que Vercel está observando.
- Convención moderna (antes era `master`, GitHub lo cambió).

#### Webhook
- Mecanismo donde un servicio (GitHub) **notifica a otro (Vercel)** cuando pasa algo (un push, un PR).
- Es una request HTTP automática: GitHub manda POST a `https://vercel.com/api/...` con info del commit.

#### `npm install`
- Instala las dependencias listadas en `package.json` en `node_modules/`.
- Vercel lo hace automáticamente al detectar el repo.

#### Pipeline
- Secuencia de pasos automatizados que se ejecutan en orden.
- En Vercel: `npm install` → `npm run build` → si todo OK, deploy.

#### Deploy rechazado
- Si el build falla, Vercel **NO actualiza** la URL pública.
- Producción sigue mostrando la versión anterior, que sí compilaba.
- Es la red de seguridad: un commit roto no llega al usuario final.

#### Preview deploys
- Cada Pull Request genera una **URL temporal** distinta de la de producción.
- Sirve para revisar cambios antes de mergear.
- Ejemplo: `origen-git-feature-x.vercel.app`.

#### Pull Request (PR)
- Mecanismo de GitHub para proponer cambios desde una rama hacia `main`.
- Permite review, discusión, CI checks antes de mergear.

#### Variables de entorno
- Valores que viven **fuera del código**, en la configuración del entorno donde corre la app.
- Útiles para secretos (API keys, DB passwords) y para configuraciones que cambian entre entornos.
- Sintaxis en JS: `process.env.NOMBRE`.

#### `NEXT_PUBLIC_*`
- Convención de Next.js: las variables que empiezan con `NEXT_PUBLIC_` se **exponen al navegador** (cliente).
- Las que NO empiezan así, **solo viven en el servidor** (más seguro para secretos).

#### `SUPABASE_ANON_KEY`
- API key pública de Supabase que el cliente usa para hacer queries.
- "Anon" = anónima, no privilegiada.
- Aún siendo pública, la convención es no commitearla.

#### `.gitignore`
- Archivo que le dice a Git **qué archivos ignorar** (no trackear en el repo).
- Incluye: dependencias (`node_modules`), builds (`.next`), secretos (`.env*`), config local (`.vercel`).

#### `node_modules/`
- Carpeta donde npm guarda las dependencias instaladas.
- Puede pesar GB. Nunca se commitea — se reinstala con `npm install`.

#### `.next/`
- Carpeta generada por `npm run build`. Contiene la app buildeada.
- Se regenera, no se commitea.

#### `.env*.local`
- Archivos de variables locales (`.env.local`, `.env.development.local`).
- Pueden contener secretos. Nunca se commitean.

### Cómo defender
- *"¿Qué pasa si tu build falla?"* → "Vercel rechaza el deploy y la URL pública sigue mostrando la versión anterior, la que sí buildeaba. Producción nunca recibe código roto."
- *"¿Cómo configurarías las env vars de Supabase en Vercel?"* → "En el panel de Vercel, Settings → Environment Variables, agrego `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_ANON_KEY`. Vercel las inyecta en el build. Y nunca las commiteo: el `.gitignore` ya cubre `.env*.local`."
- *"¿Por qué webhook y no polling?"* → "Eficiente: GitHub avisa a Vercel solo cuando hay un push. Polling implicaría que Vercel pregunte cada X segundos 'hay algo nuevo', desperdicio de recursos."

---

## 🤖 Slide 7 — Uso fundamentado de IA (Módulo 4)

### Qué dice
Card 1 — Herramienta y justificación:
- **Claude Code** (CLI agentic, integrado a VS Code)
- Lee y escribe archivos directamente en el repo
- Ejecuta `npm run build` para validar
- Mantiene contexto multi-archivo → trabajo a nivel feature

Card 2 — Cómo validé lo generado:
- Lectura previa: ningún archivo aceptado sin leerlo
- Build: `npm run build` después de cada feature
- Test manual: agregar / quitar / recargar / vaciar / checkout
- Cortar fuera de scope: Tailwind, librerías UI, TS

Card 3 — Errores reales que detectó la IA:
| Bug | Causa | Solución |
|---|---|---|
| Build estático rompía | `useSearchParams` sin Suspense en SSG | Separar en `ProductsView` envuelto en `<Suspense>` |
| Badge parpadea en "0" | Mismatch SSR vs hidratación de localStorage | Flag `hydrated`, no renderizar hasta `true` |
| `generateStaticParams` falla | Next exige `string`, mandé `number` | `String(p.id)` |

Card 4 — Yo vs IA (3 columnas):
- **✓ Yo**: decisiones de arquitectura (Context vs Redux, mock vs fetch, qué archivos llevan `"use client"`, separar `lib/format.js`)
- **⚙ IA**: boilerplate (CSS Modules, plumbing de props, regex de validación, breakpoints, helpers de formato)
- **🔍 Verifiqué línea por línea**: `CartContext` (los dos efectos), validación del checkout, qué corre en server vs cliente

Footnote: adjunto `PROMPTS.md`.

### Qué significa cada cosa

#### Claude Code
- Herramienta CLI de Anthropic que **integra Claude (LLM) con tu sistema de archivos**.
- A diferencia de un chat (claude.ai), puede leer/escribir archivos, ejecutar comandos (`npm run build`), navegar el repo.
- "Agentic" = el modelo decide qué pasos dar, no solo responde texto.

#### Agentic coding
- Estilo de uso de IA donde el modelo **toma decisiones y ejecuta acciones secuencialmente** (leer archivo, modificarlo, correr build, leer error, corregir).
- Distinto de "completion" (autocompletar) o "chat" (preguntar y copiar).

#### Boilerplate
- Código repetitivo y predecible que no requiere creatividad.
- Ejemplos: el CSS de un componente con sus media queries, la estructura de un form con validación, helpers de formato.
- Es exactamente donde la IA aporta más valor (rápido, correcto, no hay que pensarlo).

#### Mismatch de hidratación
- Cuando el HTML que sirve el server (SSR) **no coincide** con lo que React renderiza en el cliente.
- Causa warnings en consola y "flashes" visuales (el badge muestra "0" un instante y salta a "3").
- En mi caso: el server no tiene acceso a `localStorage`, así que renderiza con array vacío. El cliente, después de hidratar, lee storage y actualiza. Hay un instante de discrepancia.

#### Suspense boundary
- Una sección del árbol de componentes envuelta en `<Suspense>`.
- Mientras los hijos están "esperando" (data loading, hidratando), se muestra el `fallback`.
- En mi app: `<Suspense fallback="Cargando...">` envuelve `ProductsView` porque adentro usa `useSearchParams`.

#### Decisiones de arquitectura
- Las elecciones de **alto nivel** sobre cómo se organiza el código.
- Ejemplos:
  - Context vs Redux para estado global
  - Mock data local vs fetch a API
  - Qué componentes son Server vs Client
  - Separar formato de precio en `lib/format.js` (DRY)
- **No las delegué a la IA** — son las que más definen la calidad del proyecto.

#### Context vs Redux
- Ambos manejan estado global, pero:
  - **Context**: built-in en React, simple, ideal para estado de un solo dominio (carrito).
  - **Redux**: librería externa, más boilerplate, ideal para apps grandes con muchos dominios.
- Para mi proyecto, Context es la elección correcta. Redux sería overengineering.

#### Mock data vs fetch
- **Mock**: array hardcodeado en `src/data/products.js`. Sin red, sin API.
- **Fetch**: llamada HTTP a un backend que devuelve datos.
- Para el alcance del parcial (frontend puro), mock es la elección consciente.

### Cómo defender
- *"¿Solo usaste IA?"* → "No. La IA generó boilerplate y aceleró el desarrollo, pero las decisiones de arquitectura las tomé yo: Context y no Redux, mock y no fetch, qué archivos son Client. Y los efectos críticos los verifiqué línea por línea — por eso si me preguntás por qué el `CartContext` tiene dos `useEffect` y no uno, te lo puedo defender."
- *"¿Cómo sabés que el código generado es correcto?"* → "Tres mecanismos: lectura previa antes de aceptar cualquier archivo, `npm run build` después de cada feature (la IA me detectó el bug de Suspense así), y test manual de cada flujo en el navegador."
- *"¿Cuál fue el bug más interesante?"* → "El de `useSearchParams` sin Suspense. La IA me lo sugirió de la forma intuitiva — usar el hook directo en la página — pero `npm run build` falló durante el SSG. La solución obligaba a entender el modelo de prerender de Next: separar la lógica en un Client Component aparte y envolverlo en `<Suspense>`. Lo entendí, lo arreglé, y quedó documentado en `PROMPTS.md`."
- *"¿Qué hacés si la IA te genera algo que no entendés?"* → "Le pido que me lo explique línea por línea, o lo googleo. Antes de aceptar, tengo que poder defenderlo. Si no lo entiendo, no lo subo."

---

## 🎓 Términos generales (cualquier slide)

### Frontend / Backend
- **Frontend** = lo que corre en el navegador del usuario (HTML, CSS, JS, React).
- **Backend** = lo que corre en un servidor (DB, autenticación, lógica de negocio).
- Mi proyecto es solo frontend; el backend es "pendiente".

### SSR / SSG / CSR
- **SSR** (Server-Side Rendering): HTML generado en el servidor en cada request. Más lento, pero datos siempre frescos.
- **SSG** (Static Site Generation): HTML generado en build time. Sirve desde CDN, súper rápido.
- **CSR** (Client-Side Rendering): el navegador descarga JS y renderiza todo. Lento al inicio, pero interactivo.
- Mi app: **SSG** para `/`, `/productos`, `/productos/[id]` (los más importantes); **Client** para componentes interactivos (Navbar, AddToCartButton).

### Hooks
- Funciones especiales de React que empiezan con `use*`.
- Solo se pueden llamar dentro de componentes (o de otros hooks).
- Los más comunes: `useState`, `useEffect`, `useContext`, `useMemo`, `useRef`.

### JSX
- Sintaxis que parece HTML dentro de JavaScript.
- Se compila a llamadas de `React.createElement(...)`.
- Ejemplo: `<div className="hi">Hola</div>` → `React.createElement('div', { className: 'hi' }, 'Hola')`.

### Build / Deploy
- **Build**: compilar el código a archivos optimizados (HTML, JS, CSS) listos para servir.
- **Deploy**: publicar esos archivos en un servidor accesible públicamente.

### CDN
- **Content Delivery Network**: red de servidores distribuidos geográficamente.
- Vercel tiene CDN global: cuando alguien pide la página en Buenos Aires, la sirve desde un nodo cerca, no desde EE.UU.

### Repository / Repo
- Carpeta del proyecto trackeada por Git, con su historial completo.
- Local (mi máquina) y remoto (GitHub).

### Branch
- "Rama". Una línea de desarrollo paralela.
- Default: `main`. Si hago una feature nueva, podría crear `feature/X` y mergear a `main` cuando termina.

### Commit
- Un "snapshot" del proyecto en un momento dado.
- Tiene un mensaje, autor, fecha, y un hash único (SHA).

### Push
- Subir mis commits locales al remoto (GitHub).

### Pull
- Bajar commits del remoto a mi local (lo opuesto a push).

---

## 📋 Checklist de defensa rápida

Antes del oral, asegurate de poder responder estas preguntas en 30 segundos:

- [ ] ¿Qué es Next.js y por qué lo usaste?
- [ ] ¿Qué hace App Router que no hace Pages Router?
- [ ] ¿Diferencia entre props y state?
- [ ] ¿Para qué sirve `useEffect`?
- [ ] ¿Por qué dos `useEffect` en `CartContext`?
- [ ] ¿Qué es SSG y por qué lo usás?
- [ ] ¿Diferencia entre Server y Client Component?
- [ ] ¿Cómo persiste el carrito entre sesiones?
- [ ] ¿Cómo va el flujo de deploy de punta a punta?
- [ ] ¿Por qué CSS Modules y no Tailwind?
- [ ] ¿Qué hace `aria-label` en un botón sin texto?
- [ ] ¿Cómo validás el formulario del checkout?
- [ ] ¿Cuál fue el bug más interesante que detectó la IA?
- [ ] ¿Qué decisiones tomaste vos y qué generó la IA?
- [ ] ¿Qué pasa si tu build falla en Vercel?

Si podés responder estas 15 sin titubear, el oral está cerrado.
