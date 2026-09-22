# tä — mvp con configurador + stripe

configurador 3d del librero Módulo·ä integrado a un proyecto de next.js, con
checkout de stripe para reservar con depósito (30%) o comprar completo.

## qué contiene

```
ta-mvp/
├── pages/
│   ├── index.js                       → sirve public/landing.html directo en "/"
│   ├── success.js                     → página después de un pago exitoso
│   ├── cancel.js                      → página si el usuario cancela el pago
│   └── api/
│       ├── create-checkout-session.js → crea la sesión de stripe checkout
│       └── lead.js                    → captura leads que solo piden cotización
├── public/
│   ├── landing.html                   → la página completa: nav, hero, galería, mapa de red,
│   │                                     configurador embebido, footer con whatsapp. esto es
│   │                                     lo que se sirve en "/"
│   └── configurador.html              → versión standalone del configurador solo (ya no se usa
│                                          en la home, la dejamos por si la necesitas aparte)
├── .env.local.example                 → variables de entorno necesarias
└── package.json
```

`pages/index.js` lee `public/landing.html` y lo sirve tal cual como la página de inicio (sin iframe), así que los botones de "reservar con depósito" / "comprar completo" dentro de esa página llaman directo a `/api/create-checkout-session`, en el mismo dominio, sin problemas de cors.

## qué se le cambió al configurador original

1. **fuga de memoria en three.js** — se liberan geometrías/materiales del
   grupo anterior antes de reconstruir el 3d en cada `update()`.
2. **precio y lista de materiales ahora coinciden** — antes el precio se
   calculaba con una fórmula aproximada distinta a la del bom (lista de
   materiales); ahora ambos usan la misma función `getBOMParts()`.
3. **toggle de moneda mxn/usd** — junto al de idioma, en el header. el tipo
   de cambio está en la constante `MXN_PER_USD` (ver nota abajo).
4. **el botón "solicitar cotización" ahora abre un modal con 3 opciones**:
   reservar con depósito (30%), comprar completo, o solo pedir cotización
   sin pagar. las dos primeras crean una sesión de stripe checkout real; la
   tercera manda los datos a `/api/lead`.

## cómo correrlo localmente

```bash
npm install
cp .env.local.example .env.local
```

edita `.env.local` con tus llaves de stripe en modo **test**
(`sk_test_...` / `pk_test_...`), disponibles en
https://dashboard.stripe.com/test/apikeys

```bash
npm run dev
```

abre http://localhost:3000 — deberías ver el configurador funcionando.

## probar el pago (modo test)

al dar clic en "reservar con depósito" o "comprar completo", te va a
redirigir a un checkout real de stripe. usa una tarjeta de prueba:

- número: `4242 4242 4242 4242`
- fecha: cualquier fecha futura
- cvc: cualquier 3 dígitos
- código postal: cualquier valor

si el pago se completa, stripe te regresa a `/success`. si lo cancelas, a
`/cancel`.

## antes de aceptar pagos reales

recuerda lo que ya platicamos: necesitas la llc, el ein y la cuenta
bancaria de negocio en estados unidos aprobadas **antes** de que stripe te
apruebe la cuenta en modo producción. mientras tanto, todo esto funciona
perfecto en modo test.

cuando stripe apruebe tu cuenta:
1. cambia `STRIPE_SECRET_KEY` y `STRIPE_PUBLISHABLE_KEY` en vercel
   (settings → environment variables) a las llaves que empiezan con
   `sk_live_` / `pk_live_`
2. actualiza `NEXT_PUBLIC_BASE_URL` a `https://ta.com`

## pendientes que quedan fuera de este mvp (a propósito, para no sobre-construir)

- **`/api/lead`** solo hace `console.log` del lead — antes de lanzar,
  conéctalo a una base de datos (supabase/postgres) o a un servicio de
  correo para que esos leads no se pierdan.
- **el tipo de cambio mxn→usd es una constante fija** (`MXN_PER_USD` en
  `configurador.html`) — considera conectarlo a una api de tipo de cambio
  antes de producción, o simplemente actualizarlo a mano cada semana.
- **el "maker asignado"** (`Taller Cedros, Querétaro`) sigue hardcodeado —
  cuando tengan más de un taller/fabricante, esto necesita lógica real de
  asignación por ubicación del cliente.
- **stripe webhooks**: hoy el flujo confía en que el navegador llegue a
  `/success` después de pagar. para producción conviene agregar un webhook
  de stripe (`checkout.session.completed`) que confirme el pago del lado
  del servidor de forma más confiable, incluso si el cliente cierra la
  pestaña antes de tiempo.

## siguiente paso: subir esto a tu repo

este proyecto se puede copiar directo dentro de tu repo de github que ya
armaste (o usarlo como base si aún no lo has creado). una vez ahí, conecta
el repo a vercel y agrega las mismas variables de entorno en el dashboard
de vercel (nunca subas `.env.local` a github — ya está en `.gitignore`).
