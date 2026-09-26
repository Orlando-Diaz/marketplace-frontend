# Marketplace Frontend

Frontend de un marketplace de productos (tipo mini Mercado Libre), desarrollado con Angular como parte de un proyecto full-stack. Consume la API REST del [backend en Spring Boot](https://github.com/Orlando-Diaz/marketplace-backend).

## Stack técnico
- **Framework:** Angular 22 (Angular CLI 22.1.8)
- **Lenguaje:** TypeScript
- **Arquitectura:** componentes standalone (sin NgModules)
- **Detección de cambios:** zoneless, con estado reactivo basado en signals
- **Formularios:** Reactive Forms con validaciones
- **HTTP:** HttpClient con interceptor funcional para JWT
- **Control de flujo:** sintaxis moderna de plantillas (`@if`, `@for`)

## Estructura del proyecto

src/app/
├── core/
│ ├── interceptors/ → interceptor que agrega el JWT a cada petición
│ ├── models/ → interfaces TypeScript de los datos de la API
│ └── services/ → servicios HTTP (auth, productos, categorías, carrito)
├── features/
│ ├── inicio/         → página de bienvenida
│ ├── auth/ → pantallas de login y registro
│ └── productos/ → catálogo de productos
└── shared/
└── navbar/ → barra de navegación global


## Funcionalidades

### Completado
- Registro de usuarios con validación en el formulario y mensajes de error del backend (email duplicado, validaciones)
- Inicio de sesión con JWT, sesión persistente en `localStorage`
- Interceptor HTTP que adjunta automáticamente el token a las peticiones
- Barra de navegación que cambia según el estado de la sesión
- Catálogo público de productos con paginación, precio, vendedor, calificación promedio y estado de stock
- Página de inicio con bienvenida personalizada según la sesión y últimos productos publicados
- Detalle de producto con galería de imágenes, reseñas y selector de cantidad para agregar al carrito

### Pendiente
- Carrito de compras
- Checkout y gestión de direcciones
- Historial de órdenes
- Publicación de productos
- Guards de rutas protegidas

## Cómo correrlo localmente

### Requisitos
- Node.js
- Angular CLI: `npm install -g @angular/cli`
- El [backend](https://github.com/Orlando-Diaz/marketplace-backend) corriendo en `http://localhost:8080` (tiene CORS habilitado para `http://localhost:4200`)

### Pasos
1. Clona el repo
2. Instala las dependencias:
```bash
   npm install
```
3. Levanta el servidor de desarrollo:
```bash
   ng serve
```
4. Abre `http://localhost:4200`

## Autor

Orlando Díaz — [GitHub](https://github.com/Orlando-Diaz)