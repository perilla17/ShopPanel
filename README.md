# ShopPanel

Panel de pedidos de productos para la actividad entregable de la Unidad II de Ingeniería de Sistemas. La aplicación usa React, Vite, React Router y Bootstrap.

## Funcionamiento

ShopPanel usa Supabase Auth para iniciar y cerrar sesión. Al ingresar, el usuario llega al catálogo. El listado y el detalle consultan productos de DummyJSON mediante solicitudes GET con `fetch`.

ShopPanel presenta en español los nombres, las descripciones y las categorías del catálogo de muestra. La búsqueda admite términos en español y reconoce los nombres originales y las marcas. Los precios y las calificaciones usan el formato de Colombia. Los productos nuevos de DummyJSON aparecen con su texto original hasta que se incorpora su traducción.

Desde el detalle se registra un pedido simulado con el nombre del cliente y una cantidad. El pedido conserva el identificador, el nombre, la imagen y el precio del producto seleccionado. En **Pedidos** se puede consultar la lista, filtrarla y cambiar el estado a Pendiente, Confirmado, Enviado o Cancelado. Los pedidos y sus cambios se conservan con `localStorage` en el navegador.

| Ruta | Vista |
| --- | --- |
| `/` | Redirige a `/productos`. |
| `/login` | Formulario público de inicio de sesión. |
| `/productos` | Catálogo protegido. |
| `/productos/:id` | Detalle protegido y registro del pedido. |
| `/pedidos` | Lista protegida y cambio de estado. |
| `*` | Página para direcciones inexistentes. |

Las rutas protegidas redirigen a `/login` cuando no hay una sesión activa.

## Ejecutar en Windows

1. Instala Node.js 22.12 o una versión posterior y ejecuta estos comandos en PowerShell:

   ```powershell
   git clone https://github.com/perilla17/ShopPanel.git
   cd ShopPanel
   npm ci
   Copy-Item .env.example .env.local
   ```

2. Crea tu proyecto en Supabase y completa estas variables en `.env.local` con la URL del proyecto y su clave pública:

   ```dotenv
   VITE_SUPABASE_URL=
   VITE_SUPABASE_PUBLISHABLE_KEY=
   ```

   Cada integrante usa su propio proyecto y sus credenciales de prueba. El archivo `.env.local` está excluido de Git. Usa la clave publicable y guarda las contraseñas fuera del código.

3. En Supabase, crea un usuario en **Authentication → Users → Add user → Create new user** y marca **Auto Confirm User** para la prueba.
4. Ejecuta `npm run dev` y abre la dirección que muestra Vite. Entra en `/login` con el correo y la contraseña del usuario de prueba.

## Probar la aplicación

1. Intenta ingresar con los campos vacíos y luego con una contraseña incorrecta. El formulario debe mostrar un mensaje en cada caso.
2. Ingresa con el usuario de prueba. Debes llegar a `/productos`, ver el catálogo y conservar la sesión al recargar.
3. Busca un producto en español y pulsa **Ver detalle** en una tarjeta. En **Nuevo pedido**, escribe el nombre del cliente, elige una cantidad de 1 a 99 y pulsa **Registrar pedido**.
4. Comprueba en `/pedidos` que el producto aparece con el estado **Pendiente**. Cámbialo a **Confirmado** y recarga para verificar que conserva el estado.
5. Pulsa **Cerrar sesión**. Debes volver a `/login`. Abre `/pedidos` directamente y comprueba que el sistema te lleva otra vez al login.
6. Ejecuta `npm run build` para comprobar la compilación de producción.

## Organización del código

| Carpeta | Responsabilidad |
| --- | --- |
| `src/pages` | Vistas de login, catálogo, detalle, pedidos y página 404. |
| `src/components` | Tarjetas de producto, navegación, protección de rutas y botón de cierre de sesión. |
| `src/services` | Autenticación con Supabase, consultas a DummyJSON y persistencia de pedidos. |
| `src/context` | Contexto global de la sesión, accesible con `useAuth()`. |
| `src/data` | Traducciones al español de los productos de muestra de DummyJSON. |
