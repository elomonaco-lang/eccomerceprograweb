# Guion del oral — MusicTrack (10 minutos)

> Texto literal slide por slide. Pensado para hablar **natural**, no leer.
> Cada slide tiene **lo que decís** + **transición a la próxima**.
>
> Total: 10 minutos. Apuntá a 9:00 para tener buffer.

| Slide | Tema | Tiempo |
|---|---|---|
| 1 | Portada | 0:00 → 1:00 |
| 2 | Recorrido por la app | 1:00 → 2:00 |
| 3 | Diagrama de arquitectura | 2:00 → 4:00 |
| 4 | HTML / CSS / JS | 4:00 → 6:00 |
| 5 | React + Next.js | 6:00 → 8:30 |
| 6 | CI/CD | 8:30 → 9:00 |
| 7 | Uso de IA | 9:00 → 10:00 |

---

## 🎬 Apertura — memorizar literal (15 segundos)

> "Buenos días. Soy Estanislao Lomonaco y vengo a presentar **MusicTrack**, un e-commerce de instrumentos musicales que hice como proyecto integrador. Está deployado en Vercel — pueden probarlo en vivo en `musictrack.vercel.app`."

---

## 📄 Slide 1 — Portada (1 min)

> "MusicTrack es una tienda online de **guitarras eléctricas, acústicas, bajos y accesorios**. Permite explorar el catálogo, filtrar y buscar productos, agregarlos a un carrito que se persiste en el navegador, y completar un checkout simulado."
>
> "El **stack** que usé:
>
> - **Next.js 14** con App Router como framework
> - **JavaScript** puro, sin TypeScript
> - **React 18** y **CSS Modules** para la UI
> - **HTML semántico** y diseño **responsive**
> - **React Context + localStorage** para el carrito
> - **GitHub + Vercel** para el deploy automático"
>
> "Los **datos** son 12 instrumentos mockeados localmente. **El backend con base de datos quedó pendiente** — fue una decisión de scope: preferí entregar un frontend completo y deployable antes que medio backend a medias."
>
> **Transición:** *"Antes de la teoría, paso a mostrarles el producto funcionando."*

---

## 📸 Slide 2 — Recorrido por la app (1 min)

> "Antes de entrar a la teoría, **estas son capturas del sitio en vivo**:
>
> - **Home**: hero con el tagline 'Donde nace tu sonido', sección de instrumentos destacados, categorías clicables y bloque de beneficios.
>
> - **Catálogo**: grilla de los 12 instrumentos con buscador por nombre, filtro por categoría y ordenamiento por precio. Si tipeo 'Strato' filtra al instante porque es estado local de React, no recarga la página.
>
> - **Detalle**: cada producto tiene su URL propia, prerenderizada estáticamente en build time. La sección de productos relacionados muestra otros productos de la misma categoría.
>
> - **Carrito**: con productos cargados, los totales actualizan en tiempo real. Si recargo la página, los items siguen ahí gracias a localStorage."
>
> "**Si quieren probarlo después, está en `musictrack.vercel.app`** — incluyendo el checkout que valida el formulario y emite un número de orden."
>
> **Transición:** *"Ahora muestro cómo se conecta todo."*

---

## 🗺️ Slide 3 — Diagrama de arquitectura (2 min)

> "Esta es la slide más importante del oral. **El diagrama está organizado en tres paneles:**
>
> A la **izquierda, ENTRADA**: el flujo del usuario. Llega al navegador, el navegador pide los assets a Vercel CDN. **CDN significa 'Content Delivery Network'** — una red de servidores distribuidos por el mundo que sirven el sitio desde la ubicación más cercana al usuario.
>
> Abajo en ese panel hay un detalle importante: **SSG**, Static Site Generation. **Las 12 páginas de productos se pre-generan en build time**, no se calculan en cada visita. Eso lo hago con la función `generateStaticParams()`.
>
> En el **centro, MUSICTRACK APP**: la aplicación organizada como un **stack vertical de capas técnicas**. De arriba hacia abajo:
>
> 1. **HTML semántico** — el `layout.js` raíz, con header, main, footer.
> 2. **CSS Modules** — un globals.css con variables de paleta y cada componente con su CSS scoped.
> 3. **React Components y Rutas** — Navbar, ProductCard, CartItem, etc., y las rutas: home, productos, carrito, checkout.
> 4. **Estado Global con CartContext** — donde vive el carrito, manejado con useState y useEffect.
> 5. **Datos** — products.js con los 12 instrumentos, y localStorage que persiste el carrito.
>
> A la **derecha, DEPLOY · CI/CD**: el pipeline. Código local → git push → GitHub recibe → un webhook avisa a Vercel → Vercel buildea con `npm run build` → si pasa, queda online en la URL pública.
>
> Abajo está la **leyenda** que diferencia Server Components (default) de Client Components (los que llevan `'use client'`). Lo voy a profundizar en la slide 5."
>
> **Transición:** *"Empiezo abriendo cada capa por separado, primero HTML, CSS y JS."*

