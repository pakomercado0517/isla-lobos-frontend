# 🌤️ Módulo de Clima - Isla Lobos

## 📋 Descripción

Módulo completo para la gestión de condiciones meteorológicas del sistema Isla Lobos. Incluye sincronización con SMN-CONAGUA, sistema de alertas automáticas, predicciones y estadísticas detalladas.

---

## 🎯 Funcionalidades

### **Para CONANP (Acceso Completo):**

- ✅ Ver condiciones meteorológicas actuales
- ✅ Sincronizar datos con SMN-CONAGUA
- ✅ Crear condiciones meteorológicas manualmente
- ✅ Ver historial de condiciones
- ✅ Ver alertas automáticas
- ✅ Ver predicción meteorológica (5-30 días)
- ✅ Ver estadísticas detalladas
- ✅ Editar/Eliminar condiciones (futuro)

### **Para Prestadores (Solo Lectura):**

- ✅ Ver condición actual
- ✅ Ver alertas activas
- ✅ Ver predicción meteorológica
- ✅ Consultar historial

---

## 🗂️ Estructura del Módulo

```
app/dashboard/clima/
├── page.tsx                    # Página principal (313 líneas)
├── README.md                   # Esta documentación
└── components/
    ├── index.ts                # Exportaciones centralizadas
    ├── utils.tsx               # 15 funciones helper
    ├── ClimaHeader.tsx         # Header con botón sincronizar
    ├── CondicionActualCard.tsx # Card de condición actual
    ├── AlertasCard.tsx         # Card de alertas
    ├── TablaHistorial.tsx      # Tabla de historial
    ├── PrediccionCard.tsx      # Card de predicción
    ├── EstadisticasCard.tsx    # Card de estadísticas
    ├── DialogCrearCondicion.tsx# Dialog para crear
    ├── LoadingState.tsx        # Estado de carga
    ├── ErrorAlert.tsx          # Alerta de error
    └── EmptyState.tsx          # Estado vacío
```

---

## 🔧 Server Actions Disponibles

Ubicación: `actions/clima.ts`

```typescript
// CRUD
getCondicionesMeteorologicas(); // Lista paginada
getCondicionMeteorologica(id); // Por ID
crearCondicionMeteorologica(data); // Crear (CONANP)
actualizarCondicionMeteorologica(); // Actualizar (CONANP)
eliminarCondicionMeteorologica(id); // Eliminar (CONANP)

// Consultas
getCondicionActual(); // Más reciente
getPrediccionMeteorologica(dias); // Predicción
getAlertasMeteorologicas(); // Alertas
getEstadisticasMeteorologicas(); // Estadísticas (CONANP)
sincronizarDatosSMN(params); // Sincronizar (CONANP)

// Utilidades
getResumenClima(); // Para widgets
```

---

## 📊 Tipos TypeScript

Ubicación: `lib/types/clima.ts`

```typescript
// Principales
CondicionMeteorologica; // Entidad principal
PrediccionMeteorologica; // Predicción
AlertaMeteorologica; // Alerta individual
AlertasMeteorologicas; // Conjunto alertas
EstadisticasMeteorologicas; // Estadísticas
ResultadoSincronizacionSMN; // Sincronización

// Enums
EstadoPuerto; // abierto | restricciones | cerrado | emergencia
NivelVisibilidad; // excelente | buena | regular | baja
FuenteMeteorologica; // CONAGUA | NOAA | Capitanía | Manual
TendenciaMeteorologica; // creciente | estable | decreciente
SeveridadAlerta; // baja | media | alta | critica
```

---

## 🚀 Cómo Usar

### **1. Sincronizar con SMN-CONAGUA (CONANP)**

```typescript
1. Ir a /dashboard/clima
2. Click en botón "Sincronizar SMN"
3. El sistema:
   - Consulta API de CONAGUA
   - Procesa últimas 24 horas
   - Crea/actualiza condiciones
   - Muestra resultados
4. Vista se actualiza automáticamente
```

### **2. Ver Condición Actual**

```typescript
Tab "Actual":
- Condición meteorológica más reciente
- Métricas destacadas (oleaje, viento)
- Alertas activas si las hay
- Predicción 5 días si disponible
```

### **3. Consultar Predicción**

```typescript
Tab "Predicción":
- Predicción 5 días (configurable)
- Promedios y tendencias
- Recomendación automática
- Condiciones día por día
```

### **4. Crear Condición Manual (CONANP)**

```typescript
1. Click en botón flotante (+)
2. Llenar formulario:
   - Fecha y hora
   - Oleaje (metros)
   - Viento (km/h y dirección)
   - Visibilidad
   - Estado puerto
   - Fuente
   - Predicción (opcional)
3. Click "Crear Condición"
4. Verificar en historial
```

---

## ⚠️ Validaciones de Seguridad

El sistema evalúa automáticamente si las condiciones son seguras:

```typescript
Condición SEGURA:
- Puerto abierto
- Oleaje < 1.5m
- Viento < 20 km/h
- Visibilidad buena/excelente

Condición PRECAUCIÓN:
- Oleaje 1.5-2.5m
- Viento 20-30 km/h
- Visibilidad regular

Condición PELIGROSA:
- Oleaje > 2.5m
- Viento > 30 km/h
- Visibilidad baja
- Puerto cerrado/emergencia
```

---

## 🎨 Paleta de Colores

```typescript
Estados del Puerto:
🟢 Abierto      → Verde
🟡 Restricciones → Amarillo
🔴 Cerrado       → Rojo
⚡ Emergencia    → Rojo oscuro

Alertas:
Baja     → Azul
Media    → Amarillo
Alta     → Naranja
Crítica  → Rojo

Tendencias:
Creciente   → Rojo (empeorando)
Estable     → Azul (sin cambios)
Decreciente → Verde (mejorando)
```

---

## 🔍 Troubleshooting

### **No aparecen datos:**

1. Verificar que el backend esté corriendo
2. Sincronizar con SMN
3. Verificar token de autenticación

### **Error al sincronizar:**

1. Verificar conexión a internet
2. Verificar que API de CONAGUA esté disponible
3. Revisar logs del backend

### **No veo el tab de Estadísticas:**

- Solo visible para usuarios con rol CONANP

---

## 📖 Documentación Relacionada

- `documentation/CLIMA_API_DOCUMENTATION.md` - Documentación completa del API
- `documentation/API_ROUTES_REFERENCE.md` - Referencia de endpoints
- `documentation/IMPLEMENTACION_CLIMA_COMPLETADA.md` - Resumen de implementación

---

**Última actualización:** 10 de Octubre, 2025  
**Versión:** 1.0.0  
**Mantenedor:** Equipo Isla Lobos Frontend
