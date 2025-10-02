# 🏝️ Isla Lobos - Sistema de Gestión Turística

> **Sistema integral de gestión turística para la Reserva Natural Isla Lobos, desarrollado para CONANP y prestadores de servicios turísticos.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn/ui](https://img.shields.io/badge/Shadcn%2Fui-Latest-000000?style=for-the-badge)](https://ui.shadcn.com/)

## 📋 Descripción del Proyecto

**Isla Lobos** es una plataforma web desarrollada para la **Comisión Nacional de Áreas Naturales Protegidas (CONANP)** que permite la gestión integral de actividades turísticas en la Reserva Natural Isla Lobos. El sistema facilita la coordinación entre CONANP y los prestadores de servicios turísticos para el manejo sostenible del turismo en esta área protegida.

### 🎯 Objetivos Principales

- **Gestión de Embarcaciones**: Registro y control de embarcaciones autorizadas
- **Control de Salidas**: Programación y monitoreo de salidas turísticas
- **Sistema de Brazaletes**: Control de acceso y registro de visitantes
- **Gestión de Bloques Horarios**: Optimización de capacidad y flujo turístico
- **Reportes y Estadísticas**: Análisis de datos para toma de decisiones
- **Gestión de Usuarios**: Control de acceso diferenciado por roles

## 🏗️ Arquitectura del Sistema

### **Frontend (Este Repositorio)**

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Shadcn/ui
- **Autenticación**: JWT con cookies seguras
- **Estado**: React Hooks + Server Actions

### **Backend (Repositorio Separado)**

- **Framework**: Node.js + Express.js
- **Base de Datos**: PostgreSQL + Sequelize
- **Autenticación**: JWT + Bcrypt
- **API**: RESTful con validaciones robustas

## 👥 Roles del Sistema

### 🔵 **CONANP** (Administrador)

- Gestión completa del sistema
- Venta de brazaletes a prestadores
- Control de bloques horarios
- Generación de reportes
- Gestión de usuarios y embarcaciones

### 🟢 **Prestador de Servicios** (Usuario)

- Registro de salidas turísticas
- Gestión de embarcaciones propias
- Registro de uso de brazaletes
- Consulta de historial de actividades

## 🚀 Características Principales

### 🎫 **Sistema de Brazaletes**

- **Brazaletes Universales**: Válidos para cualquier destino
- **Control de Inventario**: Gestión de lotes y numeración
- **Venta Automatizada**: Asignación automática de rangos numéricos
- **Registro de Uso**: Vinculación con salidas específicas

### ⏰ **Gestión de Bloques Horarios**

- **3 Bloques Predefinidos**: Matutino, Mediodía, Vespertino
- **Capacidad Dinámica**: Cálculo automático de cupos disponibles
- **Múltiples Destinos**: Isla Lobos (con bloques) y Arrecifes (hora libre)
- **Estados Inteligentes**: Activo, Lleno, Cerrado por clima

### 🚤 **Control de Salidas**

- **Destinos Múltiples**:
  - Isla de Lobos (con bloques horarios)
  - Arrecife Tuxpan (hora libre)
  - Arrecife de en Medio (hora libre)
  - Arrecife Tanhuijo (hora libre)
- **Validación Automática**: Capacidad de embarcación y bloques
- **Estados de Salida**: Programada, En Curso, Completada, Cancelada

### 📊 **Dashboard y Reportes**

- **Estadísticas en Tiempo Real**: Salidas, brazaletes, ingresos
- **Reportes Detallados**: Por fecha, prestador, destino
- **Análisis de Capacidad**: Optimización de recursos
- **Historial Completo**: Auditoría de todas las operaciones

## 🛠️ Tecnologías Utilizadas

### **Frontend**

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "^1.0.0",
  "zod": "^3.22.0",
  "react-hook-form": "^7.48.0",
  "lucide-react": "^0.294.0"
}
```

### **Backend**

```json
{
  "express": "^4.18.0",
  "sequelize": "^6.35.0",
  "pg": "^8.11.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "helmet": "^7.1.0"
}
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**

- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL 14+
- Git

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/tu-usuario/isla-lobos-frontend.git
cd isla-lobos-frontend
```

### **2. Instalar Dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

### **3. Configurar Variables de Entorno**

```bash
cp env.example .env.local
```

Editar `.env.local`:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Autenticación
NEXTAUTH_SECRET=tu-secreto-super-seguro
NEXTAUTH_URL=http://localhost:3000

# Base de Datos (si usas Prisma localmente)
DATABASE_URL=postgresql://usuario:password@localhost:5432/isla_lobos
```

### **4. Ejecutar en Desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📁 Estructura del Proyecto