---

## 🧱 Slide 4 — Fundamentos HTML / CSS / JS (2 min)

> "En esta slide bajo cada concepto del módulo 2 a un archivo concreto del repo.
>
> **HTML semántico** — uso etiquetas con significado en vez de divs sueltos: `<header>` y `<nav>` en el Navbar, `<main>` en el layout, `<article>` por cada producto, `<section>` para separar las áreas del home, `<footer>` con jerarquía de h3 y h4.
>
> **Accesibilidad y ARIA** — los botones sin texto visible llevan `aria-label`. Por ejemplo, el botón hamburguesa del navbar lleva `aria-label='Abrir menu'` y `aria-expanded` que vale true o false según el estado — un lector de pantalla así anuncia 'menú expandido' o 'contraído'. El breadcrumb del detalle es un `<nav aria-label='Breadcrumb'>` para diferenciarlo del navbar principal. Los inputs del checkout tienen `<label htmlFor>` asociado, lo que conecta el texto con el input por id.
>
> **Responsive con Grid y Flex** — la grilla del catálogo va de cuatro a tres a dos a una columna según el ancho. El layout del carrito es de dos columnas en desktop y colapsa a una sola debajo de 900 pixels. Las variables CSS centralizan toda la paleta en un solo lugar.
>
> **Eventos en JavaScript** — `onClick` para agregar al carrito en el ProductCard, los más y menos del CartItem, `onSubmit` con `preventDefault` en el checkout para que el formulario no recargue la página, y `onChange` en el buscador y los selects de filtros."
>
> "Y un detalle de organización: **uso módulos ES6 con import y export**, con un alias `@/*` configurado para que los imports sean limpios."
>
> **Transición:** *"Ahora a React y Next, donde está la lógica."*

---

## ⚛️ Slide 5 — React + Next.js (2:30)

> "Cinco conceptos clave, cada uno con su tarjeta:
>
> **🧩 Componente** — una función JavaScript que devuelve JSX. Cada parte de la UI es un componente: `ProductCard`, `Navbar`, `CartItem`. Son **reutilizables** — el mismo `ProductCard` aparece en home, catálogo y productos relacionados.
>
> **📨 Props** — son los datos que el componente padre le pasa al hijo. Por ejemplo, `<ProductCard product={item}>`. Son de **solo lectura** dentro del hijo — el componente que las recibe no las modifica.
>
> **🔄 State con useState** — son datos que cambian y disparan un **re-render** del componente. Lo uso para la cantidad seleccionada en el AddToCartButton, los items del carrito en el CartContext, el booleano `open` del menú móvil, y los errores del formulario de checkout.
>
> **⚡ useEffect** — es un **hook que ejecuta código después de que el componente se renderiza**. En MusicTrack lo uso para sincronizar el carrito con localStorage: un efecto **lee** al montar el componente, otro **escribe** cada vez que cambia el carrito. Eso es lo que mantiene el carrito persistido entre sesiones.
>
> **🗺️ Rutas en Next.js** — cada carpeta dentro de `/app/` es una ruta automática. `/app/productos/page.js` se mapea a `/productos`. Las rutas dinámicas usan corchetes: `/app/productos/[id]/page.js` se mapea a `/productos/3`."
>
> "**Server vs Client Components.** Por defecto en Next 14, todos los componentes son **Server**: se renderizan en el servidor y mandan menos JavaScript al cliente. Para que un componente sea **Client** hay que escribir `'use client'` arriba del archivo — eso permite usar hooks, eventos y APIs del navegador como localStorage."
>
> "Por ejemplo, **el layout y el detalle de productos son Server**, porque solo muestran datos. **El Navbar y el CartContext son Client**, porque necesitan estado y localStorage."
>
> **Transición:** *"Y para cerrar la parte técnica, el deploy."*

---

## 🚀 Slide 6 — CI/CD (30 segundos)

> "El pipeline va de punta a punta así: **trabajo local, hago `git push` a GitHub, un webhook avisa a Vercel, Vercel buildea, y si pasa queda en una URL pública.** Todo automático en menos de un minuto.
>
> Vercel detecta solo que es Next.js, instala dependencias, buildea, y sube los assets al CDN. **Si el build falla, el deploy se rechaza y la URL anterior queda intacta** — producción nunca recibe código roto."
>
> **Transición:** *"Y por último, el uso de IA."*

---

## 🤖 Slide 7 — Uso fundamentado de IA (1 min)

