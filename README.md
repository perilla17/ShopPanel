# ShopPanel

Panel de pedidos de productos para la actividad entregable de la Unidad II de Ingeniería de Sistemas. La aplicación usa React, Vite, React Router y Bootstrap.

## Estado del proyecto

En `main` ya se puede iniciar y cerrar sesión con Supabase Auth. La ruta protegida `/productos` muestra un panel temporal con el correo del usuario autenticado. El catálogo y el detalle se consultarán en DummyJSON mediante `fetch`. Los pedidos simulados y sus cambios de estado se guardarán en `localStorage` cuando se integre ese módulo.

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

## Probar la autenticación

1. Intenta ingresar con los campos vacíos y luego con una contraseña incorrecta. El formulario debe mostrar un mensaje en cada caso.
2. Ingresa con el usuario de prueba. Debes llegar a `/productos` y seguir allí al recargar la página.
3. Pulsa **Cerrar sesión**. Debes volver a `/login`. Si abres `/productos` directamente, el sistema debe llevarte de nuevo al login.
4. Ejecuta `npm run build` para comprobar la compilación de producción.

## Organización del código

| Carpeta | Responsabilidad |
| --- | --- |
| `src/pages` | Vistas asociadas a las rutas, como el formulario de login. |
| `src/components` | Componentes reutilizables, como el botón de cierre de sesión. |
| `src/services` | Cliente de Supabase y operaciones de autenticación. |
| `src/context` | Contexto global de la sesión, accesible con `useAuth()`. |
