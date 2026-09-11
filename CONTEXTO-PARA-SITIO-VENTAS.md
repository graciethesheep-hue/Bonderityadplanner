# Contexto: Live Demo de Bailey Life App para el sitio de ventas

Este archivo es para pegarlo/leerlo en la OTRA sesión de Claude Code donde se construye el sitio
de ventas (dominio propio + checkout Hotmart + Meta Ads Pixel). Esa sesión no tiene memoria de
esta conversación, así que aquí está todo lo que necesita saber sobre el demo.

## URL en vivo (ya desplegado)

```
https://demo.bonderityestudio.com
```

Ya está publicado — Vercel + DNS de Hostinger conectados y funcionando. Esta es la URL que va
dentro del `<iframe>` del sitio de ventas.

### Qué hay que agregar en el sitio de ventas

Un `<iframe>` apuntando a esa URL, en la sección del sitio destinada al demo. Ejemplo de punto de
partida (ajustar tamaño/estilo al diseño real de la página):

```html
<iframe
  src="https://demo.bonderityestudio.com"
  title="Demo en vivo de Bailey Life App"
  loading="lazy"
  style="width:100%; max-width:1280px; height:800px; min-height:600px; border:0; border-radius:16px; box-shadow:0 8px 30px rgba(0,0,0,0.12);"
></iframe>
```

Notas sobre el tamaño: la app es un dashboard completo con su propia barra lateral (pensado para
pantallas ≥768px de ancho). En mobile conviene un alto generoso (700–900px) para que no quede
todo apretado dentro del iframe — no hay que replicar el layout responsive de la app, ella ya se
adapta sola al ancho que le dé el iframe, pero si el iframe queda muy angosto en mobile, la
barra lateral colapsa igual que en la app real (ya tiene ese comportamiento incorporado).
No hace falta agregar ningún aviso de "esto es un demo" en el sitio — el propio iframe ya trae su
franja superior con esa aclaración y su botón de compra (ver más abajo).

## Qué es esto

`Life-Planner-ES\deploy-demo\` es una build especial de Bailey Life App (el mismo producto que se
vende) pensada para **incrustarse como `<iframe>` dentro del sitio de ventas**. No es un mockup ni
un video: es la app real corriendo, con datos de ejemplo de ~3 meses que se generan solos en el
navegador de cada visitante la primera vez que la cargan — así que se puede tocar, hacer clic,
navegar entre pestañas, y siempre se ve "viva" (las fechas son relativas a hoy, nunca quedan
viejas), sin importar cuándo entre alguien ni cuándo se haya desplegado.

## Por qué está en su propio subdominio (importante para no romper el pixel/checkout)

- El demo vive en **su propio proyecto de Vercel, en su propio subdominio**
  (`demo.bonderityestudio.com`) — **nunca** en el mismo deploy/dominio que el sitio de ventas
  (que irá en `bonderityestudio.com` / `www.bonderityestudio.com`).
- Por qué: mismo dominio = mismo origin = mismo `localStorage`. Si en el futuro la app real de
  pago vive bajo el dominio principal, no debe compartir almacenamiento con los datos falsos del
  demo. Además, cada proyecto se actualiza sin tocar el otro.
- Al incrustarlo como `<iframe>` de otro origin, es técnicamente imposible que el demo interfiera
  con el Meta Pixel o con el flujo de checkout de Hotmart — esos viven en el documento del sitio
  de ventas, fuera del iframe, y un iframe de otro origin no puede tocarlos sin `postMessage`
  explícito (que aquí no se usa).
- El servidor del demo no envía `X-Frame-Options` ni `Content-Security-Policy` restrictivos
  (confirmado), así que no hace falta configuración extra de headers para poder incrustarlo.

## El botón de compra ya está resuelto — no hay que duplicarlo

El demo tiene su propia franja superior fija con el texto "Demo en vivo — así se ve Bailey Life
App por dentro. Tócala, explórala." y un botón "Consíguela ahora →" que ya apunta al link real de
Hotmart (`https://pay.hotmart.com/W107275634J?off=i40trpw5&checkoutMode=10`), con
`target="_blank"` (abre en pestaña nueva, no navega el iframe). Esto se hizo a propósito **dentro
del demo** y no en el sitio de ventas: así funciona igual sin importar cómo llegue alguien a la
URL (incrustado o si alguien comparte el link directo), y nadie puede "usar gratis" el demo sin
ver nunca el llamado a comprar.

Si el sitio de ventas quiere un botón de compra PROPIO además del de la franja (por ejemplo,
debajo del iframe, o en el hero de la página), puede usar el mismo link de Hotmart de arriba —
no hay ningún truco especial, es un link de checkout normal.

## No debería pedir nada al entrar

El demo está ajustado para que la primera impresión sea directa al dashboard, sin interrupciones:
no pide activar notificaciones del navegador ni pide hacer un respaldo (dos popups que la app real
sí muestra normalmente en esos casos, pero que en un demo público solo estorban). Si alguna vez
alguien ve una de esas ventanas aparecer en el demo, es un bug a reportar en la sesión de
`Life-Planner-ES\`, no algo que arreglar desde el sitio de ventas.

## Nada de esto expone datos reales

Los datos que se ven en el demo (tareas, presupuesto, hábitos, etc.) son 100% inventados y se
regeneran por navegador. No hay ningún timestamp de "cuándo se generó" visible en la interfaz —
las fechas que muestra la app (ej. "Hoy es sábado, 22 de agosto") son la fecha real del
dispositivo de quien la está viendo en ese momento, calculada en vivo, igual que en la app de
pago real.

## Si el sitio de ventas necesita cambiar algo del demo (banner, datos, etc.)

Ese trabajo se hace en la sesión de Claude Code de `Life-Planner-ES\`, no en la del sitio — ahí
vive el código fuente real de la app. `deploy-demo\index.html` es la build que se despliega tal
cual; no se edita "a mano" desde el proyecto del sitio de ventas.