```
isla-lobos-frontend/
├── 📁 app/                          # App Router de Next.js
│   ├── 📁 dashboard/                # Panel CONANP
│   │   ├── 📁 brazaletes/          # Gestión de brazaletes
│   │   ├── 📁 usuarios/            # Gestión de usuarios
│   │   └── 📁 reportes/            # Reportes y estadísticas
│   ├── 📁 prestador/               # Panel Prestador
│   │   ├── 📁 brazaletes/          # Uso de brazaletes
│   │   ├── 📁 nueva-salida/        # Registro de salidas
│   │   └── 📁 salidas/             # Historial de salidas
│   ├── 📁 login/                   # Autenticación
│   └── 📁 registro/                # Registro de usuarios
├── 📁 components/                   # Componentes reutilizables
│   ├── 📁 ui/                      # Componentes base (Shadcn/ui)
│   └── 📁 brazaletes/              # Componentes específicos
├── 📁 lib/                         # Utilidades y configuración
│   ├── 📁 types/                   # Definiciones TypeScript
│   ├── 📁 contexts/                # Contextos React
│   └── 📁 utils/                   # Funciones utilitarias
├── 📁 actions/                     # Server Actions
├── 📁 documentation/               # Documentación del proyecto
└── 📁 public/                      # Archivos estáticos
```

## 🔐 Autenticación y Seguridad

### **Flujo de Autenticación**

1. **Login**: Usuario ingresa credenciales
2. **Validación**: Backend verifica en base de datos
3. **JWT**: Se genera token con información del usuario
4. **Cookies**: Token se almacena en cookies HTTP-only
5. **Middleware**: Verificación automática en rutas protegidas

### **Roles y Permisos**

```typescript
// Roles disponibles
type RolUsuario = "conanp" | "prestador";

// Permisos por rol
const PERMISOS = {
  conanp: [
    "dashboard:read",
    "usuarios:crud",
    "brazaletes:venta",
    "reportes:read",
    "bloques:manage",
  ],
  prestador: ["salidas:create", "brazaletes:uso", "embarcaciones:manage"],
};
```

## 📊 API y Endpoints

### **Autenticación**

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/logout` - Cerrar sesión

### **Salidas**

- `GET /api/salidas` - Listar salidas
- `POST /api/salidas` - Crear salida
- `PUT /api/salidas/:id` - Actualizar salida
- `GET /api/salidas/destinos` - Destinos disponibles

### **Bloques**

- `GET /api/bloques` - Bloques disponibles
- `GET /api/bloques/:id` - Bloque específico

### **Brazaletes**

- `GET /api/brazaletes/inventario` - Inventario CONANP
- `POST /api/brazaletes/venta` - Vender brazaletes
- `GET /api/brazaletes/mis-brazaletes` - Brazaletes del prestador
- `POST /api/brazaletes/uso` - Registrar uso

## 🎨 Diseño y UX

### **Sistema de Diseño**

- **Paleta de Colores**: Inspirada en el mar y la naturaleza
- **Tipografía**: Inter (legible y moderna)
- **Iconografía**: Lucide React (consistente y clara)
- **Componentes**: Shadcn/ui (accesibles y personalizables)

### **Principios de UX**

- **Simplicidad**: Interfaces intuitivas y fáciles de usar
- **Consistencia**: Patrones de diseño uniformes
- **Accesibilidad**: Cumple estándares WCAG 2.1
- **Responsividad**: Optimizado para todos los dispositivos

## 🧪 Testing y Calidad

### **Herramientas de Desarrollo**

- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **TypeScript**: Verificación de tipos
- **Husky**: Git hooks para calidad

### **Scripts Disponibles**

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run start        # Servidor producción
npm run lint         # Verificar código
npm run type-check   # Verificar tipos
```

## 📈 Roadmap y Futuras Mejoras

### **Fase Actual** ✅

- [x] Sistema de autenticación
- [x] Gestión de salidas
- [x] Sistema de brazaletes
- [x] Dashboard CONANP
- [x] Panel prestador

### **Próximas Fases** 🚧

- [ ] Sistema de notificaciones
- [ ] Integración con clima
- [ ] App móvil
- [ ] Reportes avanzados
- [ ] Integración con pagos

## 🤝 Contribución

### **Cómo Contribuir**

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Estándares de Código**

- Usar TypeScript estricto
- Seguir convenciones de naming
- Documentar funciones complejas
- Escribir tests para nuevas funcionalidades

## 📞 Soporte y Contacto

### **Equipo de Desarrollo**

- **Frontend**: [Tu Nombre] - [email@ejemplo.com]
- **Backend**: [Nombre Backend] - [email@ejemplo.com]
- **Diseño**: [Nombre Diseñador] - [email@ejemplo.com]

### **Documentación Adicional**

- [Documentación de la API](./documentation/API_ROUTES_REFERENCE.md)
- [Contexto del Proyecto](./documentation/PROYECTO_CONTEXTO.md)
- [Estado del Proyecto](./documentation/ESTADO_PROYECTO.md)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **CONANP** por la confianza y colaboración
- **Prestadores de Servicios** por su feedback valioso
- **Comunidad de Next.js** por las herramientas increíbles
- **Shadcn/ui** por los componentes de calidad

---

<div align="center">

**🏝️ Desarrollado con ❤️ para la conservación de Isla Lobos**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tu-usuario/isla-lobos-frontend)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/tu-perfil)

</div>