> "Para el desarrollo usé **Claude Code**, una CLI agentic integrada a VS Code. **La diferencia con un chat web** es que lee y escribe archivos directamente en el repo, ejecuta `npm run build` para validar, y mantiene contexto entre archivos. Eso me permitió trabajar a nivel de feature, no de snippet aislado."
>
> "**Lo importante**: las decisiones de arquitectura las tomé yo — usar Context y no Redux, mock data en vez de fetch, qué archivos llevan `'use client'`. La IA generó el boilerplate, pero los efectos críticos los verifiqué línea por línea. Si me preguntan por qué el `CartContext` tiene dos `useEffect` y no uno solo, lo puedo defender porque lo entiendo."
>
> "**Adjunto el archivo `PROMPTS.md`** con los prompts más importantes agrupados por feature, como evidencia del proceso."

---

## 🎬 Cierre — memorizar literal (10 segundos)

> "Y con eso cierro. Todo el código está en GitHub, el sitio en `musictrack.vercel.app`, y `PROMPTS.md` adjunto. Gracias."

---

## 🆘 Si te preguntan algo y no sabés

3 respuestas comodín que SIEMPRE son válidas:

1. *"Buena pregunta — eso lo dejé para la próxima iteración."* (cuando es algo que falta)
2. *"En el código está, podemos abrirlo si querés."* (cuando es algo implementado pero no en la slide)
3. *"No lo profundicé porque para el alcance del parcial no era necesario."* (cuando es fuera de scope)

## 🎯 Posibles preguntas — respuestas listas

| Pregunta | Respuesta |
|---|---|
| *"¿Qué es un CDN?"* | "Una red de servidores distribuidos por el mundo. Vercel sirve mi sitio desde el nodo más cercano al usuario. Argentina lo recibe desde São Paulo, Tokio desde Asia, todos rápido." |
| *"¿Qué es SSG?"* | "Static Site Generation. Las páginas se generan UNA vez en build time, no en cada visita. Mis 12 productos son archivos HTML pre-armados." |
| *"¿Por qué dos useEffect en el CartContext?"* | "Porque tienen disparadores distintos. Uno corre al montar (deps `[]`) para LEER. El otro corre cuando cambia `items` (deps `[items]`) para ESCRIBIR. Si los unía, o leía en cada cambio o escribía sin haber leído." |
| *"¿Diferencia entre Server y Client Component?"* | "Server se renderiza en el servidor y manda HTML. Client se hidrata en el navegador y puede usar hooks, eventos y localStorage. El default es Server. Marco con `'use client'` solo lo que necesita interactividad." |
| *"¿Qué hace `aria-label`?"* | "Da un nombre accesible a un elemento que no tiene texto visible. Por ejemplo, el botón hamburguesa son tres rayitas — sin `aria-label`, un lector de pantalla diría 'botón'. Con `aria-label='Abrir menu'`, dice 'Abrir menu, botón'." |
| *"¿Qué hace `preventDefault`?"* | "Cancela el comportamiento default del navegador. En el form del checkout, sin eso recargaría la página al apretar Enter. Con preventDefault, manejo todo en JavaScript: valido, genero el orderId, vacío el carrito." |
| *"¿Qué es CSS Modules?"* | "Forma de escribir CSS donde los nombres de clase tienen scope local. Si en `Navbar.module.css` declaro `.brand`, en el HTML final queda como `Navbar_brand__a3f7`. Nunca chocan dos clases del mismo nombre en archivos distintos." |
| *"¿Por qué Context y no Redux?"* | "Para un solo dominio (el carrito) y pocas operaciones, Redux era overkill. Context con useState alcanza, sin agregar dependencias." |
| *"¿Qué pasa si tu build falla en Vercel?"* | "El deploy se rechaza y la URL pública sigue mostrando la versión anterior. Producción nunca recibe código roto." |
| *"¿Qué es un hook?"* | "Una función especial de React que empieza con `use`. Te permite usar features de React: `useState` para estado, `useEffect` para efectos secundarios, `useContext` para leer un Context. Solo se llaman dentro de componentes." |

---

## ⏰ Reloj mental durante el oral

- **Si en slide 3 ya pasaste de 4:00** → estás lento, comprimí slide 4 y 5.
- **Si en slide 5 pasaste de 8:30** → saltá la sección Server vs Client (ya está en el diagrama).
- **Si terminás antes de 9:00** → bonus: abrí la URL de Vercel y mostrá un agregar al carrito en vivo.

---

## ✅ Antes de entrar al aula

- [ ] Cargá `presentacion/index.html` y andá a la slide 3 al menos una vez (para que cargue el SVG si necesita).
- [ ] Tené `musictrack.vercel.app` abierto en otra pestaña por si querés mostrar algo en vivo.
- [ ] Tené `PROMPTS.md` listo para mostrar (es el adjunto del módulo 4).
- [ ] Probá la presentación en pantalla completa con `Cmd + Ctrl + F` (Mac) o `F11` (Windows).
- [ ] Llevá `EXPLICACION_SLIDES.md` por si querés repasar algún término en el celular antes de entrar.
