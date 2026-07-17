# Jordania ERP

Versión inicial del núcleo de Jordania ERP.

## Incluye

- Inicio de sesión con Firebase Authentication
- Dashboard protegido
- Menú lateral adaptable
- Cierre de sesión
- Base visual reutilizable
- Configuración de Firebase separada

## Configuración

1. Abre `src/config/firebase.js`.
2. Sustituye los valores de ejemplo por la configuración de tu aplicación web de Firebase.
3. En Firebase Authentication activa `Correo electrónico/Contraseña`.
4. Crea al menos un usuario desde Authentication > Users.
5. Ejecuta `firebase deploy`.

## Estructura

- `src/index.html`: inicio de sesión
- `src/pages/dashboard.html`: panel principal
- `src/config/firebase.js`: credenciales de Firebase
- `src/js/auth.js`: autenticación
- `src/js/login.js`: lógica del login
- `src/js/dashboard.js`: lógica del panel
- `src/css/main.css`: estilos generales
- `src/css/dashboard.css`: estilos del panel

## Nota

Esta versión no utiliza Firebase Storage.
