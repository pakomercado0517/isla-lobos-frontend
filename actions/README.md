# Server Actions - Guía de Uso

## 📋 Resumen de la Migración

Se ha migrado completamente el sistema de autenticación de llamadas directas a la API hacia **Server Actions** con `useActionState` para un mejor manejo del estado y una experiencia más robusta.

## 🏗️ Estructura Implementada

```
actions/
├── auth.ts          # Server actions para autenticación
└── user.ts          # Funciones auxiliares para obtener usuario

lib/
├── types/
│   └── actions.ts   # Tipos TypeScript para estados de acciones
└── contexts/
    └── AuthContext.tsx # Contexto actualizado con useActionState
```

## 🔧 Server Actions Disponibles

### 1. **loginAction**
```typescript
const { loginState, loginAction } = useAuth();

// En un formulario:
<form action={loginAction}>
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Login</button>
</form>

// Estado:
loginState.success    // boolean
loginState.error      // string | undefined
loginState.data       // User | undefined
loginState.redirectTo // string | undefined
```

### 2. **registerAction**
```typescript
const { registerState, registerAction } = useAuth();

// En un formulario:
<form action={registerAction}>
  <input name="nombre" required />
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <input name="confirmPassword" type="password" required />
  <input name="codigoInvitacion" required />
  <button type="submit">Registrar</button>
</form>
```

### 3. **logoutAction**
```typescript
const { logoutAction } = useAuth();

// Uso directo:
const handleLogout = () => {
  logoutAction();
};
```

### 4. **forgotPasswordAction**
```typescript
const { forgotPasswordState, forgotPasswordAction } = useAuth();

<form action={forgotPasswordAction}>
  <input name="email" type="email" required />
  <button type="submit">Enviar</button>
</form>
```

### 5. **validateInvitationAction**
```typescript
const { validateInvitationState, validateInvitationAction } = useAuth();

<form action={validateInvitationAction}>
  <input name="codigo" required />
  <button type="submit">Validar</button>
</form>
```

## 🍪 Manejo de Cookies

Las server actions manejan automáticamente las cookies de autenticación:

- **Token**: Almacenado en cookie `httpOnly` para seguridad
- **Usuario**: Almacenado en cookie accesible desde el cliente
- **Limpieza automática**: En logout y errores de autenticación

## 🔄 Flujo de Autenticación

1. **Login**: Server action → Cookie → Redirección automática
2. **Verificación**: `getCurrentUser()` desde cookies del servidor
3. **Protección de rutas**: `useRouteProtection()` simplificado
4. **Logout**: Server action → Limpieza de cookies → Redirección

## 📱 Páginas Actualizadas

- ✅ `/login` - Usa `loginAction`
- ✅ `/register` - Usa `registerAction` y `validateInvitationAction`
- ✅ `/forgot-password` - Usa `forgotPasswordAction`
- ✅ `/prestador` - Usa `logoutAction`

## 🎯 Ventajas de la Nueva Implementación

1. **Mejor UX**: Estados de carga y error más consistentes
2. **Seguridad**: Cookies httpOnly para tokens
3. **Simplicidad**: Menos código boilerplate
4. **Performance**: Server-side rendering optimizado
5. **Mantenibilidad**: Lógica centralizada en server actions

## 🔧 Cómo Extender

Para agregar nuevas funcionalidades:

1. **Crear server action** en `actions/auth.ts`
2. **Agregar tipos** en `lib/types/actions.ts`
3. **Actualizar contexto** en `AuthContext.tsx`
4. **Usar en componentes** con `useActionState`

## 🐛 Debugging

Los server actions incluyen logging detallado:

```typescript
console.log('🔐 LoginAction:', { email, success: true });
console.log('🔐 RouteProtection:', { user, role, authorized });
```

## 📝 Notas Importantes

- Las server actions se ejecutan en el servidor
- Los estados se sincronizan automáticamente con el cliente
- Las redirecciones se manejan automáticamente en el contexto
- Los errores se capturan y muestran en la UI