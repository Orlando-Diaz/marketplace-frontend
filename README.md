# Marketplace Frontend

Frontend de un marketplace de productos (tipo mini Mercado Libre), desarrollado con Angular como parte de un proyecto full-stack. Permite explorar un catálogo con filtros, comprar con un checkout completo, calificar compras, publicar y administrar productos propios, y gestionar categorías como administrador. Consume la API REST del [backend en Spring Boot](https://github.com/Orlando-Diaz/marketplace-backend).

## 🚀 Probar la app

**Demo en vivo:** https://marketplace-orlandodiaz.vercel.app

> ⏳ El backend está en un plan gratuito que se suspende tras 15 minutos sin uso. Si la app tarda en cargar, espera 1-2 minutos mientras el servidor despierta; después responde con normalidad.

Puedes explorar la app sin registrarte, usando las cuentas de demostración (también hay botones de acceso rápido en la pantalla de login):

| Rol | Correo | Contraseña | Qué puedes probar |
|-----|--------|------------|-------------------|
| Comprador / vendedor | `demo@marketplace.com` | `demo1234` | Carrito, checkout, historial de compras, reseñas, publicar, editar y pausar productos |
| Administrador | `admin@marketplace.com` | `admin1234` | Todo lo anterior + panel de administración de categorías (⚙️ Admin) |

> Las reglas de negocio del backend protegen la integridad de los datos: por ejemplo, no se puede eliminar una categoría que tenga productos o subcategorías.

## Stack técnico

- **Framework:** Angular 22 (Angular CLI 22.1.8)
- **Lenguaje:** TypeScript
- **Arquitectura:** componentes standalone (sin NgModules)
- **Estado y detección de cambios:** zoneless, con estado reactivo basado en signals y `computed`
- **Formularios:** Reactive Forms con validaciones, `FormArray` para campos dinámicos
- **HTTP:** HttpClient con interceptor funcional para JWT
- **Rutas:** guards funcionales (`authGuard`, `adminGuard`) con retorno a la página original
- **RxJS:** `forkJoin`, `debounceTime`, `map`, `takeUntilDestroyed`
- **Plantillas:** control de flujo moderno (`@if`, `@for`, `@empty`)
- **Configuración:** environments para separar la URL de la API en desarrollo y producción
- **Despliegue:** Vercel

## Estructura del proyecto

```
src/
├── environments/          → URL de la API por entorno (desarrollo / producción)
└── app/
    ├── core/
    │   ├── guards/        → authGuard (sesión) y adminGuard (rol ADMIN)
    │   ├── interceptors/  → interceptor que agrega el JWT a cada petición
    │   ├── models/        → interfaces TypeScript de los datos de la API
    │   └── services/      → servicios HTTP (auth, productos, categorías, carrito, direcciones, órdenes, reseñas)
    ├── features/
    │   ├── inicio/        → página de bienvenida con últimos productos
    │   ├── auth/          → login y registro
    │   ├── productos/     → catálogo con filtros, detalle, publicar/editar y mis productos
    │   ├── carrito/       → carrito de compras
    │   ├── checkout/      → dirección de envío y confirmación de compra
    │   ├── ordenes/       → historial de compras y reseñas
    │   └── admin/         → administración de categorías
    └── shared/
        ├── navbar/        → barra de navegación global
        └── producto-card/ → tarjeta de producto reutilizable
```

## Funcionalidades

### Compradores
- Catálogo público con **filtros combinables** (texto, categoría con subcategorías, rango de precio, solo con stock) y **ordenamiento**, con búsqueda automática (debounce) y paginación
- Página de inicio con bienvenida personalizada según la sesión y últimos productos publicados
- Detalle de producto con galería de imágenes, reseñas y selector de cantidad
- Carrito con cambio de cantidad (limitado por el stock), subtotales y total
- Checkout con selección o creación de dirección de envío y pago simulado
- Historial de compras con estado, items (a precio de compra) y dirección de envío
- Reseñas de 1 a 5 estrellas desde el historial de compras

### Vendedores
- Publicación de productos con categoría, stock y hasta 5 imágenes con vista previa
- "Mis productos": editar (reutilizando el formulario de publicar) y pausar/reactivar publicaciones

### Administradores
- Panel de categorías con vista de árbol: crear, editar y eliminar, respetando las reglas del backend

### Cuenta y sesión
- Registro e inicio de sesión con JWT y sesión persistente
- Pantallas de acceso con diseño dividido, mostrar/ocultar contraseña e indicador de seguridad de contraseña
- Acceso rápido con cuentas demo
- Rutas protegidas que redirigen al login y devuelven al usuario a la página donde estaba

## Decisiones técnicas

- **Signals en vez de variables normales:** en modo zoneless, las signals son las que le indican a Angular qué actualizar en pantalla. `computed` deriva estado automáticamente (por ejemplo, `esAdmin` a partir del usuario actual, o el árbol de categorías a partir de la lista plana).
- **Interceptor para el token:** ningún servicio agrega el JWT a mano; el interceptor lo adjunta a todas las peticiones.
- **Guards como experiencia de usuario, no como seguridad:** los guards evitan mostrar pantallas inútiles, pero la seguridad real está en el backend (`@PreAuthorize` y validación de dueño), porque el código del navegador se puede manipular.
- **Componentes reutilizables:** `ProductoCard` se usa en el inicio y en el catálogo; el formulario de publicar sirve también para editar.
- **Búsqueda con debounce:** el catálogo espera a que el usuario deje de escribir antes de consultar, evitando una petición por cada letra.
- **Errores del backend en pantalla:** los mensajes del `GlobalExceptionHandler` (stock insuficiente, email duplicado, validaciones por campo) se muestran directamente al usuario.

## Cómo correrlo localmente

### Requisitos
- Node.js
- Angular CLI: `npm install -g @angular/cli`
- El [backend](https://github.com/Orlando-Diaz/marketplace-backend) corriendo en `http://localhost:8080` (tiene CORS habilitado para `http://localhost:4200`)

### Pasos
1. Clona el repo.
2. Instala las dependencias:

```bash
npm install
```

3. Levanta el servidor de desarrollo:

```bash
ng serve
```

4. Abre `http://localhost:4200`

En desarrollo se usa `src/environments/environment.development.ts` (API en `localhost:8080`); al compilar para producción con `ng build` se usa `environment.ts`, que apunta al backend desplegado.

## Despliegue

Desplegado en **Vercel** desde la rama `main`, con redespliegue automático en cada push. El archivo `vercel.json` redirige todas las rutas a `index.html` para que el router de Angular funcione al recargar o abrir un enlace directo.

## Mejoras futuras

- Aviso visual mientras el servidor despierta tras estar inactivo
- Menú desplegable de usuario en la barra de navegación
- Tests de componentes

## Autor

**Orlando Díaz** — Ingeniero de Sistemas y Computación · [GitHub](https://github.com/Orlando-Diaz)