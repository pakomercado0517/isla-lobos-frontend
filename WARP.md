#Contexto del Proyecto

# 🏝️ Isla Lobos - Sistema de Gestión de Bloques y Salidas

## 📋 **Contexto del Proyecto**

### **Problema a Resolver:**

La CONANP (Comisión Nacional de Áreas Naturales Protegidas) necesita un sistema para gestionar el turismo en Isla de Lobos, donde actualmente:

- Se maneja todo por WhatsApp (grupos de chat)
- Hay límites de capacidad (65 personas normales, hasta 150 en temporada alta)
- Se crean bloques horarios (3 bloques al día) para controlar el flujo
- Los prestadores de servicios envían mensajes manuales
- No hay control centralizado ni reportes automatizados
- **Dependencia del clima:** Capitanía de Puerto puede cerrar/abrir el puerto por condiciones meteorológicas
- **Cancelaciones imprevistas:** Pueden ser por horas o días completos
- **Comunicación de emergencia:** No hay sistema automatizado para notificar cambios de estado

### **Modelo de Negocio:**

- **Monetización:** Vender el sistema a prestadores de servicios autorizados
- **CONANP:** Obtiene control total y automatización
- **Prestadores:** Facilidad de uso y profesionalización
- **Sistema de invitaciones:** Solo prestadores autorizados por CONANP

## 🎯 **Funcionalidades Principales**

### **Vista Prestador de Servicios:**

- Formulario rápido para registrar salida
- Selección de embarcación y capacidad
- Registro de pasajeros por viaje
- Selección de bloque horario disponible
- Confirmación inmediata de registro

### **Vista CONANP (Administración):**

- Dashboard con estado de bloques en tiempo real
- Tabla de capacidad: Total | Registrados | Disponibles | Estatus
- Estados visuales: 🟢 Disponible | 🟡 Casi lleno | 🔴 Lleno
- Generación de reportes PDF/Excel
- Control de permisos y acceso

## 🔧 **Stack Tecnológico**

### **Backend:**

- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **Bcrypt** - Encriptación

### **Estructura del Proyecto:**

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, etc.)
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Definición de rutas
│   ├── types/           # Tipos de TypeScript
│   ├── utils/           # Utilidades
│   └── index.ts         # Servidor principal
```

## 📊 **Entidades del Sistema**

### **Usuarios:**

- **CONANP:** Acceso completo + reportes
- **Prestadores:** Solo registro de salidas
- Sistema de roles y permisos

### **Embarcaciones:**

- Nombre, matrícula, capacidad
- Estado: disponible | en_uso | mantenimiento
- Asociadas a prestadores

### **Bloques:**

- Horarios fijos (ej: 08:00-10:00, 10:00-12:00, 12:00-14:00)
- Capacidad total por bloque
- Estado: activo | inactivo | suspendido_por_clima | cerrado_capitaria
- **Control meteorológico:** Integración con alertas de Capitanía de Puerto
- **Suspensiones temporales:** Por horas o días completos

### **Salidas:**

- Registro de viajes por prestador
- Fecha, pasajeros, observaciones
- Estado: programada | en_curso | completada | cancelada | cancelada_por_clima | cancelada_capitaria
- **Motivo de cancelación:** Clima, Capitanía, operacional
- **Reembolsos:** Gestión automática de cancelaciones por clima

### **Condiciones Meteorológicas:**

- **Fecha y hora:** Timestamp de la medición
- **Oleaje:** Altura en metros (máximo permitido por embarcación)
- **Viento:** Velocidad y dirección
- **Visibilidad:** Condiciones de visibilidad
- **Estado del puerto:** Abierto | Restricciones | Cerrado
- **Predicción:** Condiciones esperadas para próximos 5 días
- **Fuente:** CONAGUA, NOAA, Capitanía de Puerto

## 🌊 **Manejo de Clima y Capitanía de Puerto**

### **Estados del Puerto:**

- **🟢 Abierto:** Operaciones normales
- **🟡 Restricciones:** Solo embarcaciones menores
- **🔴 Cerrado:** Sin operaciones
- **⚡ Emergencia:** Cierre inmediato

### **Tipos de Suspensión:**

- **Por horas:** 2-6 horas de cierre
- **Por día:** Cierre completo del día
- **Por múltiples días:** Temporada de mal clima
- **Reapertura gradual:** Por bloques horarios

### **Notificaciones Automáticas:**

- **CONANP:** Recibe alertas inmediatas de cambios
- **Prestadores:** Notificación por WhatsApp, email y app
- **Pasajeros:** Si hay sistema de reservas, notificación automática
- **Público general:** Actualización en sitio web/dashboard público

### **Gestión de Cancelaciones:**

- **Cancelación masiva:** Todos los bloques del día
- **Cancelación selectiva:** Solo bloques específicos
- **Reagendamiento:** Opción de mover salidas al siguiente día disponible
- **Reembolsos:** Gestión automática de devoluciones

### **Integración con Capitanía:**

- **API oficial:** Si está disponible
- **Webhook:** Para recibir notificaciones automáticas
- **Verificación manual:** CONANP puede confirmar estados
- **Historial:** Registro de todos los cierres y reaperturas

### **Servicios Meteorológicos Integrados:**

- **API de CONAGUA:** Datos oficiales de México
- **NOAA/Servicios marítimos:** Oleaje, viento, corrientes
- **Predicciones:** Hasta 7 días de anticipación
- **Alertas automáticas:** Cambios en condiciones
- **Límite de reserva:** Máximo 5 días antes de la fecha

### **Control de Oleaje para Reservas:**

- **Nivel de oleaje:** Máximo permitido por embarcación
- **Advertencias:** Cuando el oleaje supere límites seguros
- **Restricciones:** Por tipo de embarcación (menor/mayor)
- **Cancelación automática:** Si las condiciones empeoran
- **Reagendamiento:** Opción automática para fechas alternativas

## 🚀 **Funcionalidades Avanzadas Planificadas**

### **Sistema de Invitaciones:**

- Códigos únicos con expiración
- Verificación de documentos CONANP
- Control de acceso estricto

### **Automatizaciones:**

- **Bot de WhatsApp:** Resumen diario automático
- **Notificaciones:** Email, WhatsApp, plataforma
- **Recordatorios:** Renovación de permisos
- **Reportes:** Diarios y mensuales automáticos
- **Alertas meteorológicas:** Notificaciones automáticas de cierre de puerto
- **Cancelaciones masivas:** Suspensión automática de bloques por clima
- **Reapertura:** Notificación automática cuando se reabre el puerto

### **Dashboard CONANP:**

- Métricas en tiempo real
- Alertas inteligentes
- Comparativas históricas
- Predicciones de ocupación

### **Monetización:**

- Suscripción mensual por prestador
- Planes básico y premium
- Servicios adicionales

## 📱 **Endpoints API Sugeridos**

```
/api/auth          # Autenticación JWT
/api/usuarios      # Gestión de usuarios
/api/embarcaciones # CRUD embarcaciones
/api/bloques       # Gestión de bloques horarios
/api/salidas       # Registro de salidas
/api/reportes      # Generación de reportes
/api/dashboard     # Datos para dashboard
/api/invitaciones  # Sistema de invitaciones
/api/clima         # Condiciones meteorológicas actuales
/api/predicciones  # Pronósticos de 5 días
/api/capitaria     # Estados de puerto
/api/oleaje        # Niveles de oleaje por embarcación
/api/notificaciones # Sistema de alertas
```

## 🔐 **Seguridad y Validaciones**

### **Autenticación:**

- JWT con roles (admin, operador, capitan)
- Rate limiting para prevenir spam
- Validación de permisos por endpoint

### **Validaciones:**

- Capacidad disponible antes de registrar
- Horarios dentro de bloques válidos
- Estados de embarcaciones
- Permisos de usuarios

### **Auditoría:**

- Log completo de acciones
- Backup automático
- Encriptación de datos sensibles

## 📈 **Estrategia de Implementación**

### **Fase 1 - MVP:**

- Sistema básico de bloques y salidas
- Autenticación y roles
- Reportes básicos en Excel

### **Fase 2 - Automatización:**

- Bot de WhatsApp
- Notificaciones por email
- Dashboard avanzado

### **Fase 3 - Escalabilidad:**

- App móvil
- Integraciones externas
- Funcionalidades premium

## 💡 **Ideas de Diferenciación**

- Certificación oficial por CONANP
- Sello de calidad para prestadores
- Programa de lealtad
- Capacitación incluida
- Soporte 24/7 en temporada alta

## 🎯 **Valor para CONANP**

1. **Reducción de carga administrativa** del 70%
2. **Eliminación de errores** de comunicación
3. **Cumplimiento automático** de regulaciones
4. **Datos en tiempo real** para decisiones
5. **Escalabilidad** para otras áreas protegidas

## 🎯 **Valor para Prestadores**

1. **Facilidad de uso** vs WhatsApp
2. **Confirmación inmediata** de disponibilidad
3. **Historial** de servicios
4. **Notificaciones** de renovación
5. **Profesionalización** de operación

---

## 👴👵 **Consideraciones para Usuarios Mayores**

### **Diseño Accesible:**

- **Botones grandes:** Mínimo 44px de tamaño
- **Texto grande:** Fuentes de 16px o más
- **Colores contrastantes:** Alto contraste para mejor visibilidad
- **Navegación simple:** Máximo 3 opciones por pantalla
- **Iconos descriptivos:** Con texto explicativo

### **Soporte Personalizado:**

- **Capacitación presencial:** En el muelle o centro comunitario
- **Manual impreso:** Con capturas de pantalla grandes
- **Videos tutoriales:** Con audio en español
- **Soporte telefónico:** Durante horarios de operación
- **Asistencia familiar:** Modo "ayudante" para familiares

### **Alternativas de Uso:**

- **Línea telefónica:** Para registro de salidas
- **Formulario físico:** En el muelle con ingreso manual
- **Representante:** Familiar/empleado maneja la app
- **Técnico comunitario:** Ayuda a múltiples prestadores

## 💰 **Modelo de Costos y Pagos**

### **Costos Estimados:**

- **Desarrollo inicial:** $36,000 - $57,000 USD
- **Operación mensual:** $1,350 - $2,950 USD
- **Costo por prestador (20 usuarios):** $100 USD/mes
- **Costo por prestador (30 usuarios):** $83 USD/mes
- **Costo por prestador (50 usuarios):** $60 USD/mes

### **Alternativas de Pago:**

- **Sistema híbrido:** $50 USD/mes (incluye soporte telefónico)
- **Registro manual:** $30 USD/mes (solo reportes básicos)
- **Asistencia comunitaria:** Descuento del 20% por grupo

## 📝 **Notas de Desarrollo**

- **Prioridad:** Sistema robusto y escalable
- **Enfoque:** Automatización y control
- **Objetivo:** Solución completa para gestión turística
- **Monetización:** Modelo SaaS para prestadores
- **Diferenciación:** Integración oficial con CONANP
- **Accesibilidad:** Diseño para usuarios mayores
- **Clima:** Manejo de suspensiones por condiciones meteorológicas

---

_Documento creado para mantener contexto del proyecto en futuras sesiones de desarrollo._

---

# 📋 Reglas de Trabajo - Proyecto Isla Lobos

## 🎯 **Principios Fundamentales**

### **1. Tipado Estricto - OBLIGATORIO**

- ❌ **NUNCA usar `any`, `unknown`, `object` genérico**
- ✅ **SIEMPRE usar tipos específicos y bien definidos**
- ✅ **Crear tipos personalizados cuando sea necesario**
- ✅ **Usar interfaces y types de TypeScript apropiadamente**

### **2. Estructura de Tipos**

- 📁 **Ubicación**: Todos los tipos están en `/lib/types/`
- 📄 **Archivos existentes**:
  - `actions.ts` - Tipos para server actions
  - `api.ts` - Tipos para respuestas de API
  - `auth.ts` - Tipos de autenticación
  - `brazaletes.ts` - Tipos del sistema de brazaletes
  - `dashboard.ts` - Tipos del dashboard
  - `embarcacion.ts` - Tipos de embarcaciones
  - `salida.ts` - Tipos de salidas/servicios

### **3. Reglas de Implementación**

#### **A. Server Actions**

```typescript
// ✅ CORRECTO
export async function miFuncion(
  data: MiTipoEspecifico
): Promise<MiRespuestaTipo> {
  // implementación
}

// ❌ INCORRECTO
export async function miFuncion(data: any): Promise<any> {
  // implementación
}
```

#### **B. Componentes React**

```typescript
// ✅ CORRECTO
interface MiComponenteProps {
  salida: Salida;
  onComplete: (id: string) => Promise<void>;
}

export function MiComponente({ salida, onComplete }: MiComponenteProps) {
  // implementación
}

// ❌ INCORRECTO
export function MiComponente(props: any) {
  // implementación
}
```

#### **C. Estados y Hooks**

```typescript
// ✅ CORRECTO
const [salidas, setSalidas] = useState<Salida[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>("");

// ❌ INCORRECTO
const [salidas, setSalidas] = useState<any[]>([]);
const [loading, setLoading] = useState<any>(false);
```

### **4. Manejo de Errores**

```typescript
// ✅ CORRECTO
try {
  const result = await miFuncion();
  if (result.success) {
    // manejar éxito
  } else {
    throw new Error(result.error || "Error desconocido");
  }
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : "Error desconocido";
  setError(errorMessage);
}

// ❌ INCORRECTO
try {
  const result = await miFuncion();
  // manejar sin verificar tipos
} catch (error) {
  setError(error); // error puede ser cualquier cosa
}
```

### **5. Creación de Nuevos Tipos**

#### **Cuando crear un nuevo tipo:**

- ✅ Cuando la API devuelve una estructura nueva
- ✅ Cuando necesitas un tipo para props de componente
- ✅ Cuando manejas datos complejos con múltiples campos
- ✅ Cuando necesitas unión de tipos o tipos condicionales

#### **Dónde crear el tipo:**

- 📄 **Para API**: Agregar en el archivo correspondiente en `/lib/types/`
- 📄 **Para componentes específicos**: Crear interface local en el componente
- 📄 **Para server actions**: Agregar en `actions.ts` si es compartido

#### **Ejemplo de creación de tipo:**

```typescript
// En lib/types/brazaletes.ts
export interface BrazaleteUso {
  id: string;
  codigo: string;
  estado: "disponible" | "asignado" | "utilizado" | "perdido";
  fecha_uso: string | null;
  salida_id: string | null;
  turista_nacionalidad: "local" | "nacional" | "internacional" | null;
  turista_edad: number | null;
}

export interface ActualizarBrazaletesUsoRequest {
  salida_id: string;
  fecha_uso: string; // YYYY-MM-DD
}
```

### **6. Validación de Datos**

```typescript
// ✅ CORRECTO - Validar tipos antes de usar
function procesarSalida(salida: unknown): Salida {
  if (!salida || typeof salida !== "object") {
    throw new Error("Salida inválida");
  }

  const s = salida as Record<string, unknown>;

  if (typeof s.id !== "string" || typeof s.fecha !== "string") {
    throw new Error("Campos requeridos faltantes");
  }

  return salida as Salida;
}

// ❌ INCORRECTO - Asumir tipos
function procesarSalida(salida: any): Salida {
  return salida; // Sin validación
}
```

### **7. Imports y Exports**

```typescript
// ✅ CORRECTO - Imports específicos
import { Salida, EstadoSalida } from "@/lib/types/salida";
import { BrazaleteUso } from "@/lib/types/brazaletes";

// ❌ INCORRECTO - Imports genéricos
import * as types from "@/lib/types";
```

### **8. Documentación de Tipos**

```typescript
/**
 * Representa una salida completada con sus brazaletes utilizados
 */
export interface SalidaCompletada {
  /** ID único de la salida */
  id: string;
  /** Fecha de la salida en formato YYYY-MM-DD */
  fecha: string;
  /** Estado actual de la salida */
  estado: EstadoSalida;
  /** Lista de brazaletes utilizados en esta salida */
  brazaletes_utilizados: BrazaleteUso[];
}
```

### **9. Manejo de Fechas y Timezones (OBLIGATORIO)**

```typescript
// ❌ INCORRECTO
await registrarSalida({
  fecha: new Date(fechaInput).toISOString(), // Envía timestamp, causa problemas
  // ...
});
```

#### **F. Funciones Helper Disponibles**

Todas en `lib/utils.ts`:

```typescript
// Extraer YYYY-MM-DD desde cualquier formato
extraerFechaYYYYMMDD(fecha: Date | string): string

// Obtener fecha actual en YYYY-MM-DD
obtenerFechaActualYYYYMMDD(): string

// Formatear para mostrar al usuario
formatearFechaSalida(fecha: Date | string): string

// Formatear solo si ya tienes YYYY-MM-DD limpio
formatearFechaSinTimezone(fecha: string): string
```

#### **G. Resumen de Convención**

```typescript
// Backend envía y espera:
"fecha": "2025-10-10"  // ✅ Solo YYYY-MM-DD, SIN timestamp

// Frontend trabaja con:
const fecha = extraerFechaYYYYMMDD(dato);  // Siempre string YYYY-MM-DD

// Frontend muestra al usuario:
const fechaLegible = formatearFechaSalida(fecha);  // "jueves, 10 de octubre de 2025"

// Frontend envía al backend:
await api({ fecha: extraerFechaYYYYMMDD(fecha) });  // "2025-10-10"
```

#### **H. Casos de Uso Específicos**

```typescript
// 1. Marcar servicio como completado
const fechaServicio = extraerFechaYYYYMMDD(salida.fecha); // Fecha de la salida
await completarServicio(salida.id, fechaServicio);

// 2. Registrar uso de brazaletes
const fechaUso = extraerFechaYYYYMMDD(salida.fecha); // Fecha de la salida
await marcarBrazaletesUtilizados({
  salida_id: salida.id,
  fecha_uso: fechaUso,
});

// 3. Crear nueva salida
const fechaSeleccionada = extraerFechaYYYYMMDD(inputFecha);
await registrarSalida({
  fecha: fechaSeleccionada,
  // ...
});

// 4. Filtros de fecha
const fechaInicio = obtenerFechaActualYYYYMMDD();
const fechaFin = obtenerFechaActualYYYYMMDD();
await getSalidas({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
```

## 🚨 **Reglas de NO Hacer**

1. ❌ **NUNCA usar `any`**
2. ❌ **NUNCA usar `unknown` sin validación**
3. ❌ **NUNCA usar `object` genérico**
4. ❌ **NUNCA asumir tipos de datos de API**
5. ❌ **NUNCA usar `as any` para evitar errores de tipo**
6. ❌ **NUNCA crear tipos genéricos cuando se necesita específico**

## ✅ **Reglas de SÍ Hacer**

1. ✅ **SIEMPRE crear tipos específicos**
2. ✅ **SIEMPRE validar datos de API**
3. ✅ **SIEMPRE usar interfaces para objetos complejos**
4. ✅ **SIEMPRE documentar tipos complejos**
5. ✅ **SIEMPRE usar tipos de unión para estados**
6. ✅ **SIEMPRE verificar tipos en runtime cuando sea necesario**

## 📝 **Ejemplo Completo de Implementación**

```typescript
// lib/types/brazaletes.ts
export interface ActualizarBrazaletesUsoRequest {
  salida_id: string;
  fecha_uso: string; // YYYY-MM-DD
}

export interface ActualizarBrazaletesUsoResponse {
  success: boolean;
  data?: {
    brazaletes_actualizados: number;
    message: string;
  };
  error?: string;
}

// actions/brazaletes.ts
export async function actualizarBrazaletesUso(
  request: ActualizarBrazaletesUsoRequest
): Promise<ActualizarBrazaletesUsoResponse> {
  try {
    const response = await apiRequest("/brazaletes/uso/actualizar", {
      method: "PUT",
      body: JSON.stringify(request),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// Componente
interface CompletarSalidaProps {
  salida: Salida;
  onComplete: () => Promise<void>;
}

export function CompletarSalidaButton({
  salida,
  onComplete,
}: CompletarSalidaProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleComplete = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const result = await actualizarBrazaletesUso({
        salida_id: salida.id,
        fecha_uso: salida.fecha, // Usar fecha de la salida, no fecha actual
      });

      if (result.success) {
        await onComplete();
      } else {
        throw new Error(result.error || "Error al completar salida");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleComplete} disabled={loading}>
      {loading ? "Completando..." : "Marcar como Completada"}
    </Button>
  );
}
```

### **10. Organización Modular de Componentes (OBLIGATORIO)**

#### **Principios de Co-locación:**

- 📁 **Estructura**: Cada `page.tsx` debe tener su carpeta `components/` en el mismo directorio
- 🎯 **Propósito**: Mantener componentes relacionados cerca de su página principal
- 🔄 **Reutilización**: Componentes específicos de página vs componentes globales

#### **Estructura Estándar:**

```
app/
├── dashboard/
│   ├── page.tsx                    # Página principal (máx. 200 líneas)
│   ├── layout.tsx                  # Layout específico
│   └── components/                 # Componentes específicos del dashboard
│       ├── DashboardHeader.tsx
│       ├── MetricasCard.tsx
│       ├── LoadingState.tsx
│       ├── ErrorAlert.tsx
│       ├── utils.tsx               # Funciones helper específicas
│       └── index.ts                # Exportaciones centralizadas
│
├── dashboard/
│   └── brazaletes/
│       ├── page.tsx                # Página principal (máx. 200 líneas)
│       └── components/             # Componentes específicos de brazaletes
│           ├── BrazaletesHeader.tsx
│           ├── FiltrosLotes.tsx
│           ├── ListaLotes.tsx
│           ├── utils.tsx
│           └── index.ts
```

#### **Reglas de Organización:**

**A. Componentes por Responsabilidad:**

```typescript
// ✅ CORRECTO - Separación clara de responsabilidades
components/
├── Header.tsx           # Header específico de la página
├── Filtros.tsx          # Componente de filtros
├── Lista.tsx            # Lista de elementos
├── Formulario.tsx       # Formularios específicos
├── LoadingState.tsx     # Estados de carga
├── ErrorAlert.tsx       # Manejo de errores
├── EmptyState.tsx       # Estados vacíos
└── utils.tsx            # Funciones helper
```

**B. Servicios Especializados:**

```typescript
// ✅ CORRECTO - Servicios para lógica compleja
components/
├── DataService.tsx      # Carga y manipulación de datos
├── ExportacionService.tsx # Servicios de exportación
├── LocalStorageService.tsx # Manejo de localStorage
└── OperacionesService.tsx # Operaciones masivas
```

**C. Archivo index.ts OBLIGATORIO:**

```typescript
// ✅ CORRECTO - Exportaciones centralizadas
export { Header } from "./Header";
export { Filtros } from "./Filtros";
export { Lista } from "./Lista";
export { LoadingState, AuthLoadingState } from "./LoadingState";
export { ErrorAlert } from "./ErrorAlert";
export { DataService } from "./DataService";
export { helperFunction1, helperFunction2 } from "./utils";
```

#### **D. Simplificación de page.tsx:**

**Antes (❌ INCORRECTO):**

```typescript
// page.tsx - 400+ líneas
export default function MiPage() {
  // 50+ líneas de estados
  // 100+ líneas de funciones
  // 200+ líneas de JSX
  // 50+ líneas de lógica compleja
}
```

**Después (✅ CORRECTO):**

```typescript
// page.tsx - máx. 200 líneas
import { Header, Filtros, Lista, LoadingState, ErrorAlert } from "./components";

export default function MiPage() {
  // Estados principales (máx. 10)
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Funciones principales (máx. 5)
  const loadData = async () => {
    /* lógica simple */
  };
  const handleAction = async () => {
    /* lógica simple */
  };

  // Renderizado con componentes modulares
  return (
    <div className="space-y-6">
      <Header onAction={handleAction} />
      <ErrorAlert error={error} />
      {loading ? <LoadingState /> : <Lista data={data} />}
    </div>
  );
}
```

#### **E. Naming Conventions:**

```typescript
// ✅ CORRECTO - Nombres descriptivos y específicos
components/
├── BrazaletesHeader.tsx        # Header específico de brazaletes
├── FiltrosVentas.tsx          # Filtros específicos de ventas
├── ListaUsuarios.tsx          # Lista específica de usuarios
├── DialogCrearLote.tsx        # Dialog específico para crear lotes
├── EstadisticasVentas.tsx     # Estadísticas específicas de ventas
└── ExportacionService.tsx     # Servicio específico de exportación
```

#### **F. Funciones Utilitarias:**

```typescript
// ✅ CORRECTO - utils.tsx por módulo
// app/dashboard/brazaletes/components/utils.tsx
export function calcularConteos(data: BrazaletesData): Conteos {
  // Lógica específica del módulo
}

export function filtrarBrazaletes(
  brazaletes: Brazalete[],
  filtro: string
): Brazalete[] {
  // Filtrado específico
}

export function getEstadoBadgeClass(estado: string): string {
  // Clases CSS específicas
}
```

#### **G. Métricas de Calidad:**

- ✅ **page.tsx**: Máximo 200 líneas
- ✅ **Componentes**: Máximo 100 líneas cada uno
- ✅ **Servicios**: Máximo 150 líneas cada uno
- ✅ **Reducción mínima**: 50% de líneas del archivo original
- ✅ **Componentes por módulo**: 5-15 componentes
- ✅ **Reutilización**: Componentes específicos vs globales

#### **H. Checklist de Reorganización:**

```markdown
- [ ] Crear carpeta `components/` en el directorio de la página
- [ ] Extraer header/título a componente separado
- [ ] Extraer filtros a componente separado
- [ ] Extraer listas/tablas a componente separado
- [ ] Extraer formularios a componente separado
- [ ] Extraer estados de carga a componente separado
- [ ] Extraer manejo de errores a componente separado
- [ ] Extraer lógica compleja a servicios especializados
- [ ] Crear funciones utilitarias en `utils.tsx`
- [ ] Crear `index.ts` con exportaciones centralizadas
- [ ] Simplificar `page.tsx` a máximo 200 líneas
- [ ] Verificar que no hay tipos `any`, `unknown`, `object`
- [ ] Probar que la funcionalidad sigue igual
- [ ] Hacer commit con mensaje descriptivo
```

#### **I. Ejemplo Completo de Reorganización:**

**Módulo: Dashboard Brazaletes**

- **Antes**: 361 líneas en `page.tsx`
- **Después**: 170 líneas en `page.tsx` + 10 componentes modulares
- **Reducción**: 53%
- **Componentes creados**:
  - `BrazaletesHeader.tsx`
  - `FiltrosLotes.tsx`
  - `ListaLotes.tsx`
  - `AlertasSistema.tsx`
  - `DialogCrearLote.tsx`
  - `LoadingState.tsx`
  - `ErrorAlert.tsx`
  - `ErrorState.tsx`
  - `utils.tsx`
  - `index.ts`

---

# 📋 Reglas de Trabajo - Proyecto Isla Lobos

## 🎯 **Principios Fundamentales**

### **1. Tipado Estricto - OBLIGATORIO**

- ❌ **NUNCA usar `any`, `unknown`, `object` genérico**
- ✅ **SIEMPRE usar tipos específicos y bien definidos**
- ✅ **Crear tipos personalizados cuando sea necesario**
- ✅ **Usar interfaces y types de TypeScript apropiadamente**

### **2. Estructura de Tipos**

- 📁 **Ubicación**: Todos los tipos están en `/lib/types/`
- 📄 **Archivos existentes**:
  - `actions.ts` - Tipos para server actions
  - `api.ts` - Tipos para respuestas de API
  - `auth.ts` - Tipos de autenticación
  - `brazaletes.ts` - Tipos del sistema de brazaletes
  - `dashboard.ts` - Tipos del dashboard
  - `embarcacion.ts` - Tipos de embarcaciones
  - `salida.ts` - Tipos de salidas/servicios

### **3. Reglas de Implementación**

#### **A. Server Actions**

```typescript
// ✅ CORRECTO
export async function miFuncion(
  data: MiTipoEspecifico
): Promise<MiRespuestaTipo> {
  // implementación
}

// ❌ INCORRECTO
export async function miFuncion(data: any): Promise<any> {
  // implementación
}
```

#### **B. Componentes React**

```typescript
// ✅ CORRECTO
interface MiComponenteProps {
  salida: Salida;
  onComplete: (id: string) => Promise<void>;
}

export function MiComponente({ salida, onComplete }: MiComponenteProps) {
  // implementación
}

// ❌ INCORRECTO
export function MiComponente(props: any) {
  // implementación
}
```

#### **C. Estados y Hooks**

```typescript
// ✅ CORRECTO
const [salidas, setSalidas] = useState<Salida[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>("");

// ❌ INCORRECTO
const [salidas, setSalidas] = useState<any[]>([]);
const [loading, setLoading] = useState<any>(false);
```

### **4. Manejo de Errores**

```typescript
// ✅ CORRECTO
try {
  const result = await miFuncion();
  if (result.success) {
    // manejar éxito
  } else {
    throw new Error(result.error || "Error desconocido");
  }
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : "Error desconocido";
  setError(errorMessage);
}

// ❌ INCORRECTO
try {
  const result = await miFuncion();
  // manejar sin verificar tipos
} catch (error) {
  setError(error); // error puede ser cualquier cosa
}
```

### **5. Creación de Nuevos Tipos**

#### **Cuando crear un nuevo tipo:**

- ✅ Cuando la API devuelve una estructura nueva
- ✅ Cuando necesitas un tipo para props de componente
- ✅ Cuando manejas datos complejos con múltiples campos
- ✅ Cuando necesitas unión de tipos o tipos condicionales

#### **Dónde crear el tipo:**

- 📄 **Para API**: Agregar en el archivo correspondiente en `/lib/types/`
- 📄 **Para componentes específicos**: Crear interface local en el componente
- 📄 **Para server actions**: Agregar en `actions.ts` si es compartido

#### **Ejemplo de creación de tipo:**

```typescript
// En lib/types/brazaletes.ts
export interface BrazaleteUso {
  id: string;
  codigo: string;
  estado: "disponible" | "asignado" | "utilizado" | "perdido";
  fecha_uso: string | null;
  salida_id: string | null;
  turista_nacionalidad: "local" | "nacional" | "internacional" | null;
  turista_edad: number | null;
}

export interface ActualizarBrazaletesUsoRequest {
  salida_id: string;
  fecha_uso: string; // YYYY-MM-DD
}
```

### **6. Validación de Datos**

```typescript
// ✅ CORRECTO - Validar tipos antes de usar
function procesarSalida(salida: unknown): Salida {
  if (!salida || typeof salida !== "object") {
    throw new Error("Salida inválida");
  }

  const s = salida as Record<string, unknown>;

  if (typeof s.id !== "string" || typeof s.fecha !== "string") {
    throw new Error("Campos requeridos faltantes");
  }

  return salida as Salida;
}

// ❌ INCORRECTO - Asumir tipos
function procesarSalida(salida: any): Salida {
  return salida; // Sin validación
}
```

### **7. Imports y Exports**

```typescript
// ✅ CORRECTO - Imports específicos
import { Salida, EstadoSalida } from "@/lib/types/salida";
import { BrazaleteUso } from "@/lib/types/brazaletes";

// ❌ INCORRECTO - Imports genéricos
import * as types from "@/lib/types";
```

### **8. Documentación de Tipos**

```typescript
/**
 * Representa una salida completada con sus brazaletes utilizados
 */
export interface SalidaCompletada {
  /** ID único de la salida */
  id: string;
  /** Fecha de la salida en formato YYYY-MM-DD */
  fecha: string;
  /** Estado actual de la salida */
  estado: EstadoSalida;
  /** Lista de brazaletes utilizados en esta salida */
  brazaletes_utilizados: BrazaleteUso[];
}
```

### **9. Manejo de Fechas y Timezones (OBLIGATORIO)**

**CONTEXTO IMPORTANTE**: El sistema Isla Lobos opera en la zona horaria de México (`America/Mexico_City`). El backend devuelve fechas como strings `YYYY-MM-DD` que representan fechas en el contexto mexicano.

#### **A. Arquitectura de Fechas del Sistema**

- **Backend**: Almacena fechas como strings `YYYY-MM-DD` en zona horaria de México
- **Frontend**: Usa funciones especializadas para interpretar fechas regionales
- **Base de Datos**: Solo fechas `YYYY-MM-DD`, sin timestamps para salidas/servicios
- **Cliente**: Las fechas se muestran correctamente independiente de la zona horaria del usuario

#### **B. Funciones Principales - SIEMPRE usar desde `@/lib/utils`**

```typescript
// ✅ IMPORTAR FUNCIONES REGIONALES
import {
  formatearFechaRegional,        // Para mostrar fechas al usuario
  formatearFechaCompacta,        // Para tablas y listas
  obtenerFechaLocalYYYYMMDD,     // Fecha actual del cliente
  obtenerFechaActualMexico,      // Fecha actual en México
  extraerFechaLocalYYYYMMDD,     // Convertir cualquier fecha a YYYY-MM-DD
  interpretarFechaDelBackend,    // Interpretar fechas del backend como Date
  esFechaValidaYYYYMMDD,         // Validar formato YYYY-MM-DD
  compararFechasYYYYMMDD,        // Comparar fechas YYYY-MM-DD
} from "@/lib/utils";
```

#### **C. Mostrar Fechas al Usuario**

```typescript
// ✅ CORRECTO - Función regional principal
const fechaLegible = formatearFechaRegional(salida.fecha);
// Output: "jueves, 10 de octubre de 2025"

// ✅ CORRECTO - Para tablas/listas (formato compacto)
const fechaCorta = formatearFechaCompacta(salida.fecha);
// Output: "10 oct 2025"

// ✅ CORRECTO - Interpretar fecha del backend como Date object
const fechaDate = interpretarFechaDelBackend(salida.fecha);
// Para usar con librerías que requieren Date objects
```

```typescript
// ❌ INCORRECTO - Funciones deprecadas
const fechaLegible = formatearFechaSalida(salida.fecha); // ⚠️ Deprecated
const fechaLegible = formatearFechaSinTimezone(salida.fecha); // ⚠️ Deprecated
new Date(salida.fecha).toLocaleDateString("es-MX"); // ❌ Problemas de timezone
```

#### **D. Obtener Fechas Actuales**

```typescript
// ✅ CORRECTO - Fecha actual del cliente (para inputs de usuario)
const fechaHoy = obtenerFechaLocalYYYYMMDD();
// Output: "2025-10-17" (según zona horaria del cliente)

// ✅ CORRECTO - Fecha actual en México (para lógica de negocio)
const fechaMexico = obtenerFechaActualMexico();
// Output: "2025-10-17" (siempre en zona horaria de México)
```

```typescript
// ❌ INCORRECTO - Funciones deprecadas o problemáticas
const fechaHoy = obtenerFechaActualYYYYMMDD(); // ⚠️ Deprecated
const fecha = new Date().toISOString().split("T")[0]; // ❌ Problemas de timezone
```

#### **E. Convertir y Extraer Fechas**

```typescript
// ✅ CORRECTO - Convertir cualquier fecha a YYYY-MM-DD
const fechaString = extraerFechaLocalYYYYMMDD(inputFecha);
// Input: Date object, "2025-10-10", "2025-10-10T06:00:00.000Z"
// Output: "2025-10-10" (siempre string YYYY-MM-DD)

// ✅ CORRECTO - Para inputs de usuario (fechas del cliente)
const fechaUsuario = extraerFechaLocalYYYYMMDD(fechaSeleccionada);
```

```typescript
// ❌ INCORRECTO - Función deprecated
const fechaString = extraerFechaYYYYMMDD(inputFecha); // ⚠️ Usar extraerFechaLocalYYYYMMDD
```

#### **F. Validación de Fechas**

```typescript
// ✅ CORRECTO - Validar formato y contenido
if (esFechaValidaYYYYMMDD(fechaInput)) {
  // La fecha tiene formato YYYY-MM-DD y es válida
  const fechaFormateada = formatearFechaRegional(fechaInput);
}

// ✅ CORRECTO - Comparar fechas
const resultado = compararFechasYYYYMMDD(fecha1, fecha2);
// Returns: -1 (fecha1 < fecha2), 0 (iguales), 1 (fecha1 > fecha2)
```

#### **G. Enviar Fechas al Backend**

```typescript
// ✅ CORRECTO - Enviar string YYYY-MM-DD
await registrarSalida({
  fecha: extraerFechaLocalYYYYMMDD(fechaSeleccionada),
  // ...
});

// ✅ CORRECTO - Usar fecha de la salida (no fecha actual)
await completarServicio(
  salidaId,
  extraerFechaLocalYYYYMMDD(salida.fecha)
);

// ✅ CORRECTO - Registrar uso de brazaletes
await marcarBrazaletesUtilizados({
  salida_id: salida.id,
  fecha_uso: extraerFechaLocalYYYYMMDD(salida.fecha), // Fecha de la salida
});
```

#### **H. Patrones de Uso por Contexto**

**Para mostrar al usuario:**
```typescript
const fechaParaUsuario = formatearFechaRegional(salida.fecha);
```

**Para tablas/listas:**
```typescript
const fechaCompacta = formatearFechaCompacta(salida.fecha);
```

**Para inputs de fecha:**
```typescript
const fechaPorDefecto = obtenerFechaLocalYYYYMMDD();
```

**Para enviar al backend:**
```typescript
const fechaParaBackend = extraerFechaLocalYYYYMMDD(fechaSeleccionada);
```

**Para lógica con Date objects:**
```typescript
const fechaDate = interpretarFechaDelBackend(salida.fecha);
// Usar con librerías que requieren Date (ej: date-fns, moment)
```

#### **I. Funciones Deprecadas - NO USAR**

```typescript
// ❌ ESTAS FUNCIONES ESTÁN DEPRECADAS - NO USAR
formatearFechaSalida()           // Usar formatearFechaRegional()
formatearFechaSinTimezone()      // Usar formatearFechaRegional()
obtenerFechaActualYYYYMMDD()     // Usar obtenerFechaLocalYYYYMMDD()
extraerFechaYYYYMMDD()           // Usar extraerFechaLocalYYYYMMDD()
```

#### **J. Casos de Uso Específicos del Sistema**

```typescript
// 1. Crear nueva salida
const fechaSeleccionada = extraerFechaLocalYYYYMMDD(inputFecha);
await registrarSalida({
  fecha: fechaSeleccionada,
  bloque_id: bloqueId,
  // ...
});

// 2. Marcar servicio como completado
const fechaServicio = extraerFechaLocalYYYYMMDD(salida.fecha);
await completarServicio(salida.id, fechaServicio);

// 3. Registrar uso de brazaletes (usar fecha de la salida)
const fechaUso = extraerFechaLocalYYYYMMDD(salida.fecha);
await marcarBrazaletesUtilizados({
  salida_id: salida.id,
  fecha_uso: fechaUso, // Fecha de la salida, NO fecha actual
});

// 4. Filtros de fechas
const fechaInicio = obtenerFechaLocalYYYYMMDD();
const fechaFin = obtenerFechaLocalYYYYMMDD();
await getSalidas({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });

// 5. Obtener bloques para fecha específica
const fechaConsulta = extraerFechaLocalYYYYMMDD(fechaSeleccionada);
const bloques = await getBloques({ fecha: fechaConsulta });
```

#### **K. Debugging y Logs**

```typescript
// ✅ CORRECTO - Logging para debugging
clientLogger.info('Fecha procesada:', {
  original: inputFecha,
  procesada: extraerFechaLocalYYYYMMDD(inputFecha),
  mostrarUsuario: formatearFechaRegional(extraerFechaLocalYYYYMMDD(inputFecha))
});
```

## 🚨 **Reglas de NO Hacer**

1. ❌ **NUNCA usar `any`**
2. ❌ **NUNCA usar `unknown` sin validación**
3. ❌ **NUNCA usar `object` genérico**
4. ❌ **NUNCA asumir tipos de datos de API**
5. ❌ **NUNCA usar `as any` para evitar errores de tipo**
6. ❌ **NUNCA crear tipos genéricos cuando se necesita específico**

## ✅ **Reglas de SÍ Hacer**

1. ✅ **SIEMPRE crear tipos específicos**
2. ✅ **SIEMPRE validar datos de API**
3. ✅ **SIEMPRE usar interfaces para objetos complejos**
4. ✅ **SIEMPRE documentar tipos complejos**
5. ✅ **SIEMPRE usar tipos de unión para estados**
6. ✅ **SIEMPRE verificar tipos en runtime cuando sea necesario**

## 📝 **Ejemplo Completo de Implementación**

```typescript
// lib/types/brazaletes.ts
export interface ActualizarBrazaletesUsoRequest {
  salida_id: string;
  fecha_uso: string; // YYYY-MM-DD
}

export interface ActualizarBrazaletesUsoResponse {
  success: boolean;
  data?: {
    brazaletes_actualizados: number;
    message: string;
  };
  error?: string;
}

// actions/brazaletes.ts
export async function actualizarBrazaletesUso(
  request: ActualizarBrazaletesUsoRequest
): Promise<ActualizarBrazaletesUsoResponse> {
  try {
    const response = await apiRequest("/brazaletes/uso/actualizar", {
      method: "PUT",
      body: JSON.stringify(request),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// Componente
interface CompletarSalidaProps {
  salida: Salida;
  onComplete: () => Promise<void>;
}

export function CompletarSalidaButton({
  salida,
  onComplete,
}: CompletarSalidaProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleComplete = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const result = await actualizarBrazaletesUso({
        salida_id: salida.id,
        fecha_uso: salida.fecha, // Usar fecha de la salida, no fecha actual
      });

      if (result.success) {
        await onComplete();
      } else {
        throw new Error(result.error || "Error al completar salida");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleComplete} disabled={loading}>
      {loading ? "Completando..." : "Marcar como Completada"}
    </Button>
  );
}
```

### **10. Organización Modular de Componentes (OBLIGATORIO)**

#### **Principios de Co-locación:**

- 📁 **Estructura**: Cada `page.tsx` debe tener su carpeta `components/` en el mismo directorio
- 🎯 **Propósito**: Mantener componentes relacionados cerca de su página principal
- 🔄 **Reutilización**: Componentes específicos de página vs componentes globales

#### **Estructura Estándar:**

```
app/
├── dashboard/
│   ├── page.tsx                    # Página principal (máx. 200 líneas)
│   ├── layout.tsx                  # Layout específico
│   └── components/                 # Componentes específicos del dashboard
│       ├── DashboardHeader.tsx
│       ├── MetricasCard.tsx
│       ├── LoadingState.tsx
│       ├── ErrorAlert.tsx
│       ├── utils.tsx               # Funciones helper específicas
│       └── index.ts                # Exportaciones centralizadas
│
├── dashboard/
│   └── brazaletes/
│       ├── page.tsx                # Página principal (máx. 200 líneas)
│       └── components/             # Componentes específicos de brazaletes
│           ├── BrazaletesHeader.tsx
│           ├── FiltrosLotes.tsx
│           ├── ListaLotes.tsx
│           ├── utils.tsx
│           └── index.ts
```

#### **Reglas de Organización:**

**A. Componentes por Responsabilidad:**

```typescript
// ✅ CORRECTO - Separación clara de responsabilidades
components/
├── Header.tsx           # Header específico de la página
├── Filtros.tsx          # Componente de filtros
├── Lista.tsx            # Lista de elementos
├── Formulario.tsx       # Formularios específicos
├── LoadingState.tsx     # Estados de carga
├── ErrorAlert.tsx       # Manejo de errores
├── EmptyState.tsx       # Estados vacíos
└── utils.tsx            # Funciones helper
```

**B. Servicios Especializados:**

```typescript
// ✅ CORRECTO - Servicios para lógica compleja
components/
├── DataService.tsx      # Carga y manipulación de datos
├── ExportacionService.tsx # Servicios de exportación
├── LocalStorageService.tsx # Manejo de localStorage
└── OperacionesService.tsx # Operaciones masivas
```

**C. Archivo index.ts OBLIGATORIO:**

```typescript
// ✅ CORRECTO - Exportaciones centralizadas
export { Header } from "./Header";
export { Filtros } from "./Filtros";
export { Lista } from "./Lista";
export { LoadingState, AuthLoadingState } from "./LoadingState";
export { ErrorAlert } from "./ErrorAlert";
export { DataService } from "./DataService";
export { helperFunction1, helperFunction2 } from "./utils";
```

#### **D. Simplificación de page.tsx:**

**Antes (❌ INCORRECTO):**

```typescript
// page.tsx - 400+ líneas
export default function MiPage() {
  // 50+ líneas de estados
  // 100+ líneas de funciones
  // 200+ líneas de JSX
  // 50+ líneas de lógica compleja
}
```

**Después (✅ CORRECTO):**

```typescript
// page.tsx - máx. 200 líneas
import { Header, Filtros, Lista, LoadingState, ErrorAlert } from "./components";

export default function MiPage() {
  // Estados principales (máx. 10)
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Funciones principales (máx. 5)
  const loadData = async () => {
    /* lógica simple */
  };
  const handleAction = async () => {
    /* lógica simple */
  };

  // Renderizado con componentes modulares
  return (
    <div className="space-y-6">
      <Header onAction={handleAction} />
      <ErrorAlert error={error} />
      {loading ? <LoadingState /> : <Lista data={data} />}
    </div>
  );
}
```

#### **E. Naming Conventions:**

```typescript
// ✅ CORRECTO - Nombres descriptivos y específicos
components/
├── BrazaletesHeader.tsx        # Header específico de brazaletes
├── FiltrosVentas.tsx          # Filtros específicos de ventas
├── ListaUsuarios.tsx          # Lista específica de usuarios
├── DialogCrearLote.tsx        # Dialog específico para crear lotes
├── EstadisticasVentas.tsx     # Estadísticas específicas de ventas
└── ExportacionService.tsx     # Servicio específico de exportación
```

#### **F. Funciones Utilitarias:**

```typescript
// ✅ CORRECTO - utils.tsx por módulo
// app/dashboard/brazaletes/components/utils.tsx
export function calcularConteos(data: BrazaletesData): Conteos {
  // Lógica específica del módulo
}

export function filtrarBrazaletes(
  brazaletes: Brazalete[],
  filtro: string
): Brazalete[] {
  // Filtrado específico
}

export function getEstadoBadgeClass(estado: string): string {
  // Clases CSS específicas
}
```

#### **G. Métricas de Calidad:**

- ✅ **page.tsx**: Máximo 200 líneas
- ✅ **Componentes**: Máximo 100 líneas cada uno
- ✅ **Servicios**: Máximo 150 líneas cada uno
- ✅ **Reducción mínima**: 50% de líneas del archivo original
- ✅ **Componentes por módulo**: 5-15 componentes
- ✅ **Reutilización**: Componentes específicos vs globales

#### **H. Checklist de Reorganización:**

```markdown
- [ ] Crear carpeta `components/` en el directorio de la página
- [ ] Extraer header/título a componente separado
- [ ] Extraer filtros a componente separado
- [ ] Extraer listas/tablas a componente separado
- [ ] Extraer formularios a componente separado
- [ ] Extraer estados de carga a componente separado
- [ ] Extraer manejo de errores a componente separado
- [ ] Extraer lógica compleja a servicios especializados
- [ ] Crear funciones utilitarias en `utils.tsx`
- [ ] Crear `index.ts` con exportaciones centralizadas
- [ ] Simplificar `page.tsx` a máximo 200 líneas
- [ ] Verificar que no hay tipos `any`, `unknown`, `object`
- [ ] Probar que la funcionalidad sigue igual
- [ ] Hacer commit con mensaje descriptivo
```

#### **I. Ejemplo Completo de Reorganización:**

**Módulo: Dashboard Brazaletes**

- **Antes**: 361 líneas en `page.tsx`
- **Después**: 170 líneas en `page.tsx` + 10 componentes modulares
- **Reducción**: 53%
- **Componentes creados**:
  - `BrazaletesHeader.tsx`
  - `FiltrosLotes.tsx`
  - `ListaLotes.tsx`
  - `AlertasSistema.tsx`
  - `DialogCrearLote.tsx`
  - `LoadingState.tsx`
  - `ErrorAlert.tsx`
  - `ErrorState.tsx`
  - `utils.tsx`
  - `index.ts`

---

# 🚀 API Routes Reference - Isla Lobos Backend

## 📋 Información General

- **URL Base**: `http://localhost:3001/api`
- **Autenticación**: JWT Bearer Token
- **Content-Type**: `application/json`
- **Total de Endpoints**: 99
- **Zona Horaria**: `America/Mexico_City`
- **Integración Externa**: SMN-CONAGUA (Servicio Meteorológico Nacional) + Twilio WhatsApp API + Nodemailer SMTP + Cloudinary

---

## 🔐 Autenticación (`/api/auth`)

**Nota:** Los endpoints de recuperación de contraseña (`forgot-password` y `reset-password`) son públicos y no requieren autenticación.

### 1. Login

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "admin@conanp.gob.mx",
  "password": "Admin123!"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Admin CONANP",
      "email": "admin@conanp.gob.mx",
      "telefono": "+52 229 123 4567",
      "rol": "conanp",
      "activo": true,
      "fechaVencimientoPermiso": null,
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "ultimaNotificacion": null,
      "motivoSuspension": null,
      "createdAt": "2025-09-26T03:11:54.535Z",
      "updatedAt": "2025-09-26T03:11:54.535Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Respuesta de Error (401):**

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

### 2. Registro

```http
POST /api/auth/register
```

**Body:**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "Password123!",
  "telefono": "2291234567",
  "codigo_invitacion": "PRESTADOR001"
}
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "2291234567",
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2026-09-26T00:00:00.000Z",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "ultimaNotificacion": null,
      "motivoSuspension": null,
      "createdAt": "2025-09-26T03:11:54.535Z",
      "updatedAt": "2025-09-26T03:11:54.535Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Verificar Token

```http
GET /api/auth/verify
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Token válido",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "2291234567",
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2026-09-26T00:00:00.000Z",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "createdAt": "2025-09-26T03:11:54.535Z",
      "updatedAt": "2025-09-26T03:11:54.535Z"
    }
  }
}
```

### 4. Refrescar Token

```http
POST /api/auth/refresh
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Token refrescado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 5. Cerrar Sesión

```http
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Sesión cerrada exitosamente"
}
```

### 6. Solicitar Recuperación de Contraseña

```http
POST /api/auth/forgot-password
```

**Body:**

```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Si el email existe en nuestro sistema, recibirás un enlace para recuperar tu contraseña"
}
```

### 7. Resetear Contraseña

```http
POST /api/auth/reset-password
```

**Body:**

```json
{
  "token": "abc123def456...",
  "newPassword": "NuevaPassword123!",
  "confirmPassword": "NuevaPassword123!"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña"
}
```

### 8. Cambiar Contraseña

```http
PUT /api/auth/change-password
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Contraseña actualizada exitosamente"
}
```

### 9. Obtener Perfil

```http
GET /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Perfil obtenido exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "2291234567",
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2026-09-26T00:00:00.000Z",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "createdAt": "2025-09-26T03:11:54.535Z",
      "updatedAt": "2025-09-26T03:11:54.535Z"
    }
  }
}
```

---

## 👥 Usuarios (`/api/usuarios`)

> **Nota:** Todas las rutas requieren autenticación. Las rutas marcadas con 🔒 requieren rol CONANP.

### 1. Listar Usuarios 🔒

```http
GET /api/usuarios?page=1&limit=10&rol=prestador&activo=true
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Usuarios obtenidos exitosamente",
  "data": {
    "users": [
      {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan.perez@ejemplo.com",
        "telefono": "+52 229 123 4567",
        "rol": "prestador",
        "activo": true,
        "fechaVencimientoPermiso": "2026-09-26T00:00:00.000Z",
        "estadoPermiso": "vigente",
        "diasNotificacion": 30,
        "ultimaNotificacion": null,
        "motivoSuspension": null,
        "createdAt": "2025-09-26T03:11:54.764Z",
        "updatedAt": "2025-09-26T03:11:54.764Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### 2. Obtener Usuario por ID 🔒

```http
GET /api/usuarios/:userId
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Usuario obtenido exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan.perez@ejemplo.com",
      "telefono": "+52 229 123 4567",
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2026-09-26T00:00:00.000Z",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "createdAt": "2025-09-26T03:11:54.764Z",
      "updatedAt": "2025-09-26T03:11:54.764Z"
    }
  }
}
```

### 3. Crear Usuario 🔒

```http
POST /api/usuarios
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "telefono": "2291234567",
  "password": "Password123!",
  "rol": "prestador",
  "activo": true
}
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Usuario creado exitosamente",
  "data": {
    "user": {
      "id": "nuevo-uuid",
      "nombre": "Nuevo Usuario",
      "email": "nuevo@ejemplo.com",
      "telefono": "2291234567",
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2026-09-26T00:00:00.000Z",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "createdAt": "2025-09-26T03:11:54.764Z",
      "updatedAt": "2025-09-26T03:11:54.764Z"
    }
  }
}
```

### 4. Actualizar Usuario 🔒

```http
PUT /api/usuarios/:userId
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "nombre": "Nombre Actualizado",
  "telefono": "2299876543",
  "activo": false
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Usuario actualizado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Nombre Actualizado",
      "email": "usuario@ejemplo.com",
      "telefono": "2299876543",
      "rol": "prestador",
      "activo": false,
      "createdAt": "2025-09-26T03:11:54.764Z",
      "updatedAt": "2025-09-26T03:11:54.764Z"
    }
  }
}
```

### 5. Eliminar Usuario (Soft Delete) 🔒

```http
DELETE /api/usuarios/:userId
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Usuario desactivado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Usuario",
      "email": "usuario@ejemplo.com",
      "telefono": "2291234567",
      "rol": "prestador",
      "activo": false,
      "createdAt": "2025-09-26T03:11:54.764Z",
      "updatedAt": "2025-09-26T03:11:54.764Z"
    }
  }
}
```

### 6. Activar Usuario 🔒

```http
PATCH /api/usuarios/:userId/activate
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Usuario activado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Usuario",
      "email": "usuario@ejemplo.com",
      "telefono": "2291234567",
      "rol": "prestador",
      "activo": true,
      "createdAt": "2025-09-26T03:11:54.764Z",
      "updatedAt": "2025-09-26T03:11:54.764Z"
    }
  }
}
```

### 7. Actualizar Perfil Personal

```http
PUT /api/usuarios/profile/update
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "nombre": "Mi Nombre Actualizado",
  "telefono": "2291234567"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Mi Nombre Actualizado",
      "email": "usuario@ejemplo.com",
      "telefono": "2291234567",
      "rol": "prestador",
      "activo": true,
      "createdAt": "2025-09-26T03:11:54.764Z",
      "updatedAt": "2025-09-26T03:11:54.764Z"
    }
  }
}
```

### 8. Estadísticas de Usuarios 🔒

```http
GET /api/usuarios/stats
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "stats": {
      "total": 15,
      "activos": 12,
      "inactivos": 3,
      "conanp": 2,
      "prestadores": 13,
      "por_estado_permiso": {
        "vigente": 10,
        "por_vencer": 2,
        "vencido": 1,
        "suspendido": 0
      }
    }
  }
}
```

---

## ⏰ Bloques (`/api/bloques`)

> **Nota:** Todas las rutas requieren autenticación. Las rutas marcadas con 🔒 requieren rol CONANP.

### 1. Obtener Bloques para Fecha Específica

```http
GET /api/bloques?fecha=2025-10-15
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Obtiene los bloques disponibles para una fecha específica. Si no existen bloques para esa fecha, los crea automáticamente basándose en las plantillas predefinidas. Calcula la capacidad en tiempo real.

**Parámetros de Query:**

- `fecha` (requerido): Fecha para obtener bloques (formato: YYYY-MM-DD)
  - **Límite**: Máximo 7 días en el futuro
  - **Validación**: No puede ser una fecha pasada

**Funcionalidad Automática:**

- ✅ **Creación Automática**: Si no existen bloques para la fecha, los crea automáticamente
- ✅ **Cálculo de Capacidad**: Calcula `capacidad_registrada` y `capacidad_disponible` en tiempo real
- ✅ **Estados Dinámicos**: Determina si el bloque está `activo` o `lleno` según la ocupación
- ✅ **Validación de Fechas**: Limita la consulta a máximo 7 días en el futuro
- ✅ **Embarcaciones Ocupadas por Bloque**: Incluye información de embarcaciones del prestador autenticado que ya tienen salidas programadas en cada bloque específico

**Información de Embarcaciones por Bloque:**

Cada bloque ahora incluye un array `embarcaciones_ocupadas` que contiene:

- **Información básica**: `id`, `nombre`, `tipo`, `capacidad`, `estado`
- **Detalle de salida**: `salida` (object) - información completa de la salida programada
  - `id`, `estado`, `numero_pasajeros`, `destino`, `observaciones`

**Uso en Frontend:**

```javascript
// Obtener embarcaciones ocupadas en un bloque específico
const bloqueSeleccionado = response.data.bloques.find(
  (bloque) => bloque.id === bloqueId
);
const embarcacionesOcupadas = bloqueSeleccionado.embarcaciones_ocupadas;

// Filtrar embarcaciones disponibles (las que NO están en embarcaciones_ocupadas)
const todasLasEmbarcaciones = await obtenerEmbarcacionesDelPrestador();
const idsOcupadas = embarcacionesOcupadas.map((emb) => emb.id);
const embarcacionesDisponibles = todasLasEmbarcaciones.filter(
  (emb) => !idsOcupadas.includes(emb.id)
);

// Mostrar solo embarcaciones disponibles para este bloque
const opcionesEmbarcaciones = embarcacionesDisponibles.map((emb) => ({
  value: emb.id,
  label: `${emb.nombre} (${emb.capacidad} pasajeros)`,
}));
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Bloques obtenidos exitosamente",
  "data": {
    "bloques": [
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "nombre": "Bloque Matutino",
        "hora_inicio": "08:00:00",
        "hora_fin": "10:00:00",
        "capacidad_total": 65,
        "capacidad_registrada": 45,
        "capacidad_disponible": 20,
        "estado": "activo",
        "fecha": "2025-10-15",
        "embarcaciones_ocupadas": [
          {
            "id": "uuid-embarcacion-2",
            "nombre": "Lancha Azul",
            "tipo": "menor",
            "capacidad": 25,
            "estado": "disponible",
            "salida": {
              "id": "uuid-salida",
              "estado": "programada",
              "numero_pasajeros": 20,
              "destino": "Isla de Lobos",
              "observaciones": "Salida matutina programada"
            }
          }
        ]
      },
      {
        "id": "22222222-2222-2222-2222-222222222222",
        "nombre": "Bloque Mediodía",
        "hora_inicio": "11:00:00",
        "hora_fin": "13:00:00",
        "capacidad_total": 65,
        "capacidad_registrada": 65,
        "capacidad_disponible": 0,
        "estado": "lleno",
        "fecha": "2025-10-15",
        "embarcaciones_ocupadas": []
      },
      {
        "id": "33333333-3333-3333-3333-333333333333",
        "nombre": "Bloque Vespertino",
        "hora_inicio": "14:00:00",
        "hora_fin": "16:00:00",
        "capacidad_total": 65,
        "capacidad_registrada": 0,
        "capacidad_disponible": 65,
        "estado": "activo",
        "fecha": "2025-10-15",
        "embarcaciones_ocupadas": []
      }
    ]
  }
}
```

**Estados de Bloques:**

- `activo`: Bloque disponible con cupos
- `lleno`: Bloque sin cupos disponibles
- `suspendido_por_clima`: Cerrado por condiciones meteorológicas
- `cerrado_capitaria`: Cerrado por capitanía de puerto
- `plantilla`: Bloque predefinido (solo visible sin fecha)

**Errores Comunes:**

```json
// Error: Fecha requerida
{
  "status": "error",
  "message": "El parámetro fecha es requerido",
  "error": "FECHA_REQUERIDA"
}

// Error: Fecha en el pasado
{
  "status": "error",
  "message": "No se pueden consultar bloques para fechas pasadas",
  "error": "FECHA_PASADA"
}

// Error: Fecha muy futura
{
  "status": "error",
  "message": "No se pueden consultar bloques para más de 7 días en el futuro",
  "error": "FECHA_MUY_FUTURA"
}
```

**Ejemplos de Uso:**

```http
# Obtener bloques para mañana
GET /api/bloques?fecha=2025-10-16

# Obtener bloques para 7 días (máximo permitido)
GET /api/bloques?fecha=2025-10-22

# Obtener bloques para hoy
GET /api/bloques?fecha=2025-10-15
```

### 2. Obtener Bloque por ID

```http
GET /api/bloques/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Bloque obtenido exitosamente",
  "data": {
    "bloque": {
      "id": "uuid",
      "nombre": "Bloque Matutino",
      "hora_inicio": "08:00:00",
      "hora_fin": "10:00:00",
      "capacidad_total": 65,
      "capacidad_registrada": 45,
      "estado": "activo",
      "fecha": "2025-09-26",
      "createdAt": "2025-09-26T16:31:51.205Z",
      "updatedAt": "2025-09-26T16:31:51.205Z"
    }
  }
}
```

### 3. Crear Bloque 🔒

```http
POST /api/bloques
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "nombre": "Bloque de Prueba",
  "hora_inicio": "15:00",
  "hora_fin": "17:00",
  "capacidad_total": 50,
  "fecha": "2025-12-30",
  "estado": "activo"
}
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Bloque creado exitosamente",
  "data": {
    "bloque": {
      "id": "uuid",
      "nombre": "Bloque de Prueba",
      "hora_inicio": "15:00:00",
      "hora_fin": "17:00:00",
      "capacidad_total": 50,
      "capacidad_registrada": 0,
      "estado": "activo",
      "fecha": "2025-12-30",
      "createdAt": "2025-09-26T16:53:03.562Z",
      "updatedAt": "2025-09-26T16:53:03.562Z"
    }
  }
}
```

### 4. Actualizar Bloque 🔒

```http
PUT /api/bloques/:id
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "nombre": "Bloque Actualizado",
  "capacidad_total": 60,
  "estado": "lleno"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Bloque actualizado exitosamente",
  "data": {
    "bloque": {
      "id": "uuid",
      "nombre": "Bloque Actualizado",
      "hora_inicio": "15:00:00",
      "hora_fin": "17:00:00",
      "capacidad_total": 60,
      "capacidad_registrada": 0,
      "estado": "lleno",
      "fecha": "2025-12-30",
      "createdAt": "2025-09-26T16:53:03.562Z",
      "updatedAt": "2025-09-26T16:53:03.562Z"
    }
  }
}
```

### 5. Eliminar Bloque 🔒

```http
DELETE /api/bloques/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Bloque eliminado exitosamente"
}
```

### 6. Cerrar Bloque Temporalmente 🔒

```http
POST /api/bloques/cerrar
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Permite a CONANP cerrar un bloque para una fecha específica por motivos como clima o capitanía.

**Body:**

```json
{
  "bloque_id": "11111111-1111-1111-1111-111111111111",
  "fecha": "2025-10-15",
  "motivo": "suspendido_por_clima",
  "observaciones": "Oleaje alto y vientos fuertes"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Bloque cerrado exitosamente",
  "data": {
    "cierre": {
      "id": "uuid",
      "bloque_plantilla_id": "11111111-1111-1111-1111-111111111111",
      "fecha": "2025-10-15",
      "motivo": "suspendido_por_clima",
      "observaciones": "Oleaje alto y vientos fuertes",
      "activo": true,
      "creado_por": "uuid-conanp",
      "created_at": "2025-10-15T08:00:00.000Z"
    }
  }
}
```

### 7. Reabrir Bloque 🔒

```http
POST /api/bloques/abrir
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Permite a CONANP reabrir un bloque previamente cerrado.

**Body:**

```json
{
  "bloque_id": "11111111-1111-1111-1111-111111111111",
  "fecha": "2025-10-15"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Bloque reabierto exitosamente"
}
```

### 8. Estadísticas de Bloques 🔒

```http
GET /api/bloques/estadisticas?fecha_inicio=2025-09-01&fecha_fin=2025-09-30
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "estadisticas": {
      "total_bloques": 22,
      "por_estado": {
        "activo": 15,
        "lleno": 1,
        "suspendido_por_clima": 3,
        "cerrado_capitaria": 3
      },
      "capacidad": {
        "total": 1415,
        "ocupada": 130,
        "disponible": 1285,
        "porcentaje_ocupacion": 9
      },
      "periodo": {
        "fecha_inicio": "2025-09-01T00:00:00.000Z",
        "fecha_fin": "2025-09-30T23:59:59.999Z"
      }
    }
  }
}
```

---

## 🚢 Embarcaciones (`/api/embarcaciones`)

> **Nota:** Todas las rutas requieren autenticación. Las rutas marcadas con 🔒 requieren rol CONANP.

### 1. Listar Embarcaciones

```http
GET /api/embarcaciones?page=1&limit=10&estado=disponible&tipo=menor
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Embarcaciones obtenidas exitosamente",
  "data": {
    "embarcaciones": [
      {
        "id": "b5c54240-b74e-4ff8-9bb5-95804521fbb4",
        "nombre": "Isla Dorada",
        "matricula": "VER-002-DEF",
        "capacidad": 40,
        "tipo": "mayor",
        "estado": "disponible",
        "prestador_id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
        "createdAt": "2025-09-26T16:31:48.340Z",
        "updatedAt": "2025-09-26T16:31:48.340Z",
        "prestador": {
          "id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
          "nombre": "Juan Pérez",
          "email": "juan.perez@ejemplo.com",
          "telefono": "+52 229 123 4567"
        }
      }
    ],
    "estadisticas": {
      "total": 6,
      "disponibles": 4,
      "en_uso": 1,
      "mantenimiento": 1,
      "menor": 4,
      "mayor": 2
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 6,
      "totalPages": 1
    }
  }
}
```

### 2. Obtener Embarcación por ID

```http
GET /api/embarcaciones/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Embarcación obtenida exitosamente",
  "data": {
    "embarcacion": {
      "id": "b5c54240-b74e-4ff8-9bb5-95804521fbb4",
      "nombre": "Isla Dorada",
      "matricula": "VER-002-DEF",
      "capacidad": 40,
      "tipo": "mayor",
      "estado": "disponible",
      "prestador_id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
      "createdAt": "2025-09-26T16:31:48.340Z",
      "updatedAt": "2025-09-26T16:31:48.340Z",
      "prestador": {
        "id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
        "nombre": "Juan Pérez",
        "email": "juan.perez@ejemplo.com",
        "telefono": "+52 229 123 4567"
      }
    }
  }
}
```

### 3. Crear Embarcación

```http
POST /api/embarcaciones
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "nombre": "Nueva Embarcacion",
  "matricula": "VER-007-ABC",
  "capacidad": 30,
  "tipo": "menor",
  "estado": "disponible",
  "prestador_id": "6352b123-ad6d-4c89-a6d5-de53220f1233"
}
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Embarcación creada exitosamente",
  "data": {
    "embarcacion": {
      "id": "c6790ee5-530f-4605-9035-3ba12acede3e",
      "nombre": "Nueva Embarcacion",
      "matricula": "VER-007-ABC",
      "capacidad": 30,
      "tipo": "menor",
      "estado": "disponible",
      "prestador_id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
      "createdAt": "2025-09-26T17:10:48.238Z",
      "updatedAt": "2025-09-26T17:10:48.238Z",
      "prestador": {
        "id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
        "nombre": "Juan Pérez",
        "email": "juan.perez@ejemplo.com",
        "telefono": "+52 229 123 4567"
      }
    }
  }
}
```

### 4. Actualizar Embarcación

```http
PUT /api/embarcaciones/:id
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "nombre": "Embarcacion Actualizada",
  "capacidad": 35,
  "estado": "en_uso"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Embarcación actualizada exitosamente",
  "data": {
    "embarcacion": {
      "id": "c6790ee5-530f-4605-9035-3ba12acede3e",
      "nombre": "Embarcacion Actualizada",
      "matricula": "VER-007-ABC",
      "capacidad": 35,
      "tipo": "menor",
      "estado": "en_uso",
      "prestador_id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
      "createdAt": "2025-09-26T17:10:48.238Z",
      "updatedAt": "2025-09-26T17:15:30.123Z",
      "prestador": {
        "id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
        "nombre": "Juan Pérez",
        "email": "juan.perez@ejemplo.com",
        "telefono": "+52 229 123 4567"
      }
    }
  }
}
```

### 5. Eliminar Embarcación

```http
DELETE /api/embarcaciones/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Embarcación eliminada exitosamente"
}
```

### 6. Mis Embarcaciones

```http
GET /api/embarcaciones/mis-embarcaciones?page=1&limit=10
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Mis embarcaciones obtenidas exitosamente",
  "data": {
    "embarcaciones": [
      {
        "id": "b5c54240-b74e-4ff8-9bb5-95804521fbb4",
        "nombre": "Isla Dorada",
        "matricula": "VER-002-DEF",
        "capacidad": 40,
        "tipo": "mayor",
        "estado": "disponible",
        "prestador_id": "6352b123-ad6d-4c89-a6d5-de53220f1233",
        "createdAt": "2025-09-26T16:31:48.340Z",
        "updatedAt": "2025-09-26T16:31:48.340Z"
      }
    ],
    "estadisticas": {
      "total": 3,
      "disponibles": 2,
      "en_uso": 1,
      "mantenimiento": 0,
      "menor": 2,
      "mayor": 1
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 7. Estadísticas de Embarcaciones 🔒

```http
GET /api/embarcaciones/estadisticas?prestador_id=uuid
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "estadisticas": {
      "total_embarcaciones": 7,
      "por_estado": {
        "disponible": 5,
        "en_uso": 1,
        "mantenimiento": 1
      },
      "por_tipo": {
        "menor": 5,
        "mayor": 2
      },
      "capacidad_total": 245,
      "por_prestador": [
        {
          "prestador": {
            "id": "uuid",
            "nombre": "Juan Pérez",
            "email": "juan@ejemplo.com"
          },
          "total": 3,
          "disponibles": 2,
          "en_uso": 1,
          "mantenimiento": 0
        }
      ]
    }
  }
}
```

---

## 🚤 Salidas (`/api/salidas`)

> **Nota:** Todas las rutas requieren autenticación.

### 🎯 Destinos Soportados

El sistema ahora soporta múltiples destinos con diferentes flujos de trabajo:

#### **Isla de Lobos** (Con bloques horarios)

- Requiere `bloque_id`
- Validación de capacidad automática
- 3 bloques predefinidos siempre disponibles

#### **Arrecifes** (Con hora libre)

- Requiere `hora`
- Sin restricciones de bloques
- Destinos disponibles:
  - Arrecife Tuxpan
  - Arrecife de en Medio
  - Arrecife Tanhuijo

### 🔄 Flujo de Estados y Liberación Automática de Embarcaciones

#### **Estados de Salida:**

```typescript
enum EstadoSalida {
  PROGRAMADA = "programada", // Recién creada
  EN_PROGRESO = "en_progreso", // Salida iniciada
  COMPLETADA = "completada", // Salida finalizada
  CANCELADA = "cancelada", // Cancelada por prestador
  CANCELADA_POR_CLIMA = "cancelada_por_clima", // Cancelada por clima
  CANCELADA_CAPITARIA = "cancelada_capitaria", // Cancelada por capitanía
}
```

#### **Estados de Embarcación:**

```typescript
enum EstadoEmbarcacion {
  DISPONIBLE = "disponible", // Lista para usar
  EN_USO = "en_uso", // Siendo utilizada
  MANTENIMIENTO = "mantenimiento", // En mantenimiento
}
```

#### **Flujo Automático de Estados:**

```
1. Crear Salida:
   embarcacion: disponible → en_uso ✅

2. Marcar Salida como Completada:
   salida: programada/en_progreso → completada
   embarcacion: en_uso → disponible ✅ (AUTOMÁTICO)

3. Cancelar Salida:
   salida: programada/en_progreso → cancelada
   embarcacion: en_uso → disponible ✅ (AUTOMÁTICO)

4. Múltiples Salidas:
   - Solo se libera embarcación cuando NO hay otras salidas activas
   - Estados que NO bloquean liberación: cancelada, completada, cancelada_por_clima, cancelada_capitaria
   - Estados que SÍ bloquean liberación: programada, en_progreso
```

#### **Validaciones Automáticas:**

- ✅ **Al crear salida**: Verifica que embarcación esté `disponible`
- ✅ **Al completar salida**: Libera embarcación si no hay otras salidas activas
- ✅ **Al cancelar salida**: Libera embarcación si no hay otras salidas activas
- ✅ **Al cambiar embarcación**: Verifica que la nueva embarcación esté `disponible`

### 1. Listar Salidas

```http
GET /api/salidas?page=1&limit=10&fecha=2025-09-26&estado=programada
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Salidas obtenidas exitosamente",
  "data": {
    "salidas": [
      {
        "id": "uuid",
        "fecha": "2025-09-26",
        "destino": "Isla de Lobos",
        "bloque_id": "11111111-1111-1111-1111-111111111111",
        "hora": null,
        "numero_pasajeros": 25,
        "observaciones": "Salida programada",
        "estado": "programada",
        "motivo_cancelacion": null,
        "prestador_id": "uuid",
        "embarcacion_id": "uuid",
        "createdAt": "2025-09-26T10:00:00.000Z",
        "updatedAt": "2025-09-26T10:00:00.000Z",
        "prestador": {
          "id": "uuid",
          "nombre": "Juan Pérez",
          "email": "juan@ejemplo.com",
          "telefono": "2291234567"
        },
        "embarcacion": {
          "id": "uuid",
          "nombre": "Lancha María",
          "matricula": "VER-001-ABC",
          "capacidad": 30,
          "tipo": "menor"
        },
        "bloque": {
          "id": "uuid",
          "nombre": "Bloque Matutino",
          "hora_inicio": "08:00:00",
          "hora_fin": "10:00:00",
          "fecha": "2025-09-26"
        }
      }
    ],
    "estadisticas": {
      "total": 150,
      "programadas": 8,
      "en_curso": 3,
      "completadas": 135,
      "canceladas": 4
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

### 2. Obtener Salida por ID

```http
GET /api/salidas/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Salida obtenida exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "fecha": "2025-09-26",
      "numero_pasajeros": 25,
      "observaciones": "Salida programada",
      "estado": "programada",
      "motivo_cancelacion": null,
      "prestador_id": "uuid",
      "embarcacion_id": "uuid",
      "bloque_id": "uuid",
      "createdAt": "2025-09-26T10:00:00.000Z",
      "updatedAt": "2025-09-26T10:00:00.000Z",
      "prestador": {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "telefono": "2291234567"
      },
      "embarcacion": {
        "id": "uuid",
        "nombre": "Lancha María",
        "matricula": "VER-001-ABC",
        "capacidad": 30,
        "tipo": "menor"
      },
      "bloque": {
        "id": "uuid",
        "nombre": "Bloque Matutino",
        "hora_inicio": "08:00:00",
        "hora_fin": "10:00:00",
        "fecha": "2025-09-26"
      }
    }
  }
}
```

### 3. Registrar Salida

```http
POST /api/salidas
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Registra una nueva salida con validación condicional según el destino seleccionado.

#### **Para Isla de Lobos** (Requiere bloque_id):

**Body:**

```json
{
  "destino": "Isla de Lobos",
  "bloque_id": "11111111-1111-1111-1111-111111111111",
  "fecha": "2025-10-15",
  "numero_pasajeros": 25,
  "embarcacion_id": "uuid-embarcacion",
  "observaciones": "Salida matutina a Isla de Lobos"
}
```

#### **Para Arrecifes** (Requiere hora):

**Body:**

```json
{
  "destino": "Arrecife Tuxpan",
  "hora": "09:30",
  "fecha": "2025-10-15",
  "numero_pasajeros": 15,
  "embarcacion_id": "uuid-embarcacion",
  "observaciones": "Tour al arrecife"
}
```

**Validaciones Automáticas:**

- **Isla de Lobos**: Verifica capacidad disponible en el bloque
- **Arrecifes**: Valida formato de hora
- **Ambos**: Verifica capacidad de embarcación y permisos del prestador

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Salida registrada exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "fecha": "2025-10-15",
      "destino": "Isla de Lobos",
      "bloque_id": "11111111-1111-1111-1111-111111111111",
      "hora": null,
      "numero_pasajeros": 25,
      "observaciones": "Salida matutina a Isla de Lobos",
      "estado": "programada",
      "motivo_cancelacion": null,
      "prestador_id": "uuid",
      "embarcacion_id": "uuid-embarcacion",
      "createdAt": "2025-10-15T10:00:00.000Z",
      "updatedAt": "2025-10-15T10:00:00.000Z",
      "prestador": {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "telefono": "2291234567"
      },
      "embarcacion": {
        "id": "uuid-embarcacion",
        "nombre": "Lancha María",
        "matricula": "VER-001-ABC",
        "capacidad": 30,
        "tipo": "menor"
      },
      "bloque": {
        "id": "11111111-1111-1111-1111-111111111111",
        "nombre": "Bloque Matutino",
        "hora_inicio": "08:00:00",
        "hora_fin": "10:00:00",
        "capacidad_total": 65
      }
    }
  }
}
```

**Respuesta para Arrecife (sin bloque):**

```json
{
  "status": "success",
  "message": "Salida registrada exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "fecha": "2025-10-15",
      "destino": "Arrecife Tuxpan",
      "bloque_id": null,
      "hora": "09:30:00",
      "numero_pasajeros": 15,
      "observaciones": "Tour al arrecife",
      "estado": "programada",
      "motivo_cancelacion": null,
      "prestador_id": "uuid",
      "embarcacion_id": "uuid-embarcacion",
      "createdAt": "2025-10-15T10:00:00.000Z",
      "updatedAt": "2025-10-15T10:00:00.000Z",
      "prestador": {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "telefono": "2291234567"
      },
      "embarcacion": {
        "id": "uuid-embarcacion",
        "nombre": "Lancha María",
        "matricula": "VER-001-ABC",
        "capacidad": 30,
        "tipo": "menor"
      },
      "bloque": null
    }
  }
}
```

**Errores Comunes:**

```json
// Error: Bloque requerido para Isla de Lobos
{
  "status": "error",
  "message": "bloque_id es requerido para salidas a Isla de Lobos",
  "error": "VALIDATION_ERROR"
}

// Error: Capacidad insuficiente
{
  "status": "error",
  "message": "El bloque solo tiene 15 cupos disponibles",
  "error": "INSUFFICIENT_CAPACITY"
}

// Error: Hora requerida para arrecifes
{
  "status": "error",
  "message": "hora es requerida para este destino",
  "error": "VALIDATION_ERROR"
}
```

### 4. Actualizar Salida

```http
PUT /api/salidas/:id
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Actualiza una salida existente. Incluye lógica automática para liberar embarcaciones cuando se marca como completada.

**Body:**

```json
{
  "destino": "Isla de Lobos",
  "embarcacion_id": "uuid-embarcacion",
  "bloque_id": "uuid-bloque",
  "hora": "09:30",
  "fecha": "2025-10-15",
  "numero_pasajeros": 30,
  "observaciones": "Actualización de pasajeros",
  "estado": "completada"
}
```

**Campos Opcionales:**

- `destino`: Cambiar destino de la salida
- `embarcacion_id`: Cambiar embarcación (debe estar disponible)
- `bloque_id`: Cambiar bloque (solo para Isla de Lobos)
- `hora`: Cambiar hora (solo para arrecifes)
- `fecha`: Cambiar fecha de la salida
- `numero_pasajeros`: Actualizar número de pasajeros
- `observaciones`: Actualizar observaciones
- `estado`: Cambiar estado de la salida

**Estados Válidos:**

- `programada`: Salida programada
- `en_progreso`: Salida en curso
- `completada`: Salida completada (libera embarcación automáticamente)
- `cancelada`: Salida cancelada
- `cancelada_por_clima`: Cancelada por condiciones climáticas
- `cancelada_capitaria`: Cancelada por orden de capitanía

**Funcionalidad Automática:**

- ✅ **Liberación de Embarcación**: Al marcar como `completada`, la embarcación se libera automáticamente si no hay otras salidas activas
- ✅ **Validación de Capacidad**: Verifica capacidad disponible al cambiar número de pasajeros
- ✅ **Validación de Disponibilidad**: Verifica que la embarcación esté disponible al cambiarla

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Salida actualizada exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "fecha": "2025-10-15",
      "destino": "Isla de Lobos",
      "bloque_id": "uuid-bloque",
      "hora": null,
      "numero_pasajeros": 30,
      "observaciones": "Actualización de pasajeros",
      "estado": "completada",
      "motivo_cancelacion": null,
      "prestador_id": "uuid",
      "embarcacion_id": "uuid-embarcacion",
      "createdAt": "2025-10-15T10:00:00.000Z",
      "updatedAt": "2025-10-15T11:00:00.000Z",
      "prestador": {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "telefono": "2291234567"
      },
      "embarcacion": {
        "id": "uuid-embarcacion",
        "nombre": "Lancha María",
        "matricula": "VER-001-ABC",
        "capacidad": 30,
        "tipo": "menor",
        "estado": "disponible"
      },
      "bloque": {
        "id": "uuid-bloque",
        "nombre": "Bloque Matutino",
        "hora_inicio": "08:00:00",
        "hora_fin": "10:00:00",
        "capacidad_total": 65
      }
    }
  }
}
```

**Respuesta para Salida a Arrecife:**

```json
{
  "status": "success",
  "message": "Salida actualizada exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "fecha": "2025-10-15",
      "destino": "Arrecife Tuxpan",
      "bloque_id": null,
      "hora": "09:30:00",
      "numero_pasajeros": 15,
      "observaciones": "Tour al arrecife",
      "estado": "completada",
      "motivo_cancelacion": null,
      "prestador_id": "uuid",
      "embarcacion_id": "uuid-embarcacion",
      "createdAt": "2025-10-15T10:00:00.000Z",
      "updatedAt": "2025-10-15T11:00:00.000Z",
      "prestador": {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "telefono": "2291234567"
      },
      "embarcacion": {
        "id": "uuid-embarcacion",
        "nombre": "Lancha María",
        "matricula": "VER-001-ABC",
        "capacidad": 30,
        "tipo": "menor",
        "estado": "disponible"
      },
      "bloque": null
    }
  }
}
```

**Errores Comunes:**

```json
// Error: No se puede modificar salida completada
{
  "status": "error",
  "message": "No se puede modificar una salida completada o cancelada",
  "error": "SALIDA_FINALIZED"
}

// Error: Embarcación no disponible
{
  "status": "error",
  "message": "La embarcación no está disponible",
  "error": "EMBARCACION_NOT_AVAILABLE"
}

// Error: Capacidad insuficiente
{
  "status": "error",
  "message": "No hay suficiente capacidad. Disponible: 15, Solicitado: 30",
  "error": "INSUFFICIENT_CAPACITY"
}
```

### 5. Cancelar Salida

```http
DELETE /api/salidas/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Salida cancelada exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "fecha": "2025-09-26",
      "numero_pasajeros": 25,
      "observaciones": "Salida cancelada",
      "estado": "cancelada",
      "motivo_cancelacion": "Cancelación por solicitud del prestador",
      "prestador_id": "uuid",
      "embarcacion_id": "uuid",
      "bloque_id": "uuid",
      "createdAt": "2025-09-26T10:00:00.000Z",
      "updatedAt": "2025-09-26T12:00:00.000Z"
    }
  }
}
```

### 6. Gestión de Estados de Salida

#### **6.1. Iniciar Salida (programada → en_progreso)**

```http
PUT /api/salidas/:id
```

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "estado": "en_progreso",
  "observaciones": "Salida iniciada a las 08:30"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Salida actualizada exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "estado": "en_progreso",
      "observaciones": "Salida iniciada a las 08:30",
      "embarcacion": {
        "id": "uuid",
        "nombre": "Lancha María",
        "estado": "en_uso"
      }
    }
  }
}
```

#### **6.2. Completar Salida (en_progreso → completada)**

```http
PUT /api/salidas/:id
```

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "estado": "completada",
  "observaciones": "Salida finalizada exitosamente"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Salida actualizada exitosamente",
  "data": {
    "salida": {
      "id": "uuid",
      "estado": "completada",
      "observaciones": "Salida finalizada exitosamente",
      "embarcacion": {
        "id": "uuid",
        "nombre": "Lancha María",
        "estado": "disponible"
      }
    }
  }
}
```

**Nota:** La embarcación se libera automáticamente si no hay otras salidas activas.

#### **6.3. Cancelar por Clima**

```http
PUT /api/salidas/:id
```

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "estado": "cancelada_por_clima",
  "observaciones": "Cancelada por condiciones meteorológicas adversas"
}
```

#### **6.4. Cancelar por Capitanía**

```http
PUT /api/salidas/:id
```

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "estado": "cancelada_capitaria",
  "observaciones": "Cancelada por orden de Capitanía de Puerto"
}
```

### 7. Mis Salidas

```http
GET /api/salidas/mis-salidas?page=1&limit=10
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Mis salidas obtenidas exitosamente",
  "data": {
    "salidas": [
      {
        "id": "uuid",
        "fecha": "2025-09-26",
        "numero_pasajeros": 25,
        "observaciones": "Mi salida",
        "estado": "programada",
        "motivo_cancelacion": null,
        "prestador_id": "uuid",
        "embarcacion_id": "uuid",
        "bloque_id": "uuid",
        "createdAt": "2025-09-26T10:00:00.000Z",
        "updatedAt": "2025-09-26T10:00:00.000Z",
        "embarcacion": {
          "id": "uuid",
          "nombre": "Lancha María",
          "matricula": "VER-001-ABC",
          "capacidad": 30,
          "tipo": "menor"
        },
        "bloque": {
          "id": "uuid",
          "nombre": "Bloque Matutino",
          "hora_inicio": "08:00:00",
          "hora_fin": "10:00:00",
          "fecha": "2025-09-26"
        }
      }
    ],
    "estadisticas": {
      "total": 45,
      "programadas": 3,
      "en_curso": 1,
      "completadas": 40,
      "canceladas": 1
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### 7. Obtener Destinos Disponibles

```http
GET /api/salidas/destinos
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Obtiene la lista de destinos disponibles para registrar salidas.

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Destinos obtenidos exitosamente",
  "data": {
    "destinos": [
      {
        "id": "isla_lobos",
        "nombre": "Isla de Lobos",
        "tipo": "bloque",
        "descripcion": "Requiere selección de bloque horario",
        "requiere_bloque": true,
        "requiere_hora": false
      },
      {
        "id": "arrecife_tuxpan",
        "nombre": "Arrecife Tuxpan",
        "tipo": "hora_libre",
        "descripcion": "Requiere especificar hora de salida",
        "requiere_bloque": false,
        "requiere_hora": true
      },
      {
        "id": "arrecife_en_medio",
        "nombre": "Arrecife de en Medio",
        "tipo": "hora_libre",
        "descripcion": "Requiere especificar hora de salida",
        "requiere_bloque": false,
        "requiere_hora": true
      },
      {
        "id": "arrecife_tanhuijo",
        "nombre": "Arrecife Tanhuijo",
        "tipo": "hora_libre",
        "descripcion": "Requiere especificar hora de salida",
        "requiere_bloque": false,
        "requiere_hora": true
      }
    ]
  }
}
```

### 8. Estadísticas de Salidas

```http
GET /api/salidas/estadisticas?fecha_inicio=2025-09-01&fecha_fin=2025-09-30
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas de salidas obtenidas exitosamente",
  "data": {
    "estadisticas": {
      "periodo": {
        "fecha_inicio": "2025-09-01T00:00:00.000Z",
        "fecha_fin": "2025-09-30T23:59:59.999Z",
        "total_dias": 30
      },
      "totales": {
        "salidas": 150,
        "pasajeros": 3750,
        "promedio_pasajeros_por_salida": 25
      },
      "por_estado": {
        "programadas": 8,
        "en_curso": 3,
        "completadas": 135,
        "canceladas": 4
      },
      "por_embarcacion": [
        {
          "embarcacion": {
            "id": "uuid",
            "nombre": "Lancha María",
            "matricula": "VER-001-ABC"
          },
          "total_salidas": 25,
          "total_pasajeros": 625
        }
      ],
      "por_prestador": [
        {
          "prestador": {
            "id": "uuid",
            "nombre": "Juan Pérez",
            "email": "juan@ejemplo.com"
          },
          "total_salidas": 25,
          "total_pasajeros": 625
        }
      ],
      "tendencias": {
        "salidas_por_dia": 5,
        "pasajeros_por_dia": 125,
        "ocupacion_promedio": 83
      }
    }
  }
}
```

---

## 🌤️ Clima (`/api/clima`)

> **Nota:** Todas las rutas requieren autenticación. Las rutas marcadas con 🔒 requieren rol CONANP.

### 1. Listar Condiciones Meteorológicas

```http
GET /api/clima?page=1&limit=10&fecha_inicio=2025-09-01&fecha_fin=2025-09-30
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Condiciones meteorológicas obtenidas exitosamente",
  "data": {
    "condiciones": [
      {
        "id": "bd8fc4e2-b824-499a-98d5-be143c6821ad",
        "fecha_hora": "2025-09-26T16:31:53.994Z",
        "oleaje": 1.2,
        "viento_velocidad": 15.5,
        "viento_direccion": "NE",
        "visibilidad": "Buena",
        "estado_puerto": "abierto",
        "prediccion_5_dias": "Condiciones estables para los próximos 5 días...",
        "fuente": "CONAGUA",
        "createdAt": "2025-09-26T16:31:53.994Z",
        "updatedAt": "2025-09-26T16:31:53.994Z"
      }
    ],
    "condicion_actual": {
      "id": "bd8fc4e2-b824-499a-98d5-be143c6821ad",
      "fecha_hora": "2025-09-26T16:31:53.994Z",
      "oleaje": 1.2,
      "viento_velocidad": 15.5,
      "viento_direccion": "NE",
      "visibilidad": "Buena",
      "estado_puerto": "abierto",
      "prediccion_5_dias": "Condiciones estables para los próximos 5 días...",
      "fuente": "CONAGUA"
    },
    "estadisticas": {
      "total": 4,
      "abierto": 2,
      "restricciones": 1,
      "cerrado": 1,
      "emergencia": 0
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 4,
      "totalPages": 1
    }
  }
}
```

### 2. Obtener Condición por ID

```http
GET /api/clima/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Condición meteorológica obtenida exitosamente",
  "data": {
    "condicion": {
      "id": "bd8fc4e2-b824-499a-98d5-be143c6821ad",
      "fecha_hora": "2025-09-26T16:31:53.994Z",
      "oleaje": 1.2,
      "viento_velocidad": 15.5,
      "viento_direccion": "NE",
      "visibilidad": "Buena",
      "estado_puerto": "abierto",
      "prediccion_5_dias": "Condiciones estables para los próximos 5 días...",
      "fuente": "CONAGUA",
      "createdAt": "2025-09-26T16:31:53.994Z",
      "updatedAt": "2025-09-26T16:31:53.994Z"
    }
  }
}
```

### 3. Crear Condición Meteorológica 🔒

```http
POST /api/clima
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "fecha_hora": "2025-09-26T18:00:00Z",
  "oleaje": 1.5,
  "viento_velocidad": 18.0,
  "viento_direccion": "SE",
  "visibilidad": "buena",
  "estado_puerto": "abierto",
  "prediccion_5_dias": "Condiciones favorables",
  "fuente": "CONAGUA"
}
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Condición meteorológica creada exitosamente",
  "data": {
    "condicion": {
      "id": "c6790ee5-530f-4605-9035-3ba12acede3e",
      "fecha_hora": "2025-09-26T18:00:00.000Z",
      "oleaje": 1.5,
      "viento_velocidad": 18.0,
      "viento_direccion": "SE",
      "visibilidad": "buena",
      "estado_puerto": "abierto",
      "prediccion_5_dias": "Condiciones favorables",
      "fuente": "CONAGUA",
      "createdAt": "2025-09-26T18:00:00.000Z",
      "updatedAt": "2025-09-26T18:00:00.000Z"
    }
  }
}
```

### 4. Actualizar Condición 🔒

```http
PUT /api/clima/:id
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "oleaje": 2.0,
  "viento_velocidad": 22.0,
  "visibilidad": "regular",
  "estado_puerto": "restricciones"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Condición meteorológica actualizada exitosamente",
  "data": {
    "condicion": {
      "id": "c6790ee5-530f-4605-9035-3ba12acede3e",
      "fecha_hora": "2025-09-26T18:00:00.000Z",
      "oleaje": 2.0,
      "viento_velocidad": 22.0,
      "viento_direccion": "SE",
      "visibilidad": "regular",
      "estado_puerto": "restricciones",
      "prediccion_5_dias": "Condiciones variables, precaución",
      "fuente": "CONAGUA",
      "createdAt": "2025-09-26T18:00:00.000Z",
      "updatedAt": "2025-09-26T18:30:00.000Z"
    }
  }
}
```

### 5. Eliminar Condición 🔒

```http
DELETE /api/clima/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Condición meteorológica eliminada exitosamente"
}
```

### 6. Condición Actual

```http
GET /api/clima/actual
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Condición meteorológica actual obtenida exitosamente",
  "data": {
    "condicion": {
      "id": "bd8fc4e2-b824-499a-98d5-be143c6821ad",
      "fecha_hora": "2025-09-26T16:31:53.994Z",
      "oleaje": 1.2,
      "viento_velocidad": 15.5,
      "viento_direccion": "NE",
      "visibilidad": "Buena",
      "estado_puerto": "abierto",
      "prediccion_5_dias": "Condiciones estables para los próximos 5 días...",
      "fuente": "CONAGUA"
    },
    "tiempo_transcurrido_horas": 2,
    "necesita_actualizacion": false
  }
}
```

### 7. Predicción Meteorológica

```http
GET /api/clima/prediccion?dias=5
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Predicción meteorológica generada exitosamente",
  "data": {
    "prediccion": {
      "periodo_dias": 5,
      "promedio_oleaje": 1.4,
      "promedio_viento": 18.2,
      "tendencia_oleaje": "estable",
      "tendencia_viento": "decreciente",
      "recomendacion": "Condiciones favorables. Salidas recomendadas para todos los tipos de embarcación.",
      "condiciones_por_dia": [
        {
          "fecha": "2025-09-26T16:31:53.994Z",
          "oleaje": 1.2,
          "viento": 15.5,
          "estado_puerto": "abierto",
          "visibilidad": "Buena"
        }
      ]
    }
  }
}
```

### 8. Alertas Meteorológicas

```http
GET /api/clima/alertas
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Alertas meteorológicas obtenidas exitosamente",
  "data": {
    "alertas": [
      {
        "tipo": "oleaje_moderado",
        "severidad": "media",
        "mensaje": "Oleaje moderado: 1.5m. Precaución en salidas.",
        "valor": 1.5,
        "umbral": 1.5
      }
    ],
    "total_alertas": 1,
    "alertas_criticas": 0,
    "alertas_altas": 0,
    "alertas_medias": 1,
    "condicion_actual": {
      "fecha_hora": "2025-09-26T16:31:53.994Z",
      "oleaje": 1.5,
      "viento_velocidad": 18.0,
      "visibilidad": "Buena",
      "estado_puerto": "abierto"
    }
  }
}
```

### 9. Estadísticas Meteorológicas 🔒

```http
GET /api/clima/estadisticas?fecha_inicio=2025-09-01&fecha_fin=2025-09-30
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas meteorológicas obtenidas exitosamente",
  "data": {
    "estadisticas": {
      "periodo": {
        "fecha_inicio": "2025-09-26T10:31:53.994Z",
        "fecha_fin": "2025-09-26T16:31:53.994Z",
        "total_registros": 4
      },
      "oleaje": {
        "promedio": 1.8,
        "minimo": 0.8,
        "maximo": 3.2,
        "registros_oleaje_alto": 2
      },
      "viento": {
        "promedio": 20.9,
        "minimo": 8.0,
        "maximo": 35.0,
        "registros_viento_fuerte": 1
      },
      "estado_puerto": {
        "abierto": 2,
        "restricciones": 1,
        "cerrado": 1,
        "emergencia": 0
      },
      "visibilidad": {
        "excelente": 1,
        "buena": 1,
        "regular": 1,
        "baja": 1
      }
    }
  }
}
```

### 10. Sincronizar Datos del SMN 🔒

```http
POST /api/clima/sincronizar-smn?horas_limite=24&solo_isla_lobos=true
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Sincroniza datos meteorológicos en tiempo real desde la API oficial del Servicio Meteorológico Nacional (SMN-CONAGUA). Obtiene pronósticos hasta 48 horas para la región de Tuxpan, Veracruz (Isla de Lobos).

**Parámetros de Query:**

| Parámetro         | Tipo    | Default | Descripción                           |
| ----------------- | ------- | ------- | ------------------------------------- |
| `horas_limite`    | integer | 24      | Número de horas a procesar (max: 48)  |
| `solo_isla_lobos` | boolean | true    | Filtrar solo datos de Veracruz/Tuxpan |

**Funcionalidad:**

- 🌐 **Conexión a API Oficial**: Se conecta a `https://smn.conagua.gob.mx/tools/GUI/webservices/`
- 📍 **Filtrado Geográfico**: Datos específicos de Veracruz (ID: 30), Tuxpan (ID: 189)
- 🔄 **Actualización Inteligente**: Crea nuevas condiciones o actualiza existentes
- 🌊 **Cálculos Automáticos**:
  - Estimación de oleaje basada en velocidad del viento (Escala de Beaufort)
  - Cálculo de visibilidad desde cobertura de nubes y precipitación
  - Determinación automática de estado del puerto

**Conversiones Automáticas:**

1. **Oleaje** (basado en viento):

   - < 10 km/h → 0.5m (Calma)
   - 10-20 km/h → 1.0m (Brisa moderada)
   - 20-30 km/h → 1.8m (Viento fresco)
   - 30-40 km/h → 2.5m (Viento fuerte)
   - 40-50 km/h → 3.5m (Temporal)
   - \> 50 km/h → 5.0m (Temporal fuerte)

2. **Visibilidad** (nubes + precipitación):

   - Excelente: < 25% nubes
   - Buena: 25-50% nubes
   - Regular: 50-75% nubes
   - Mala: > 75% nubes o lluvia > 70%

3. **Estado del Puerto**:
   - Abierto: Viento < 30 km/h y oleaje < 2.0m
   - Restricciones: Viento 30-40 km/h o oleaje 2.0-3.0m
   - Cerrado: Viento > 40 km/h o oleaje > 3.0m

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Datos del SMN sincronizados exitosamente",
  "data": {
    "total_procesados": 24,
    "condiciones_creadas": 20,
    "condiciones_actualizadas": 4,
    "condiciones": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "fecha_hora": "2025-10-09T15:00:00.000Z",
        "oleaje": 1.2,
        "viento_velocidad": 18.5,
        "viento_direccion": "NE",
        "visibilidad": "Buena",
        "estado_puerto": "abierto",
        "prediccion_5_dias": "Cielo parcialmente nublado. Probabilidad de lluvia: 20% (0.3 L/m²). Viento: 18.5 km/h NE. Temperatura: 27.2°C. Humedad: 72%",
        "fuente": "CONAGUA",
        "createdAt": "2025-10-09T15:00:00.000Z",
        "updatedAt": "2025-10-09T15:00:00.000Z"
      },
      {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "fecha_hora": "2025-10-09T16:00:00.000Z",
        "oleaje": 1.0,
        "viento_velocidad": 16.3,
        "viento_direccion": "NE",
        "visibilidad": "Buena",
        "estado_puerto": "abierto",
        "prediccion_5_dias": "Cielo despejado. Probabilidad de lluvia: 10% (0.1 L/m²). Viento: 16.3 km/h NE. Temperatura: 28.0°C. Humedad: 68%",
        "fuente": "CONAGUA",
        "createdAt": "2025-10-09T16:00:00.000Z",
        "updatedAt": "2025-10-09T16:00:00.000Z"
      }
      // ... 22 condiciones más (una por cada hora)
    ],
    "errores": []
  }
}
```

**Respuesta con Errores Parciales (200):**

```json
{
  "status": "success",
  "message": "Datos del SMN sincronizados exitosamente",
  "data": {
    "total_procesados": 24,
    "condiciones_creadas": 20,
    "condiciones_actualizadas": 3,
    "condiciones": [...],
    "errores": [
      "Error procesando dato para fecha 20251009T19: Velocidad del viento inválida: N/A"
    ]
  }
}
```

**Respuesta de Error (404):**

```json
{
  "status": "error",
  "message": "No se encontraron datos del SMN para la región especificada",
  "error": "NO_SMN_DATA"
}
```

**Respuesta de Error (500):**

```json
{
  "status": "error",
  "message": "No se pudo obtener el pronóstico horario del SMN. Verifique la conexión o intente más tarde.",
  "error": "SMN_SYNC_ERROR"
}
```

**Datos Obtenidos del SMN:**

| Campo                   | Fuente SMN   | Descripción                         |
| ----------------------- | ------------ | ----------------------------------- |
| **Temperatura**         | `temp`       | Temperatura superficie (°C)         |
| **Temp. Máxima**        | `tmax`       | Temperatura máxima del día (°C)     |
| **Temp. Mínima**        | `tmin`       | Temperatura mínima del día (°C)     |
| **Viento Velocidad**    | `velvien`    | Velocidad del viento (km/h)         |
| **Viento Dirección**    | `dirvienc`   | Dirección cardinal (N, NE, E, etc.) |
| **Ráfagas**             | `raf`        | Ráfagas de viento (km/h)            |
| **Descripción**         | `desciel`    | Estado del cielo (texto)            |
| **Probabilidad Lluvia** | `probprec`   | Probabilidad de precipitación (%)   |
| **Precipitación**       | `prec`       | Cantidad esperada (L/m²)            |
| **Humedad**             | `hr`         | Humedad relativa (%)                |
| **Día Semana**          | `dsem`       | Nombre del día                      |
| **Ubicación**           | `lat`, `lon` | Coordenadas geográficas             |

**Región Configurada:**

- **Estado**: Veracruz (ID: 30)
- **Municipio**: Tuxpan (ID: 189)
- **Cobertura**: Norte de Veracruz, Golfo de México
- **Isla de Lobos**: Ubicada en esta región

**Frecuencia Recomendada:**

- **Manual**: Bajo demanda mediante este endpoint
- **Automática** (futura): Cron job cada hora
- **Actualización SMN**: Datos oficiales actualizados cada hora a los 15 minutos

**Ejemplos de Uso:**

```bash
# Sincronizar 24 horas (default)
POST /api/clima/sincronizar-smn

# Sincronizar 48 horas (máximo)
POST /api/clima/sincronizar-smn?horas_limite=48

# Sincronizar todos los datos de Veracruz
POST /api/clima/sincronizar-smn?solo_isla_lobos=false
```

**Notas Importantes:**

- ⏱️ **Primera sincronización**: Puede tardar 5-10 segundos
- 🔄 **Sincronizaciones posteriores**: Actualizan datos existentes
- 📊 **Datos históricos**: Se mantienen en base de datos
- 🔐 **Permisos**: Solo usuarios CONANP pueden sincronizar
- 🌐 **API Externa**: Requiere conexión a internet

---

## 📊 Dashboard (`/api/dashboard`)

> **Nota:** Todas las rutas requieren autenticación y rol CONANP 🔒.

### 1. Estadísticas Generales

```http
GET /api/dashboard/estadisticas
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas generales obtenidas exitosamente",
  "data": {
    "estadisticas": {
      "sistema": {
        "fecha_actual": "2025-09-26T12:00:00.000Z",
        "uptime": 3600,
        "version": "1.0.0"
      },
      "usuarios": {
        "total": 15,
        "activos": 12,
        "por_vencer": 2,
        "vencidos": 1,
        "porcentaje_activos": 80
      },
      "embarcaciones": {
        "total": 25,
        "disponibles": 20,
        "en_uso": 3,
        "mantenimiento": 2,
        "porcentaje_disponibles": 80
      },
      "bloques": {
        "total": 42,
        "disponibles": 35,
        "llenos": 5,
        "cerrados": 2,
        "porcentaje_disponibles": 83
      },
      "salidas": {
        "total": 150,
        "programadas": 8,
        "en_curso": 3,
        "completadas": 135,
        "canceladas": 4,
        "este_mes": 45,
        "esta_semana": 12,
        "porcentaje_completadas": 90
      },
      "invitaciones": {
        "total": 50,
        "usadas": 15,
        "disponibles": 35,
        "porcentaje_usadas": 30
      },
      "clima": {
        "condicion_actual": {
          "fecha_hora": "2025-09-26T12:00:00.000Z",
          "oleaje": 1.2,
          "viento_velocidad": 15,
          "visibilidad": "buena",
          "estado_puerto": "abierto"
        }
      }
    }
  }
}
```

### 2. Ocupación por Día

```http
GET /api/dashboard/ocupacion?dias=7
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Ocupación por día obtenida exitosamente",
  "data": {
    "ocupacion_por_dia": [
      {
        "fecha": "2025-09-20",
        "bloques": [
          {
            "id": "uuid",
            "nombre": "Bloque Matutino",
            "hora_inicio": "08:00",
            "hora_fin": "12:00",
            "capacidad_total": 50,
            "capacidad_registrada": 35,
            "estado": "activo",
            "porcentaje_ocupacion": 70
          }
        ],
        "total_capacidad": 150,
        "total_ocupados": 105,
        "porcentaje_ocupacion": 70
      }
    ],
    "estadisticas": {
      "periodo_dias": 7,
      "fecha_inicio": "2025-09-20T00:00:00.000Z",
      "fecha_fin": "2025-09-26T12:00:00.000Z",
      "total_bloques": 21,
      "total_salidas": 45,
      "promedio_ocupacion": 75,
      "bloques_llenos": 3,
      "bloques_disponibles": 18
    }
  }
}
```

### 3. Estado de Embarcaciones

```http
GET /api/dashboard/embarcaciones
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estado de embarcaciones obtenido exitosamente",
  "data": {
    "embarcaciones": [
      {
        "id": "uuid",
        "nombre": "Lancha María",
        "matricula": "ABC123",
        "capacidad": 20,
        "tipo": "menor",
        "estado": "disponible",
        "prestador": {
          "id": "uuid",
          "nombre": "Juan Pérez",
          "email": "juan@prestador.com",
          "telefono": "5551234567"
        }
      }
    ],
    "estadisticas": {
      "total": 25,
      "disponibles": 20,
      "en_uso": 3,
      "mantenimiento": 2,
      "por_tipo": {
        "menor": 15,
        "mayor": 10
      }
    },
    "por_prestador": [
      {
        "prestador": "uuid",
        "embarcaciones": [
          {
            "id": "uuid",
            "nombre": "Lancha María",
            "estado": "disponible"
          }
        ],
        "total": 5,
        "disponibles": 4,
        "en_uso": 1,
        "mantenimiento": 0
      }
    ]
  }
}
```

### 4. Estado de Permisos

```http
GET /api/dashboard/permisos
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estado de permisos obtenido exitosamente",
  "data": {
    "estadisticas": {
      "total_prestadores": 12,
      "vigentes": 8,
      "por_vencer": 3,
      "vencidos": 1,
      "vencen_proximos_30_dias": 2
    },
    "usuarios_por_vencer": [
      {
        "id": "uuid",
        "nombre": "María García",
        "email": "maria@prestador.com",
        "fechaVencimientoPermiso": "2025-10-15T00:00:00.000Z",
        "estadoPermiso": "por_vencer",
        "diasNotificacion": 7
      }
    ],
    "usuarios_vencidos": [
      {
        "id": "uuid",
        "nombre": "Carlos López",
        "email": "carlos@prestador.com",
        "fechaVencimientoPermiso": "2025-09-15T00:00:00.000Z",
        "estadoPermiso": "vencido",
        "diasNotificacion": 30
      }
    ],
    "usuarios_vencen_proximos_30_dias": [
      {
        "id": "uuid",
        "nombre": "Ana Rodríguez",
        "email": "ana@prestador.com",
        "fechaVencimientoPermiso": "2025-10-20T00:00:00.000Z",
        "estadoPermiso": "vigente",
        "diasNotificacion": 15
      }
    ],
    "todos_los_usuarios": [
      {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@prestador.com",
        "fechaVencimientoPermiso": "2026-09-26T00:00:00.000Z",
        "estadoPermiso": "vigente",
        "diasNotificacion": 30
      }
    ]
  }
}
```

### 5. Resumen Meteorológico

```http
GET /api/dashboard/clima?dias=7
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Resumen meteorológico obtenido exitosamente",
  "data": {
    "condicion_actual": {
      "id": "uuid",
      "fecha_hora": "2025-09-26T12:00:00.000Z",
      "oleaje": 1.2,
      "viento_velocidad": 15,
      "visibilidad": "buena",
      "estado_puerto": "abierto"
    },
    "promedios": {
      "oleaje": 1.1,
      "viento": 12.5
    },
    "estado_puerto": {
      "abierto": 5,
      "restricciones": 1,
      "cerrado": 0,
      "emergencia": 0
    },
    "alertas": [
      {
        "tipo": "oleaje_alto",
        "severidad": "alta",
        "mensaje": "Oleaje alto: 2.8m"
      }
    ],
    "condiciones_recientes": [
      {
        "id": "uuid",
        "fecha_hora": "2025-09-25T12:00:00.000Z",
        "oleaje": 1.0,
        "viento_velocidad": 12,
        "estado_puerto": "abierto"
      }
    ],
    "periodo_dias": 7
  }
}
```

### 6. Alertas del Sistema

```http
GET /api/dashboard/alertas
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Alertas del sistema obtenidas exitosamente",
  "data": {
    "alertas": [
      {
        "tipo": "permisos_vencidos",
        "severidad": "alta",
        "mensaje": "1 prestador(es) con permisos vencidos",
        "accion": "Revisar y renovar permisos"
      },
      {
        "tipo": "clima_oleaje_alto",
        "severidad": "alta",
        "mensaje": "Oleaje alto: 2.8m",
        "accion": "Evaluar suspensión de salidas"
      }
    ],
    "estadisticas": {
      "total": 3,
      "criticas": 0,
      "altas": 2,
      "medias": 1,
      "bajas": 0
    },
    "fecha_consulta": "2025-09-26T12:00:00.000Z"
  }
}
```

---

## 🎫 Invitaciones (`/api/invitaciones`)

> **Nota:** Las rutas marcadas con 🔒 requieren autenticación y rol CONANP. Las rutas marcadas con 🌐 son públicas.

### 1. Listar Invitaciones 🔒

```http
GET /api/invitaciones?page=1&limit=10&usada=false
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Invitaciones obtenidas exitosamente",
  "data": {
    "invitaciones": [
      {
        "id": "uuid",
        "codigo": "INV2025",
        "email": "usuario@ejemplo.com",
        "rol": "PRESTADOR",
        "expira_en": "2025-12-31T23:59:59.000Z",
        "usada": false,
        "creada_por": "uuid-creador",
        "created_at": "2025-09-26T12:00:00.000Z",
        "updated_at": "2025-09-26T12:00:00.000Z",
        "creador": {
          "id": "uuid",
          "nombre": "Admin CONANP",
          "email": "admin@conanp.gob.mx"
        },
        "usuario": null
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 50,
      "items_per_page": 10,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 2. Obtener Invitación por ID 🔒

```http
GET /api/invitaciones/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Invitación obtenida exitosamente",
  "data": {
    "invitacion": {
      "id": "uuid",
      "codigo": "INV2025",
      "email": "usuario@ejemplo.com",
      "rol": "PRESTADOR",
      "expira_en": "2025-12-31T23:59:59.000Z",
      "usada": false,
      "creada_por": "uuid-creador",
      "creador": {
        "id": "uuid",
        "nombre": "Admin CONANP",
        "email": "admin@conanp.gob.mx"
      },
      "usuario": null
    }
  }
}
```

### 3. Crear Invitación 🔒

```http
POST /api/invitaciones
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "codigo": "INV2025",
  "fecha_expiracion": "2025-12-31T23:59:59.000Z"
}
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Invitación creada exitosamente",
  "data": {
    "invitacion": {
      "id": "uuid",
      "codigo": "INV2025",
      "email": "",
      "rol": "PRESTADOR",
      "expira_en": "2025-12-31T23:59:59.000Z",
      "usada": false,
      "creada_por": "uuid-creador",
      "creador": {
        "id": "uuid",
        "nombre": "Admin CONANP",
        "email": "admin@conanp.gob.mx"
      }
    }
  }
}
```

### 4. Actualizar Invitación 🔒

```http
PUT /api/invitaciones/:id
```

**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "fecha_expiracion": "2025-12-31T23:59:59.000Z"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Invitación actualizada exitosamente",
  "data": {
    "invitacion": {
      "id": "uuid",
      "codigo": "INV2025",
      "email": "",
      "rol": "PRESTADOR",
      "expira_en": "2025-12-31T23:59:59.000Z",
      "usada": false,
      "creada_por": "uuid-creador",
      "creador": {
        "id": "uuid",
        "nombre": "Admin CONANP",
        "email": "admin@conanp.gob.mx"
      }
    }
  }
}
```

### 5. Eliminar Invitación 🔒

```http
DELETE /api/invitaciones/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Invitación eliminada exitosamente"
}
```

### 6. Validar Código 🌐

```http
POST /api/invitaciones/validar
```

**Body:**

```json
{
  "codigo": "INV2025"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Código de invitación válido",
  "data": {
    "invitacion": {
      "id": "uuid",
      "codigo": "INV2025",
      "email": "",
      "rol": "PRESTADOR",
      "creada_por": "uuid-creador",
      "expira_en": "2025-12-31T23:59:59.000Z"
    }
  }
}
```

### 7. Usar Invitación 🌐

```http
POST /api/invitaciones/:id/usar
```

**Body:**

```json
{
  "usuario_id": "uuid-del-usuario"
}
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Invitación marcada como usada exitosamente",
  "data": {
    "invitacion": {
      "id": "uuid",
      "codigo": "INV2025",
      "email": "uuid-del-usuario",
      "rol": "PRESTADOR",
      "expira_en": "2025-12-31T23:59:59.000Z",
      "usada": true,
      "creada_por": "uuid-creador",
      "creador": {
        "id": "uuid",
        "nombre": "Admin CONANP",
        "email": "admin@conanp.gob.mx"
      },
      "usuario": {
        "id": "uuid",
        "nombre": "Usuario Nuevo",
        "email": "usuario@ejemplo.com"
      }
    }
  }
}
```

### 8. Estadísticas de Invitaciones 🔒

```http
GET /api/invitaciones/estadisticas
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas de invitaciones obtenidas exitosamente",
  "data": {
    "estadisticas": {
      "generales": {
        "total": 50,
        "usadas": 15,
        "disponibles": 30,
        "expiradas": 5,
        "porcentaje_usadas": 30
      },
      "este_mes": {
        "creadas": 25,
        "usadas": 10
      },
      "top_creadores": [
        {
          "creador": {
            "id": "uuid",
            "nombre": "Admin CONANP",
            "email": "admin@conanp.gob.mx"
          },
          "total_creadas": 25
        }
      ]
    }
  }
}
```

---

## 🔑 Credenciales de Prueba

### Administrador CONANP

- **Email:** `admin@conanp.gob.mx`
- **Contraseña:** `Admin123!`

### Prestadores de Servicio

- **Email:** `juan.perez@ejemplo.com`
- **Contraseña:** `Prestador123!`

- **Email:** `maria.gonzalez@ejemplo.com`
- **Contraseña:** `Prestador123!`

- **Email:** `carlos.rodriguez@ejemplo.com`
- **Contraseña:** `Prestador123!`

### Códigos de Invitación Válidos

- `PRESTADOR001` - Para prestadores de servicio
- `PRESTADOR002` - Para prestadores de servicio
- `CONANP001` - Para administradores CONANP

---

## 📝 Notas Importantes

### Autenticación

- Todos los endpoints (excepto los marcados como 🌐) requieren el header `Authorization: Bearer <token>`
- Los tokens JWT expiran en 24 horas
- Para obtener un token, usar el endpoint de login

### Permisos

- 🔒 **Solo CONANP**: Requiere rol de administrador
- **Prestadores**: Pueden acceder a sus propios recursos y operaciones básicas
- 🌐 **Público**: No requiere autenticación

### Validaciones

- Todos los endpoints tienen validaciones robustas
- Los errores de validación devuelven códigos 400 con detalles específicos
- Los emails deben ser únicos en el sistema
- Las contraseñas deben cumplir criterios de seguridad

### Paginación

- Los endpoints de listado soportan paginación con `page` y `limit`
- El límite máximo es 100 elementos por página
- La respuesta incluye información de paginación

### Filtros

- Muchos endpoints soportan filtros por fecha, estado, tipo, etc.
- Consultar la documentación específica de cada endpoint para filtros disponibles

### Estados Comunes

- **Bloques**: `activo`, `lleno`, `suspendido_por_clima`, `cerrado_capitaria`, `plantilla`
- **Embarcaciones**: `disponible`, `en_uso`, `mantenimiento`
- **Salidas**: `programada`, `en_curso`, `completada`, `cancelada`, `cancelada_por_clima`, `cancelada_capitaria`
- **Puerto**: `abierto`, `restricciones`, `cerrado`, `emergencia`
- **Permisos**: `vigente`, `por_vencer`, `vencido`, `suspendido`

### Destinos Disponibles

- **Isla de Lobos**: Requiere `bloque_id`, validación de capacidad automática
- **Arrecife Tuxpan**: Requiere `hora`, sin restricciones de bloques
- **Arrecife de en Medio**: Requiere `hora`, sin restricciones de bloques
- **Arrecife Tanhuijo**: Requiere `hora`, sin restricciones de bloques

### Flujos de Trabajo

#### **Para Isla de Lobos:**

1. Prestador selecciona destino: "Isla de Lobos"
2. Frontend consulta: `GET /api/bloques?fecha=2025-10-15`
3. Backend devuelve 3 bloques SIEMPRE con capacidad calculada
4. Prestador selecciona bloque disponible
5. `POST /api/salidas` con `bloque_id`

#### **Para Arrecifes:**

1. Prestador selecciona destino: "Arrecife Tuxpan"
2. Prestador ingresa hora manualmente
3. `POST /api/salidas` con `hora` (sin `bloque_id`)

---

## 🚨 Códigos de Error Comunes

### 400 - Bad Request

```json
{
  "status": "error",
  "message": "Errores de validación encontrados",
  "error": "VALIDATION_ERROR",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Debe ser un email válido",
        "value": "email-invalido"
      }
    ],
    "count": 1
  }
}
```

### 401 - Unauthorized

```json
{
  "status": "error",
  "message": "Token de acceso requerido",
  "error": "UNAUTHORIZED"
}
```

### 403 - Forbidden

```json
{
  "status": "error",
  "message": "Acceso denegado. Se requiere rol de CONANP",
  "error": "FORBIDDEN"
}
```

### 404 - Not Found

```json
{
  "status": "error",
  "message": "Recurso no encontrado",
  "error": "NOT_FOUND"
}
```

### 409 - Conflict

```json
{
  "status": "error",
  "message": "El recurso ya existe",
  "error": "RESOURCE_ALREADY_EXISTS"
}
```

### 500 - Internal Server Error

```json
{
  "status": "error",
  "message": "Error interno del servidor",
  "error": "INTERNAL_SERVER_ERROR"
}
```

---

## 🔐 Recuperación de Contraseña

### Flujo Completo

1. **Solicitar Recuperación**

   ```bash
   POST /api/auth/forgot-password
   ```

   - Envía email del usuario
   - Genera token de 64 caracteres
   - Token expira en 15 minutos

2. **Resetear Contraseña**
   ```bash
   POST /api/auth/reset-password
   ```
   - Usa el token recibido
   - Establece nueva contraseña
   - Limpia el token automáticamente

### Características de Seguridad

- **Tokens seguros**: Generados con `randomBytes(32)`
- **Expiración**: 15 minutos de validez
- **Limpieza automática**: Tokens se eliminan después del uso
- **Mensajes uniformes**: Por seguridad, mismo mensaje para emails existentes/no existentes
- **Validaciones estrictas**: Contraseñas deben cumplir criterios de seguridad

---

## 💎 Sistema de Brazaletes (`/api/brazaletes`)

> **Nota:** Todas las rutas requieren autenticación. Las rutas marcadas con 🔒 requieren rol CONANP.

### 📦 Gestión de Inventario

#### 1. Obtener Inventario Actual

```http
GET /api/brazaletes/inventario
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "inventario": {
      "total_disponibles": 250,
      "por_tipo": {
        "isla": 150,
        "arrecife": 100
      },
      "stock_bajo": false,
      "lotes_activos": 5,
      "valor_inventario": 125000.0
    }
  }
}
```

#### 2. Crear Lote de Brazaletes 🔒

```http
POST /api/brazaletes/lotes
```

**Headers:** `Authorization: Bearer <token>`

**Opciones de creación:**

- **Generación automática**: Especifica solo `cantidad_total`
- **Rango personalizado**: Especifica `primer_numero` y `ultimo_numero` (se calcula automáticamente `cantidad_total`)

**Body (Generación automática):**

```json
{
  "numero_lote": "LOTE-2024-001",
  "cantidad_total": 100,
  "tipo": "universal",
  "fecha_compra": "2024-09-29T00:00:00.000Z",
  "fecha_vencimiento": "2025-09-29T00:00:00.000Z",
  "costo_unitario": 250.0,
  "precio_venta": 500.0,
  "proveedor": "Proveedor Brazaletes SA",
  "observaciones": "Lote para temporada alta"
}
```

**Nota:** El campo `fecha_vencimiento` es opcional. Si no se proporciona, el lote no tendrá fecha de vencimiento.

**Body (Rango personalizado):**

```json
{
  "numero_lote": "LOTE-2024-002",
  "primer_numero": 1000,
  "ultimo_numero": 1099,
  "tipo": "universal",
  "fecha_compra": "2024-09-29T00:00:00.000Z",
  "costo_unitario": 250.0,
  "precio_venta": 500.0,
  "proveedor": "Proveedor Brazaletes SA",
  "observaciones": "Lote con numeración específica"
}
```

**Ejemplo sin fecha de vencimiento:**

```json
{
  "numero_lote": "LOTE-2024-003",
  "cantidad_total": 50,
  "tipo": "universal",
  "fecha_compra": "2024-09-29T00:00:00.000Z",
  "costo_unitario": 250.0,
  "precio_venta": 500.0,
  "proveedor": "Proveedor Brazaletes SA"
}
```

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "data": {
    "lote": {
      "id": "uuid",
      "numero_lote": "LOTE-2024-001",
      "cantidad_total": 100,
      "cantidad_disponibles": 100,
      "cantidad_vendidos": 0,
      "cantidad_utilizados": 0,
      "tipo": "universal",
      "fecha_compra": "2024-09-29T00:00:00.000Z",
      "fecha_vencimiento": "2025-09-29T00:00:00.000Z",
      "costo_unitario": 250.0,
      "precio_venta": 500.0,
      "proveedor": "Proveedor Brazaletes SA",
      "estado": "activo",
      "observaciones": "Lote para temporada alta",
      "created_at": "2024-09-29T12:00:00.000Z",
      "updated_at": "2024-09-29T12:00:00.000Z"
    },
    "brazaletes_generados": 100,
    "rango_numeros": {
      "primer_numero": 1000,
      "ultimo_numero": 1099,
      "año": 2024
    },
    "message": "Lote creado exitosamente"
  }
}
```

#### 3. Listar Lotes

```http
GET /api/brazaletes/lotes?page=1&limit=10&tipo=isla&estado=activo
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "lotes": [
      {
        "id": "uuid",
        "numero_lote": "LOTE-2024-001",
        "cantidad_total": 100,
        "cantidad_disponibles": 75,
        "cantidad_vendidos": 25,
        "cantidad_utilizados": 15,
        "tipo": "universal",
        "fecha_compra": "2024-09-29T00:00:00.000Z",
        "fecha_vencimiento": "2025-09-29T00:00:00.000Z",
        "costo_unitario": 250.0,
        "precio_venta": 500.0,
        "proveedor": "Proveedor Brazaletes SA",
        "estado": "activo",
        "observaciones": "Lote para temporada alta",
        "created_at": "2024-09-29T12:00:00.000Z",
        "updated_at": "2024-09-29T12:00:00.000Z",
        "brazaletes": [
          {
            "id": "uuid-brazalete",
            "estado": "asignado"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### 💰 Venta a Prestadores

#### 4. Vender Brazaletes a Prestador 🔒

```http
POST /api/brazaletes/venta
```

**Headers:** `Authorization: Bearer <token>`

**Nota importante:** Las ventas de brazaletes solo pueden ser realizadas por personal de CONANP, ya que el pago debe procesarse mediante formatos gubernamentales oficiales. Los prestadores no tienen acceso directo a esta funcionalidad.

**Flujo de estados:** Después de la venta, los brazaletes mantienen el estado `disponible` hasta que se asignen a una salida específica.

**Body:**

```json
{
  "prestador_id": "uuid-prestador",
  "cantidad": 10,
  "tipo": "universal",
  "metodo_pago": "transferencia"
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "venta": {
      "id": "uuid",
      "prestador_id": "uuid-prestador",
      "lote_id": "uuid-lote",
      "cantidad": 10,
      "precio_unitario": 500.0,
      "total": 5000.0,
      "fecha_venta": "2024-09-29T12:00:00.000Z",
      "metodo_pago": "transferencia",
      "estado_pago": "pendiente"
    },
    "rango_brazaletes": {
      "numero_inicial": 1001,
      "numero_final": 1010,
      "cantidad_total": 10,
      "primer_codigo": "BRZ-2024-001001",
      "ultimo_codigo": "BRZ-2024-001010"
    },
    "brazaletes_asignados": [
      "BRZ-2024-001001",
      "BRZ-2024-001002",
      "BRZ-2024-001003",
      "BRZ-2024-001004",
      "BRZ-2024-001005",
      "BRZ-2024-001006",
      "BRZ-2024-001007",
      "BRZ-2024-001008",
      "BRZ-2024-001009",
      "BRZ-2024-001010"
    ],
    "prestador": {
      "id": "uuid-prestador",
      "nombre": "Juan Pérez",
      "email": "juan@prestador.com"
    },
    "lote": {
      "numero_lote": "LOTE-2024-001",
      "tipo": "universal"
    },
    "message": "Venta realizada exitosamente"
  }
}
```

#### 5. Obtener Brazaletes de un Prestador

```http
GET /api/brazaletes/prestador/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "prestador": {
      "id": "uuid-prestador",
      "nombre": "Juan Pérez",
      "email": "juan@prestador.com"
    },
    "brazaletes": {
      "disponibles": 25,
      "asignados": 25,
      "utilizados": 15,
      "por_tipo": {
        "isla": 20,
        "arrecife": 20
      }
    },
    "detalle": [
      {
        "id": "uuid-brazalete",
        "codigo": "BRZ-2024-000001",
        "tipo": "universal",
        "estado": "asignado",
        "precio": 500.0,
        "fecha_creacion": "2024-09-29T00:00:00.000Z",
        "fecha_asignacion": "2024-09-29T12:00:00.000Z",
        "fecha_uso": null,
        "turista_nacionalidad": null,
        "turista_edad": null,
        "lote": {
          "numero_lote": "LOTE-2024-001",
          "tipo": "isla"
        },
        "salida": null
      }
    ]
  }
}
```

#### 6. Mis Brazaletes (Prestador Autenticado)

```http
GET /api/brazaletes/mis-brazaletes
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Obtiene todos los brazaletes del prestador autenticado con estadísticas detalladas. Incluye conteos correctos de brazaletes disponibles, asignados y utilizados.

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "prestador": {
      "id": "uuid-prestador",
      "nombre": "Juan Pérez",
      "email": "juan@prestador.com"
    },
    "brazaletes": {
      "disponibles": 15,
      "asignados": 10,
      "utilizados": 15,
      "por_tipo": {
        "universal": 40
      }
    },
    "detalle": [
      {
        "id": "uuid-brazalete",
        "codigo": "BRZ-2024-000001",
        "tipo": "universal",
        "estado": "asignado",
        "precio": 500.0,
        "fecha_creacion": "2024-09-29T00:00:00.000Z",
        "fecha_asignacion": "2024-09-29T12:00:00.000Z",
        "fecha_uso": null,
        "turista_nacionalidad": null,
        "turista_edad": null,
        "lote": {
          "numero_lote": "LOTE-2024-001",
          "tipo": "isla"
        },
        "salida": null
      }
    ]
  }
}
```

### 🚢 Uso en Salidas

#### 7. Asignar Brazaletes a Salida

```http
POST /api/brazaletes/asignar
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Asigna brazaletes disponibles del prestador a una salida específica. Los brazaletes cambian de estado `disponible` a `asignado`.

**Validación de fecha_asignacion:**

- Permite fechas anteriores hasta 30 días en el pasado
- Permite fechas futuras hasta 7 días en el futuro
- Formato requerido: ISO 8601

**Body:**

```json
{
  "salida_id": "uuid-salida",
  "cantidad": 25,
  "fecha_asignacion": "2024-12-31T08:00:00.000Z"
}
```

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "25 brazaletes asignados exitosamente a la salida",
  "data": {
    "salida_id": "uuid-salida",
    "cantidad_asignada": 25,
    "fecha_asignacion": "2024-12-31T08:00:00.000Z",
    "brazaletes": [
      {
        "id": "uuid-brazalete",
        "codigo": "BRZ-2024-000001",
        "tipo": "universal",
        "estado": "asignado",
        "fecha_asignacion": "2024-12-31T08:00:00.000Z",
        "salida_id": "uuid-salida"
      }
    ]
  }
}
```

#### 8. Registrar Uso de Brazaletes en Salida

```http
POST /api/brazaletes/uso
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Registra el uso de brazaletes asignados en una salida. Los brazaletes cambian de estado `asignado` a `utilizado` cuando la salida se marca como completada.

**Body:**

```json
{
  "salida_id": "uuid-salida",
  "brazaletes": [
    {
      "codigo": "BRZ-2024-000001",
      "turista_nacionalidad": "nacional",
      "turista_edad": 35
    },
    {
      "codigo": "BRZ-2024-000002",
      "turista_nacionalidad": "internacional",
      "turista_edad": 42
    }
  ]
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "salida_id": "uuid-salida",
    "brazaletes_utilizados": 2,
    "errores": null,
    "message": "2 brazaletes utilizados exitosamente. Los brazaletes cambiarán a estado 'utilizado' cuando la salida se marque como completada."
  }
}
```

#### 9. Obtener Brazaletes Utilizados en una Salida

```http
GET /api/brazaletes/uso/salida/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "salida": {
      "id": "uuid-salida",
      "fecha": "2024-09-29",
      "numero_pasajeros": 25
    },
    "brazaletes_utilizados": [
      {
        "id": "uuid-brazalete",
        "codigo": "BRZ-2024-000001",
        "tipo": "universal",
        "estado": "utilizado",
        "precio": 500.0,
        "fecha_uso": "2024-09-29T14:00:00.000Z",
        "turista_nacionalidad": "nacional",
        "turista_edad": 35,
        "lote": {
          "numero_lote": "LOTE-2024-001",
          "tipo": "isla"
        },
        "prestador": {
          "nombre": "Juan Pérez",
          "email": "juan@prestador.com"
        }
      }
    ],
    "estadisticas": {
      "total_brazaletes": 2,
      "por_nacionalidad": {
        "locales": 0,
        "nacionales": 1,
        "internacionales": 1
      }
    }
  }
}
```

### 📊 Estadísticas y Reportes

#### 10. Obtener Estadísticas Generales

```http
GET /api/brazaletes/estadisticas?fecha_inicio=2024-09-01&fecha_fin=2024-09-30
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "periodo": {
      "fecha_inicio": "2024-09-01",
      "fecha_fin": "2024-09-30"
    },
    "inventario": {
      "total_comprados": 500,
      "total_disponibles": 250,
      "total_vendidos": 200,
      "total_utilizados": 150
    },
    "ingresos": {
      "ventas_totales": 100000.0,
      "por_mes": [
        {
          "mes": "2024-09",
          "cantidad": 200,
          "monto": 100000.0
        }
      ]
    },
    "utilizacion": {
      "por_tipo": {
        "isla": 90,
        "arrecife": 60
      },
      "por_nacionalidad": {
        "locales": 50,
        "nacionales": 70,
        "internacionales": 30
      }
    }
  }
}
```

#### 11. Obtener Alertas del Sistema

```http
GET /api/brazaletes/alertas
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "alertas": [
      {
        "tipo": "stock_bajo",
        "severidad": "alta",
        "mensaje": "Solo quedan 25 brazaletes disponibles (5% del inventario)",
        "fecha": "2024-09-29T12:00:00.000Z"
      },
      {
        "tipo": "lote_por_vencer",
        "severidad": "media",
        "mensaje": "Lote LOTE-2024-001 vence en 15 días",
        "fecha": "2024-09-29T12:00:00.000Z"
      },
      {
        "tipo": "prestador_sin_stock",
        "severidad": "media",
        "mensaje": "Juan Pérez tiene solo 3 brazaletes disponibles",
        "fecha": "2024-09-29T12:00:00.000Z"
      }
    ]
  }
}
```

#### 12. Generar Reporte de Ventas

```http
GET /api/brazaletes/reportes/ventas?fecha_inicio=2024-09-01&fecha_fin=2024-09-30&prestador_id=uuid
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "periodo": {
      "fecha_inicio": "2024-09-01",
      "fecha_fin": "2024-09-30"
    },
    "resumen": {
      "total_ventas": 15,
      "total_brazaletes": 200,
      "total_ingresos": 100000.0
    },
    "ventas_detalle": [
      {
        "id": "uuid-venta",
        "prestador_id": "uuid-prestador",
        "lote_id": "uuid-lote",
        "cantidad": 10,
        "precio_unitario": 500.0,
        "total": 5000.0,
        "fecha_venta": "2024-09-15T12:00:00.000Z",
        "metodo_pago": "transferencia",
        "estado_pago": "pagado",
        "prestador": {
          "nombre": "Juan Pérez",
          "email": "juan@prestador.com",
          "telefono": "+52 229 123 4567"
        },
        "lote": {
          "numero_lote": "LOTE-2024-001",
          "tipo": "isla"
        }
      }
    ],
    "ventas_por_prestador": [
      {
        "prestador": {
          "nombre": "Juan Pérez",
          "email": "juan@prestador.com"
        },
        "total_ventas": 3,
        "total_brazaletes": 30,
        "total_ingresos": 15000.0
      }
    ]
  }
}
```

#### 13. Generar Reporte de Utilización

```http
GET /api/brazaletes/reportes/utilizacion?fecha_inicio=2024-09-01&fecha_fin=2024-09-30&tipo=isla
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "periodo": {
      "fecha_inicio": "2024-09-01",
      "fecha_fin": "2024-09-30"
    },
    "resumen": {
      "total_utilizados": 150,
      "por_nacionalidad": {
        "locales": 50,
        "nacionales": 70,
        "internacionales": 30,
        "sin_especificar": 0
      },
      "por_tipo": {
        "isla": 90,
        "arrecife": 60
      },
      "estadisticas_edad": {
        "promedio": 32,
        "minima": 18,
        "maxima": 65,
        "total_con_edad": 140
      }
    },
    "utilizacion_detalle": [
      {
        "id": "uuid-brazalete",
        "codigo": "BRZ-2024-000001",
        "tipo": "universal",
        "estado": "utilizado",
        "precio": 500.0,
        "fecha_uso": "2024-09-15T14:00:00.000Z",
        "turista_nacionalidad": "nacional",
        "turista_edad": 35,
        "prestador": {
          "nombre": "Juan Pérez",
          "email": "juan@prestador.com"
        },
        "lote": {
          "numero_lote": "LOTE-2024-001",
          "tipo": "isla"
        }
      }
    ]
  }
}
```

### 🔧 Utilidades

#### 14. Dashboard para CONANP 🔒

```http
GET /api/brazaletes/dashboard
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "inventario": {
      "total_disponibles": 250,
      "por_tipo": {
        "isla": 150,
        "arrecife": 100
      },
      "stock_bajo": false,
      "lotes_activos": 5,
      "valor_inventario": 125000.0
    }
  }
}
```

#### 15. Búsqueda de Brazaletes

```http
GET /api/brazaletes/search?codigo=BRZ-2024-000001&tipo=universal&estado=asignado&prestador_id=uuid&page=1&limit=20
```

**Headers:** `Authorization: Bearer <token>`

**Descripción:** Buscar brazaletes por múltiples filtros con paginación y estadísticas. Los prestadores solo pueden ver sus propios brazaletes.

**Parámetros de Query:**

- `codigo` (opcional): Código exacto del brazalete (formato: BRZ-YYYY-NNNNNN)
- `tipo` (opcional): Tipo de brazalete (`universal`)
- `estado` (opcional): Estado del brazalete (`disponible`, `asignado`, `utilizado`, `perdido`)
- `prestador_id` (opcional): ID del prestador (UUID)
- `lote_id` (opcional): ID del lote (UUID)
- `salida_id` (opcional): ID de la salida (UUID)
- `fecha_inicio` (opcional): Fecha de inicio del rango (ISO8601)
- `fecha_fin` (opcional): Fecha de fin del rango (ISO8601)
- `turista_nacionalidad` (opcional): Nacionalidad del turista (`local`, `nacional`, `internacional`)
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 20, max: 100)

**Control de Acceso:**

- **CONANP**: Puede buscar todos los brazaletes
- **Prestadores**: Solo pueden ver sus propios brazaletes (automáticamente filtrado por `prestador_id`)

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Se encontraron 15 brazaletes",
  "data": {
    "brazaletes": [
      {
        "id": "uuid-brazalete-1",
        "codigo": "BRZ-2024-000001",
        "tipo": "universal",
        "estado": "asignado",
        "precio": 500.0,
        "fecha_creacion": "2024-09-29T00:00:00.000Z",
        "fecha_asignacion": "2024-09-29T12:00:00.000Z",
        "fecha_uso": null,
        "prestador_id": "uuid-prestador",
        "salida_id": null,
        "turista_nacionalidad": null,
        "turista_edad": null,
        "lote_id": "uuid-lote",
        "created_at": "2024-09-29T00:00:00.000Z",
        "updated_at": "2024-09-29T12:00:00.000Z",
        "lote": {
          "id": "uuid-lote",
          "numero_lote": "LOTE-2024-001",
          "tipo": "universal",
          "fecha_compra": "2024-09-29T00:00:00.000Z"
        },
        "prestador": {
          "id": "uuid-prestador",
          "nombre": "Juan Pérez",
          "email": "juan@prestador.com"
        },
        "salida": null
      },
      {
        "id": "uuid-brazalete-2",
        "codigo": "BRZ-2024-000002",
        "tipo": "universal",
        "estado": "utilizado",
        "precio": 500.0,
        "fecha_creacion": "2024-09-29T00:00:00.000Z",
        "fecha_asignacion": "2024-09-29T12:00:00.000Z",
        "fecha_uso": "2024-09-29T14:00:00.000Z",
        "prestador_id": "uuid-prestador",
        "salida_id": "uuid-salida",
        "turista_nacionalidad": "nacional",
        "turista_edad": 35,
        "lote_id": "uuid-lote",
        "created_at": "2024-09-29T00:00:00.000Z",
        "updated_at": "2024-09-29T14:00:00.000Z",
        "lote": {
          "id": "uuid-lote",
          "numero_lote": "LOTE-2024-001",
          "tipo": "universal",
          "fecha_compra": "2024-09-29T00:00:00.000Z"
        },
        "prestador": {
          "id": "uuid-prestador",
          "nombre": "Juan Pérez",
          "email": "juan@prestador.com"
        },
        "salida": {
          "id": "uuid-salida",
          "fecha": "2024-09-29",
          "numero_pasajeros": 25
        }
      }
    ],
    "estadisticas": {
      "total_encontrados": 15,
      "por_estado": {
        "disponible": 5,
        "asignado": 8,
        "utilizado": 2,
        "perdido": 0
      },
      "por_nacionalidad": {
        "local": 0,
        "nacional": 1,
        "internacional": 1
      }
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    },
    "filtros_aplicados": {
      "codigo": "BRZ-2024-000001",
      "tipo": "universal",
      "estado": "asignado",
      "prestador_id": "uuid-prestador",
      "lote_id": null,
      "salida_id": null,
      "fecha_inicio": null,
      "fecha_fin": null,
      "turista_nacionalidad": null
    }
  }
}
```

**Ejemplos de Uso:**

```http
# Búsqueda por código específico
GET /api/brazaletes/search?codigo=BRZ-2024-000001

# Búsqueda por estado
GET /api/brazaletes/search?estado=disponible

# Búsqueda por prestador
GET /api/brazaletes/search?prestador_id=uuid-prestador

# Búsqueda por rango de fechas
GET /api/brazaletes/search?fecha_inicio=2024-09-01T00:00:00.000Z&fecha_fin=2024-09-30T23:59:59.999Z

# Búsqueda por nacionalidad del turista
GET /api/brazaletes/search?turista_nacionalidad=internacional

# Búsqueda con paginación
GET /api/brazaletes/search?page=2&limit=10

# Búsqueda combinada
GET /api/brazaletes/search?estado=utilizado&turista_nacionalidad=nacional&page=1&limit=5
```

**Errores Comunes:**

```json
// Error: Código con formato incorrecto
{
  "success": false,
  "message": "El código del brazalete debe tener el formato BRZ-YYYY-NNNNNN",
  "error": "VALIDATION_ERROR"
}

// Error: Estado inválido
{
  "success": false,
  "message": "El estado debe ser 'disponible', 'asignado', 'utilizado' o 'perdido'",
  "error": "VALIDATION_ERROR"
}

// Error: UUID inválido
{
  "success": false,
  "message": "El ID del prestador debe ser un UUID válido",
  "error": "VALIDATION_ERROR"
}

// Error: Fecha de fin anterior a fecha de inicio
{
  "success": false,
  "message": "La fecha de fin debe ser posterior a la fecha de inicio",
  "error": "VALIDATION_ERROR"
}
```

**Características de la Búsqueda:**

- ✅ **Filtros Combinables**: Todos los filtros se pueden combinar
- ✅ **Paginación**: Soporte completo de paginación con metadatos
- ✅ **Estadísticas**: Estadísticas automáticas de los resultados
- ✅ **Control de Acceso**: Prestadores solo ven sus brazaletes
- ✅ **Includes Relacionados**: Incluye información de lote, prestador y salida
- ✅ **Ordenamiento**: Ordenado por fecha de creación (desc) y código (asc)
- ✅ **Validaciones Robustas**: Validación de todos los parámetros
- ✅ **Filtros Aplicados**: Respuesta incluye los filtros que se aplicaron

#### 16. Health Check del Sistema

```http
GET /api/brazaletes/health
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Sistema de brazaletes operativo",
  "timestamp": "2024-09-29T12:00:00.000Z"
}
```

### Estados y Enumeraciones

#### Estados de Lotes

- `activo` - Lote disponible para venta
- `agotado` - Lote sin brazaletes disponibles
- `vencido` - Lote expirado por fecha de vencimiento
- `cancelado` - Lote cancelado manualmente

#### Estados de Brazaletes

- `disponible` - Brazalete en inventario de CONANP, no asignado
- `asignado` - Brazalete vendido a prestador y asignado a una salida específica
- `utilizado` - Brazalete usado en una salida completada
- `perdido` - Brazalete reportado como perdido

#### Flujo de Estados de Brazaletes

1. **Venta de brazaletes**: Estado permanece `disponible`
2. **Asignación a salida**: Estado cambia a `asignado`
3. **Salida completada**: Estado cambia a `utilizado`

#### Estados de Pago (Ventas)

- `pendiente` - Venta pendiente de pago
- `pagado` - Venta pagada completamente
- `cancelado` - Venta cancelada

#### Tipos de Brazaletes

- `universal` - Brazaletes universales para todas las actividades (isla y arrecife)

#### Métodos de Pago

- `efectivo` - Pago en efectivo
- `transferencia` - Transferencia bancaria
- `credito` - Tarjeta de crédito
- `debito` - Tarjeta de débito

#### Nacionalidades de Turistas

- `local` - Turista local (Veracruz)
- `nacional` - Turista nacional (México)
- `internacional` - Turista extranjero

### Códigos de Brazaletes

Los códigos de brazaletes siguen el formato: `BRZ-YYYY-NNNNNN`

- **BRZ**: Prefijo identificador
- **YYYY**: Año de creación
- **NNNNNN**: Número secuencial de 6 dígitos

**Ejemplos:**

- `BRZ-2024-000001`
- `BRZ-2024-000025`
- `BRZ-2025-000001`

---

**Última actualización:** 9 de Octubre, 2025  
**Versión:** 4.3.0 - Integración con SMN-CONAGUA para datos meteorológicos en tiempo real

### 🆕 Novedades en v4.3.0

#### **Integración con SMN-CONAGUA** 🌤️

- ✅ **API Oficial del Gobierno**: Conexión directa con Servicio Meteorológico Nacional
- ✅ **Datos de Tuxpan, Veracruz**: Pronósticos específicos para Isla de Lobos
- ✅ **Actualización en Tiempo Real**: Hasta 48 horas de pronóstico
- ✅ **Cálculos Automáticos**: Oleaje, visibilidad y estado del puerto
- ✅ **Escala de Beaufort**: Estimación científica de condiciones marítimas
- ✅ **Sincronización Inteligente**: Crea o actualiza según sea necesario
- ✅ **Endpoint Nuevo**: `POST /api/clima/sincronizar-smn`

#### **Datos Meteorológicos Mejorados**

- 🌡️ **Temperatura**: Actual, máxima y mínima
- 💨 **Viento**: Velocidad, dirección y ráfagas
- 🌧️ **Precipitación**: Probabilidad y cantidad esperada
- 💧 **Humedad**: Porcentaje de humedad relativa
- ☁️ **Cielo**: Descripción detallada del estado
- 📍 **Geolocalización**: Coordenadas específicas de la región

### 🆕 Novedades en v4.2.0

#### **Información de Embarcaciones Ocupadas por Bloque**

- ✅ **Filtrado por Bloque**: Cada bloque incluye las embarcaciones del prestador que ya están ocupadas en ese bloque específico
- ✅ **Información Contextual**: Muestra detalles completos de las salidas programadas por el prestador
- ✅ **Prevención de Conflictos**: El frontend puede filtrar embarcaciones disponibles por bloque
- ✅ **Transparencia Total**: El prestador ve exactamente qué embarcaciones tiene ocupadas en cada bloque
- ✅ **Optimización de Consultas**: Una sola consulta obtiene toda la información necesaria

#### **Mejoras en UX de Formularios**

- ✅ **Filtrado Inteligente**: El frontend puede excluir embarcaciones ocupadas en el bloque seleccionado
- ✅ **Información Detallada**: Muestra el estado y detalles de salidas existentes
- ✅ **Experiencia Fluida**: Evita errores de validación al crear salidas
- ✅ **Contexto Específico**: Información relevante solo para el bloque seleccionado

### 🆕 Novedades en v4.1.0

#### **Liberación Automática de Embarcaciones**

- ✅ **Liberación Automática**: Las embarcaciones se liberan automáticamente al completar salidas
- ✅ **Validación Inteligente**: Solo libera si no hay otras salidas activas
- ✅ **Estados Sincronizados**: Embarcaciones y salidas mantienen estados consistentes
- ✅ **Prevención de Conflictos**: Evita que una embarcación esté en múltiples salidas

#### **Gestión Mejorada de Estados**

- ✅ **Flujo Completo**: `programada` → `en_progreso` → `completada`
- ✅ **Estados de Cancelación**: `cancelada`, `cancelada_por_clima`, `cancelada_capitaria`
- ✅ **Validaciones Automáticas**: Verifica disponibilidad antes de crear/actualizar salidas
- ✅ **Liberación Condicional**: Libera embarcación solo cuando es seguro

#### **Bloques Dinámicos por Fecha**

- ✅ **Creación Automática**: Los bloques se crean automáticamente para fechas específicas
- ✅ **Límite de 7 Días**: Previene saturación de la base de datos
- ✅ **Validación de Fechas**: No permite fechas pasadas o muy futuras
- ✅ **Cálculo en Tiempo Real**: Capacidad y estados se calculan dinámicamente

### 🆕 Novedades en v4.0.0

#### **Sistema de Destinos Múltiples**

- ✅ Soporte para Isla de Lobos + 3 Arrecifes
- ✅ Validación condicional según destino
- ✅ Bloques predefinidos permanentes
- ✅ Capacidad calculada en tiempo real

#### **Bloques Predefinidos**

- ✅ 3 bloques siempre disponibles
- ✅ No más "No hay bloques para esta fecha"
- ✅ Capacidad dinámica basada en salidas registradas
- ✅ Estados automáticos (activo/lleno/cerrado)

#### **Flujos Diferenciados**

- ✅ **Isla de Lobos**: Con bloques horarios y validación de capacidad
- ✅ **Arrecifes**: Con hora libre y sin restricciones de bloques
- ✅ Backend maneja toda la lógica de negocio automáticamente

#### **Mejoras de UX**

- ✅ Endpoints más intuitivos y consistentes
- ✅ Respuestas estructuradas con información completa
- ✅ Validaciones robustas con mensajes claros
- ✅ Soporte completo para múltiples tipos de salidas

---

## 📱 Notificaciones WhatsApp (`/api/notificaciones`)

**Proveedor**: Twilio WhatsApp API  
**Acceso**: Solo usuarios con rol CONANP  
**Total de Endpoints**: 8

### 1. Verificar Estado del Servicio

Verifica si el servicio de WhatsApp está configurado correctamente.

```http
GET /api/notificaciones/estado
```

**Headers:**

```
Authorization: Bearer <token_conanp>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Servicio de WhatsApp configurado y listo",
  "data": {
    "configurado": true,
    "proveedor": "Twilio"
  }
}
```

**Respuesta - Servicio No Configurado (200):**

```json
{
  "status": "success",
  "message": "Servicio de WhatsApp no configurado",
  "data": {
    "configurado": false,
    "proveedor": "Twilio"
  }
}
```

**Estructura para Frontend:**

```typescript
interface EstadoServicioWhatsApp {
  configurado: boolean;
  proveedor: string;
}
```

---

### 2. Enviar Notificación Individual

Envía un mensaje de WhatsApp a un número específico.

```http
POST /api/notificaciones/enviar
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "telefono": "2291234567",
  "mensaje": "🌊 Alerta: Puerto cerrado por condiciones meteorológicas",
  "tipo": "alerta_clima",
  "prioridad": "urgente"
}
```

**Parámetros:**

- `telefono` (string, requerido): Número de 10 dígitos (formato México, se agregará automáticamente +521)
- `mensaje` (string, requerido): Contenido del mensaje (10-1600 caracteres)
- `tipo` (enum, opcional): Tipo de notificación (default: recordatorio_generico)
  - Valores: `alerta_clima`, `permiso_por_vencer`, `permiso_vencido`, `confirmacion_salida`, `cancelacion_salida`, `stock_brazaletes_bajo`, `resumen_diario`, `bienvenida`, `recordatorio_generico`
- `prioridad` (enum, opcional): Prioridad de la notificación
  - Valores: `urgente`, `alta`, `media`, `baja`
- `datos_adicionales` (object, opcional): Datos adicionales personalizados

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Notificación enviada exitosamente",
  "data": {
    "notificacion": {
      "success": true,
      "message_id": "SM1234567890abcdef",
      "telefono": "whatsapp:+522291234567",
      "estado": "enviado",
      "fecha_envio": "2025-10-13T14:30:00.000Z"
    }
  }
}
```

**Respuesta de Error (500):**

```json
{
  "status": "error",
  "message": "Error al enviar notificación",
  "error": "Descripción del error de Twilio"
}
```

**Estructura para Frontend:**

```typescript
interface NotificacionRequest {
  telefono: string;
  mensaje: string;
  tipo?: TipoNotificacion;
  prioridad?: PrioridadNotificacion;
  datos_adicionales?: Record<string, any>;
}

interface NotificacionResponse {
  success: boolean;
  message_id?: string;
  telefono: string;
  estado: EstadoNotificacion;
  fecha_envio: string;
  error?: string;
}

type TipoNotificacion =
  | "alerta_clima"
  | "permiso_por_vencer"
  | "permiso_vencido"
  | "confirmacion_salida"
  | "cancelacion_salida"
  | "stock_brazaletes_bajo"
  | "resumen_diario"
  | "bienvenida"
  | "recordatorio_generico";

type PrioridadNotificacion = "urgente" | "alta" | "media" | "baja";

type EstadoNotificacion =
  | "pendiente"
  | "enviado"
  | "entregado"
  | "leido"
  | "fallido"
  | "reintentando";
```

---

### 3. Enviar Notificaciones Masivas

Envía el mismo mensaje a múltiples usuarios.

```http
POST /api/notificaciones/enviar-masivo
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "usuarios_ids": ["uuid-usuario-1", "uuid-usuario-2", "uuid-usuario-3"],
  "mensaje": "📊 Recordatorio: Reporte mensual pendiente",
  "tipo": "recordatorio_generico"
}
```

**Parámetros:**

- `usuarios_ids` (array, requerido): Array de UUIDs de usuarios
- `mensaje` (string, requerido): Contenido del mensaje
- `tipo` (enum, opcional): Tipo de notificación
- `plantilla` (string, opcional): Nombre de plantilla a usar

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Notificaciones masivas procesadas",
  "data": {
    "resumen": {
      "total": 3,
      "enviados": 3,
      "fallidos": 0
    },
    "resultados": [
      {
        "success": true,
        "message_id": "SM123abc...",
        "telefono": "whatsapp:+522291234567",
        "estado": "enviado",
        "fecha_envio": "2025-10-13T14:30:00.000Z"
      },
      {
        "success": true,
        "message_id": "SM456def...",
        "telefono": "whatsapp:+522299876543",
        "estado": "enviado",
        "fecha_envio": "2025-10-13T14:30:01.000Z"
      },
      {
        "success": false,
        "telefono": "",
        "estado": "fallido",
        "fecha_envio": "2025-10-13T14:30:02.000Z",
        "error": "Usuario sin número de teléfono registrado"
      }
    ]
  }
}
```

**Respuesta de Error (400):**

```json
{
  "status": "error",
  "message": "Ninguno de los usuarios tiene teléfono registrado"
}
```

**Estructura para Frontend:**

```typescript
interface NotificacionMasivaRequest {
  usuarios_ids: string[];
  mensaje: string;
  tipo?: TipoNotificacion;
  plantilla?: string;
}

interface NotificacionMasivaResponse {
  resumen: {
    total: number;
    enviados: number;
    fallidos: number;
  };
  resultados: NotificacionResponse[];
}
```

---

### 4. Enviar Alerta de Clima

Envía alerta meteorológica a todos los prestadores activos.

```http
POST /api/notificaciones/alerta-clima
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "estado_puerto": "cerrado",
  "oleaje": 2.5,
  "viento_velocidad": 45,
  "mensaje_adicional": "Se espera que las condiciones mejoren en 6 horas"
}
```

**Parámetros:**

- `estado_puerto` (enum, requerido): Estado del puerto
  - Valores: `abierto`, `restricciones`, `cerrado`, `emergencia`
- `oleaje` (number, requerido): Altura de olas en metros (0-10)
- `viento_velocidad` (number, requerido): Velocidad del viento en km/h (0-200)
- `mensaje_adicional` (string, opcional): Información adicional (max 500 caracteres)

**Ejemplo de Mensaje Enviado:**

```
🔴 *ALERTA METEOROLÓGICA - CONANP*

Estado del puerto: *CERRADO*
Oleaje: 2.5m
Viento: 45 km/h

Se espera que las condiciones mejoren en 6 horas

⚠️ Por favor, tome las precauciones necesarias.
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Alerta de clima enviada a prestadores",
  "data": {
    "resumen": {
      "total": 15,
      "enviados": 15,
      "fallidos": 0
    },
    "resultados": [
      {
        "success": true,
        "message_id": "SM789ghi...",
        "telefono": "whatsapp:+522291234567",
        "estado": "enviado",
        "fecha_envio": "2025-10-13T14:30:00.000Z"
      }
      // ... más resultados
    ]
  }
}
```

**Respuesta de Error (400):**

```json
{
  "status": "error",
  "message": "No hay prestadores activos con teléfono registrado"
}
```

**Estructura para Frontend:**

```typescript
interface AlertaClimaRequest {
  estado_puerto: EstadoPuerto;
  oleaje: number;
  viento_velocidad: number;
  mensaje_adicional?: string;
}

type EstadoPuerto = "abierto" | "restricciones" | "cerrado" | "emergencia";
```

---

### 5. Enviar Alertas de Permisos

Notifica a prestadores con permisos próximos a vencer.

```http
POST /api/notificaciones/alerta-permisos
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "dias_anticipacion": 30
}
```

**Parámetros:**

- `dias_anticipacion` (number, opcional): Días antes del vencimiento (1-90, default: 30)

**Ejemplo de Mensaje Enviado:**

```
⚠️ *IMPORTANTE - CONANP - Isla Lobos*

Hola Juan Pérez,

Tu permiso de operación vence en *30 días*.
Fecha de vencimiento: 2025-11-12

Por favor, renueva tu permiso a la brevedad para continuar operando.

_Para más información, contacta a CONANP._
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Alertas de permisos enviadas",
  "data": {
    "resumen": {
      "total": 5,
      "enviados": 5,
      "fallidos": 0
    },
    "resultados": [
      {
        "success": true,
        "message_id": "SM101jkl...",
        "telefono": "whatsapp:+522291234567",
        "estado": "enviado",
        "fecha_envio": "2025-10-13T14:30:00.000Z"
      }
      // ... más resultados
    ]
  }
}
```

**Respuesta - Sin Permisos por Vencer (200):**

```json
{
  "status": "success",
  "message": "No hay permisos próximos a vencer",
  "data": {
    "resumen": {
      "total": 0,
      "enviados": 0,
      "fallidos": 0
    }
  }
}
```

**Estructura para Frontend:**

```typescript
interface AlertaPermisosRequest {
  dias_anticipacion?: number;
}

interface ResumenEnvio {
  total: number;
  enviados: number;
  fallidos: number;
}
```

---

### 6. Obtener Plantillas de Mensajes

Lista las plantillas predefinidas disponibles.

```http
GET /api/notificaciones/plantillas
```

**Headers:**

```
Authorization: Bearer <token_conanp>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Plantillas de notificaciones obtenidas",
  "data": {
    "plantillas": [
      {
        "tipo": "alerta_clima",
        "titulo": "Alerta Meteorológica",
        "plantilla": "🌊 *ALERTA METEOROLÓGICA*\nEstado: {estado}\nOleaje: {oleaje}m\nViento: {viento} km/h",
        "variables": ["estado", "oleaje", "viento"],
        "ejemplo": "🌊 *ALERTA METEOROLÓGICA*\nEstado: CERRADO\nOleaje: 2.5m\nViento: 45 km/h"
      },
      {
        "tipo": "permiso_por_vencer",
        "titulo": "Permiso por Vencer",
        "plantilla": "⚠️ *PERMISO POR VENCER*\nHola {nombre},\nTu permiso vence en {dias} días.\nFecha: {fecha}",
        "variables": ["nombre", "dias", "fecha"],
        "ejemplo": "⚠️ *PERMISO POR VENCER*\nHola Juan Pérez,\nTu permiso vence en 15 días.\nFecha: 2025-10-28"
      },
      {
        "tipo": "confirmacion_salida",
        "titulo": "Confirmación de Salida",
        "plantilla": "✅ *SALIDA REGISTRADA*\nDestino: {destino}\nFecha: {fecha}\nPasajeros: {pasajeros}",
        "variables": ["destino", "fecha", "pasajeros"],
        "ejemplo": "✅ *SALIDA REGISTRADA*\nDestino: Isla de Lobos\nFecha: 2025-10-13\nPasajeros: 12"
      }
    ],
    "total": 3
  }
}
```

**Estructura para Frontend:**

```typescript
interface PlantillaNotificacion {
  tipo: TipoNotificacion;
  titulo: string;
  plantilla: string;
  variables: string[];
  ejemplo: string;
}

interface PlantillasResponse {
  plantillas: PlantillaNotificacion[];
  total: number;
}
```

---

### 7. Verificar Estado de Mensaje

Consulta el estado de un mensaje enviado.

```http
GET /api/notificaciones/estado/:messageSid
```

**Headers:**

```
Authorization: Bearer <token_conanp>
```

**Parámetros URL:**

- `messageSid` (string, requerido): ID del mensaje de Twilio (formato: SMxxxxxxxxxxxx)

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estado del mensaje obtenido",
  "data": {
    "message_sid": "SM1234567890abcdef",
    "estado": "delivered",
    "fecha_actualizacion": "2025-10-13T14:35:00.000Z"
  }
}
```

**Respuesta de Error (400):**

```json
{
  "status": "error",
  "message": "Error al verificar estado del mensaje",
  "error": "Descripción del error"
}
```

**Estados Posibles:**

- `queued`: En cola
- `sending`: Enviando
- `sent`: Enviado a WhatsApp
- `delivered`: Entregado al dispositivo
- `read`: Leído por el usuario
- `failed`: Fallido
- `undelivered`: No entregado

**Estructura para Frontend:**

```typescript
interface EstadoMensajeResponse {
  message_sid: string;
  estado: string;
  fecha_actualizacion?: string;
}
```

---

### 8. Enviar Mensaje de Prueba

Envía un mensaje de prueba (solo en desarrollo).

```http
POST /api/notificaciones/test
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "telefono": "2291234567"
}
```

**Parámetros:**

- `telefono` (string, requerido): Número de 10 dígitos

**Nota:** Este endpoint está bloqueado en producción (`NODE_ENV=production`).

**Ejemplo de Mensaje de Prueba:**

```
🧪 *MENSAJE DE PRUEBA*

Este es un mensaje de prueba del sistema de notificaciones de Isla Lobos.

Si recibes este mensaje, la integración con WhatsApp está funcionando correctamente. ✅

_Sistema CONANP - Isla Lobos_
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Mensaje de prueba enviado",
  "data": {
    "notificacion": {
      "success": true,
      "message_id": "SM999zzz...",
      "telefono": "whatsapp:+522291234567",
      "estado": "enviado",
      "fecha_envio": "2025-10-13T14:30:00.000Z"
    }
  }
}
```

**Respuesta - Producción (403):**

```json
{
  "status": "error",
  "message": "Endpoint de prueba no disponible en producción"
}
```

**Estructura para Frontend:**

```typescript
interface PruebaNotificacionRequest {
  telefono: string;
}
```

---

### 📊 Resumen de Endpoints de Notificaciones

| Método | Endpoint                                 | Descripción                         | Auth      |
| ------ | ---------------------------------------- | ----------------------------------- | --------- |
| GET    | `/api/notificaciones/estado`             | Verificar estado del servicio       | 🔐 CONANP |
| POST   | `/api/notificaciones/enviar`             | Enviar notificación individual      | 🔐 CONANP |
| POST   | `/api/notificaciones/enviar-masivo`      | Enviar notificaciones masivas       | 🔐 CONANP |
| POST   | `/api/notificaciones/alerta-clima`       | Alerta meteorológica a prestadores  | 🔐 CONANP |
| POST   | `/api/notificaciones/alerta-permisos`    | Alertas de permisos por vencer      | 🔐 CONANP |
| GET    | `/api/notificaciones/plantillas`         | Obtener plantillas de mensajes      | 🔐 CONANP |
| GET    | `/api/notificaciones/estado/:messageSid` | Verificar estado de mensaje enviado | 🔐 CONANP |
| POST   | `/api/notificaciones/test`               | Enviar mensaje de prueba (dev only) | 🔐 CONANP |

---

### 🎯 Casos de Uso Prácticos para Frontend

#### **1. Botón "Enviar Alerta de Clima" en Dashboard**

```typescript
// Componente Dashboard - Alertas de Clima
const enviarAlertaClima = async (datos: {
  estado_puerto: EstadoPuerto;
  oleaje: number;
  viento_velocidad: number;
  mensaje_adicional?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/notificaciones/alerta-clima`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });

    const result = await response.json();

    if (result.status === "success") {
      // Mostrar notificación de éxito
      toast.success(
        `Alerta enviada a ${result.data.resumen.enviados} prestadores`
      );
    }
  } catch (error) {
    toast.error("Error al enviar alerta de clima");
  }
};
```

#### **2. Verificar Estado del Servicio al Cargar Dashboard**

```typescript
// Hook useWhatsAppStatus
const useWhatsAppStatus = () => {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const response = await fetch(`${API_URL}/notificaciones/estado`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setIsConfigured(result.data?.configurado || false);
    };

    checkStatus();
  }, []);

  return { isConfigured };
};

// En el componente
const { isConfigured } = useWhatsAppStatus();

return (
  <div>
    {isConfigured ? (
      <Badge color="success">WhatsApp Activo</Badge>
    ) : (
      <Badge color="warning">WhatsApp No Configurado</Badge>
    )}
  </div>
);
```

#### **3. Modal para Enviar Notificación Personalizada**

```typescript
// Componente NotificacionModal
interface NotificacionForm {
  usuarios_ids: string[];
  mensaje: string;
  tipo: TipoNotificacion;
}

const NotificacionModal = ({ usuarios }: { usuarios: User[] }) => {
  const [form, setForm] = useState<NotificacionForm>({
    usuarios_ids: [],
    mensaje: "",
    tipo: "recordatorio_generico",
  });

  const enviar = async () => {
    const response = await fetch(`${API_URL}/notificaciones/enviar-masivo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (result.status === "success") {
      toast.success(
        `Enviado a ${result.data.resumen.enviados} de ${result.data.resumen.total} usuarios`
      );
    }
  };

  return (
    <Modal>
      <Select
        multiple
        options={usuarios}
        onChange={(ids) => setForm({ ...form, usuarios_ids: ids })}
      />
      <Textarea
        value={form.mensaje}
        onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
        maxLength={1600}
      />
      <Select
        value={form.tipo}
        options={tiposNotificacion}
        onChange={(tipo) => setForm({ ...form, tipo })}
      />
      <Button onClick={enviar}>Enviar Notificaciones</Button>
    </Modal>
  );
};
```

#### **4. Integración Automática al Crear Salida**

```typescript
// En el servicio de salidas del frontend
const crearSalida = async (datosSalida: CrearSalidaRequest) => {
  // 1. Crear la salida
  const response = await fetch(`${API_URL}/salidas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosSalida),
  });

  const result = await response.json();

  if (result.status === "success") {
    // 2. Opcional: Enviar confirmación por WhatsApp
    // (esto podría hacerse automáticamente en el backend)
    toast.success("Salida registrada exitosamente");

    // El backend puede enviar automáticamente la confirmación
    // sin necesidad de llamada adicional desde el frontend
  }
};
```

---

### 💡 **Tips de Implementación en Frontend**

#### **1. Componente Badge de Estado de WhatsApp**

```typescript
// components/WhatsAppStatusBadge.tsx
import { useEffect, useState } from "react";
import { Badge } from "flowbite-react";

export const WhatsAppStatusBadge = () => {
  const [status, setStatus] = useState<{
    configurado: boolean;
    loading: boolean;
  }>({
    configurado: false,
    loading: true,
  });

  useEffect(() => {
    fetch("/api/notificaciones/estado", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus({
          configurado: data.data?.configurado || false,
          loading: false,
        });
      });
  }, []);

  if (status.loading) return <Badge color="gray">Verificando...</Badge>;

  return status.configurado ? (
    <Badge color="success">
      <span className="flex items-center gap-2">📱 WhatsApp Activo</span>
    </Badge>
  ) : (
    <Badge color="warning">
      <span className="flex items-center gap-2">
        ⚠️ WhatsApp No Configurado
      </span>
    </Badge>
  );
};
```

#### **2. Hook Personalizado para Notificaciones**

```typescript
// hooks/useNotificaciones.ts
export const useNotificaciones = () => {
  const [loading, setLoading] = useState(false);

  const enviarAlertaClima = async (
    datos: AlertaClimaRequest
  ): Promise<NotificacionMasivaResponse | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/notificaciones/alerta-clima", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error al enviar alerta:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const enviarNotificacion = async (
    datos: NotificacionRequest
  ): Promise<NotificacionResponse | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/notificaciones/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      const result = await response.json();
      return result.data?.notificacion;
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    enviarAlertaClima,
    enviarNotificacion,
  };
};
```

#### **3. Componente de Alerta de Clima (Flowbite-React)**

```typescript
// components/AlertaClimaModal.tsx
import {
  Modal,
  Button,
  Label,
  TextInput,
  Select,
  Textarea,
} from "flowbite-react";

export const AlertaClimaModal = ({ show, onClose }: Props) => {
  const [formData, setFormData] = useState({
    estado_puerto: "abierto",
    oleaje: 0,
    viento_velocidad: 0,
    mensaje_adicional: "",
  });

  const { loading, enviarAlertaClima } = useNotificaciones();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const resultado = await enviarAlertaClima(formData);

    if (resultado) {
      toast.success(
        `Alerta enviada a ${resultado.resumen.enviados} prestadores`
      );
      onClose();
    } else {
      toast.error("Error al enviar alerta");
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>🌊 Enviar Alerta de Clima</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="estado_puerto">Estado del Puerto</Label>
            <Select
              id="estado_puerto"
              value={formData.estado_puerto}
              onChange={(e) =>
                setFormData({ ...formData, estado_puerto: e.target.value })
              }
            >
              <option value="abierto">🟢 Abierto</option>
              <option value="restricciones">🟡 Restricciones</option>
              <option value="cerrado">🔴 Cerrado</option>
              <option value="emergencia">⚡ Emergencia</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="oleaje">Oleaje (metros)</Label>
            <TextInput
              id="oleaje"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.oleaje}
              onChange={(e) =>
                setFormData({ ...formData, oleaje: parseFloat(e.target.value) })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="viento">Velocidad del Viento (km/h)</Label>
            <TextInput
              id="viento"
              type="number"
              min="0"
              max="200"
              value={formData.viento_velocidad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  viento_velocidad: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="mensaje">Mensaje Adicional (Opcional)</Label>
            <Textarea
              id="mensaje"
              rows={3}
              maxLength={500}
              value={formData.mensaje_adicional}
              onChange={(e) =>
                setFormData({ ...formData, mensaje_adicional: e.target.value })
              }
              placeholder="Información adicional sobre las condiciones..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button color="gray" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "📤 Enviar Alerta"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
```

---

### 🔔 **Notificaciones Automáticas (Backend)**

El sistema puede enviar notificaciones automáticas sin intervención del frontend en estos casos:

#### **1. Confirmación Automática al Registrar Salida**

Cuando un prestador registra una salida exitosamente, el backend automáticamente envía una confirmación por WhatsApp.

**Implementación en Backend:**

```typescript
// salidaController.ts - método crear()
// Después de crear la salida...

if (prestador.telefono) {
  const datos: NotificacionSalidaData = {
    prestador_nombre: prestador.nombre,
    embarcacion_nombre: embarcacion.nombre,
    destino: salida.destino,
    fecha: this.extraerSoloFecha(salida.fecha),
    bloque_nombre: bloque?.nombre,
    hora: salida.hora,
    numero_pasajeros: salida.numero_pasajeros,
  };

  // Envío en segundo plano (no bloquea respuesta)
  whatsappService
    .enviarConfirmacionSalida(prestador.telefono, datos)
    .catch((error) => logger.error({ error }, "Error al enviar confirmación"));
}
```

**Desde el Frontend:**

```typescript
// Solo necesitas crear la salida normalmente
const crearSalida = async (datos) => {
  const response = await fetch("/api/salidas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  // El backend se encarga de enviar la confirmación por WhatsApp
  const result = await response.json();
  return result;
};
```

#### **2. Alerta Automática de Permisos (Cron Job)**

Se puede configurar un cron job que envíe alertas automáticamente cada día.

**Frontend**: No requiere acción, solo mostrar histórico si se implementa.

#### **3. Bienvenida al Registrarse**

Al registrar un nuevo usuario, el backend puede enviar automáticamente un mensaje de bienvenida.

**Implementación en authController.ts:**

```typescript
// Después de registrar el usuario...
if (nuevoUsuario.telefono) {
  whatsappService
    .enviarBienvenida(nuevoUsuario)
    .catch((error) => logger.error({ error }, "Error al enviar bienvenida"));
}
```

---

### 📋 **Tipos TypeScript Completos para Frontend**

```typescript
// types/notificaciones.ts

export enum TipoNotificacion {
  ALERTA_CLIMA = "alerta_clima",
  PERMISO_POR_VENCER = "permiso_por_vencer",
  PERMISO_VENCIDO = "permiso_vencido",
  CONFIRMACION_SALIDA = "confirmacion_salida",
  CANCELACION_SALIDA = "cancelacion_salida",
  STOCK_BRAZALETES_BAJO = "stock_brazaletes_bajo",
  RESUMEN_DIARIO = "resumen_diario",
  BIENVENIDA = "bienvenida",
  RECORDATORIO_GENERICO = "recordatorio_generico",
}

export enum PrioridadNotificacion {
  URGENTE = "urgente",
  ALTA = "alta",
  MEDIA = "media",
  BAJA = "baja",
}

export enum EstadoNotificacion {
  PENDIENTE = "pendiente",
  ENVIADO = "enviado",
  ENTREGADO = "entregado",
  LEIDO = "leido",
  FALLIDO = "fallido",
  REINTENTANDO = "reintentando",
}

export interface NotificacionRequest {
  telefono: string;
  mensaje: string;
  tipo?: TipoNotificacion;
  prioridad?: PrioridadNotificacion;
  datos_adicionales?: Record<string, any>;
}

export interface NotificacionResponse {
  success: boolean;
  message_id?: string;
  telefono: string;
  estado: EstadoNotificacion;
  fecha_envio: string;
  error?: string;
}

export interface NotificacionMasivaRequest {
  usuarios_ids: string[];
  mensaje: string;
  tipo?: TipoNotificacion;
  plantilla?: string;
}

export interface NotificacionMasivaResponse {
  resumen: {
    total: number;
    enviados: number;
    fallidos: number;
  };
  resultados: NotificacionResponse[];
}

export interface AlertaClimaRequest {
  estado_puerto: EstadoPuerto;
  oleaje: number;
  viento_velocidad: number;
  mensaje_adicional?: string;
}

export interface AlertaPermisosRequest {
  dias_anticipacion?: number;
}

export interface PlantillaNotificacion {
  tipo: TipoNotificacion;
  titulo: string;
  plantilla: string;
  variables: string[];
  ejemplo: string;
}

export interface EstadoServicioWhatsApp {
  configurado: boolean;
  proveedor: string;
}
```

---

### 🔐 **Consideraciones de Seguridad**

- **Solo CONANP**: Todos los endpoints requieren rol `conanp`
- **JWT Requerido**: Token debe incluirse en header `Authorization: Bearer <token>`
- **Validaciones**: Formato de teléfono, longitud de mensaje, UUIDs válidos
- **Rate Limiting**: Pausas automáticas entre mensajes masivos (100ms)
- **Modo Desarrollo**: Endpoint `/test` solo disponible en `NODE_ENV=development`

---

### 📖 **Documentación Adicional**

Para más detalles sobre implementación y uso:

- 📄 [`NOTIFICACIONES_WHATSAPP_API.md`](../NOTIFICACIONES_WHATSAPP_API.md)
- 📄 [`WHATSAPP_IMPLEMENTACION_RESUMEN.md`](../WHATSAPP_IMPLEMENTACION_RESUMEN.md)
- 🌐 [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp)

---

### ✅ **Checklist para Integración Frontend**

- [ ] Crear tipos TypeScript para notificaciones
- [ ] Implementar hook `useNotificaciones`
- [ ] Crear componente `WhatsAppStatusBadge`
- [ ] Crear modal `AlertaClimaModal`
- [ ] Crear modal `NotificacionPersonalizadaModal`
- [ ] Agregar botones de acción en Dashboard CONANP
- [ ] Mostrar feedback visual (toasts) al enviar
- [ ] Implementar historial de notificaciones (futuro)
- [ ] Testing de integración con backend

---

## 📧 Notificaciones Emails (`/api/emails`)

**Proveedor**: Nodemailer SMTP  
**Acceso**: Solo usuarios con rol CONANP  
**Total de Endpoints**: 7  
**Estilo**: Plantillas HTML profesionales con diseño del dashboard

### 1. Verificar Estado del Servicio

Verifica si el servicio de email está configurado correctamente.

```http
GET /api/emails/estado
```

**Headers:**

```
Authorization: Bearer <token_conanp>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Servicio de Email configurado y conectado",
  "data": {
    "configurado": true,
    "conectado": true,
    "proveedor": "Nodemailer",
    "error": null
  }
}
```

**Respuesta Sin Configurar (200):**

```json
{
  "status": "success",
  "message": "Servicio de Email no configurado",
  "data": {
    "configurado": false,
    "conectado": false,
    "proveedor": "Nodemailer"
  }
}
```

---

### 2. Enviar Email Individual

Envía un correo electrónico a una dirección específica.

```http
POST /api/emails/enviar
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "email": "ejemplo@correo.com",
  "asunto": "Prueba de Email",
  "mensaje": "Este es un mensaje de prueba del sistema de emails de Isla Lobos.",
  "tipo": "notificacion_general",
  "html": false
}
```

**Parámetros:**

- `email` (string, requerido): Email del destinatario
- `asunto` (string, requerido): Asunto del correo (3-200 caracteres)
- `mensaje` (string, requerido): Contenido del mensaje (10-10000 caracteres)
- `tipo` (string, opcional): Tipo de email (ver enum TipoEmail)
- `html` (boolean, opcional): Si el mensaje es HTML (default: false)

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Email enviado exitosamente",
  "data": {
    "email_info": {
      "success": true,
      "message_id": "abc123@mail.gmail.com",
      "email": "ejemplo@correo.com",
      "estado": "enviado",
      "fecha_envio": "2025-10-14T10:30:00.000Z"
    }
  }
}
```

**Respuesta de Error (500):**

```json
{
  "status": "error",
  "message": "Error al enviar email",
  "error": "Servicio de email no configurado"
}
```

---

### 3. Enviar Emails Masivos

Envía el mismo correo a múltiples usuarios registrados en el sistema.

```http
POST /api/emails/enviar-masivo
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "usuarios_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "asunto": "Notificación Importante",
  "mensaje": "Este es un mensaje importante para todos los prestadores.",
  "tipo": "notificacion_general",
  "html": false
}
```

**Parámetros:**

- `usuarios_ids` (array, requerido): Array de UUIDs de usuarios
- `asunto` (string, requerido): Asunto del correo
- `mensaje` (string, requerido): Contenido del mensaje
- `tipo` (string, opcional): Tipo de email
- `html` (boolean, opcional): Si el mensaje es HTML

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Emails masivos procesados",
  "data": {
    "resumen": {
      "total": 3,
      "enviados": 2,
      "fallidos": 1
    },
    "resultados": [
      {
        "success": true,
        "message_id": "abc123@mail.gmail.com",
        "email": "usuario1@ejemplo.com",
        "estado": "enviado",
        "fecha_envio": "2025-10-14T10:30:00.000Z"
      },
      {
        "success": true,
        "message_id": "def456@mail.gmail.com",
        "email": "usuario2@ejemplo.com",
        "estado": "enviado",
        "fecha_envio": "2025-10-14T10:30:00.200Z"
      },
      {
        "success": false,
        "email": "usuario3@ejemplo.com",
        "estado": "fallido",
        "fecha_envio": "2025-10-14T10:30:00.400Z",
        "error": "Email inválido"
      }
    ]
  }
}
```

---

### 4. Enviar Alerta de Clima

Envía alerta meteorológica con plantilla HTML profesional a todos los prestadores activos.

```http
POST /api/emails/alerta-clima
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "estado_puerto": "cerrado",
  "oleaje": 2.5,
  "viento_velocidad": 45,
  "fecha": "2025-10-14",
  "mensaje_adicional": "Se espera que las condiciones mejoren en 6 horas"
}
```

**Parámetros:**

- `estado_puerto` (string, requerido): "abierto", "restricciones", "cerrado", "emergencia"
- `oleaje` (number, requerido): Altura del oleaje en metros (0-10)
- `viento_velocidad` (number, requerido): Velocidad del viento en km/h (0-200)
- `fecha` (string, requerido): Fecha de la alerta (formato YYYY-MM-DD)
- `mensaje_adicional` (string, opcional): Mensaje personalizado (máx 500 caracteres)

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Alerta de clima enviada por email a prestadores",
  "data": {
    "resumen": {
      "total": 15,
      "enviados": 14,
      "fallidos": 1
    },
    "resultados": [
      {
        "success": true,
        "message_id": "clima123@mail.gmail.com",
        "email": "prestador1@ejemplo.com",
        "estado": "enviado",
        "fecha_envio": "2025-10-14T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 5. Enviar Alerta de Permisos

Envía alertas a prestadores con permisos próximos a vencer.

```http
POST /api/emails/alerta-permisos
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Body:**

```json
{
  "dias_anticipacion": 30
}
```

**Parámetros:**

- `dias_anticipacion` (number, opcional): Días de anticipación (1-90, default: 30)

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Alertas de permisos enviadas por email",
  "data": {
    "resumen": {
      "total": 5,
      "enviados": 4,
      "fallidos": 1
    },
    "resultados": [
      {
        "success": true,
        "message_id": "permiso123@mail.gmail.com",
        "email": "prestador1@ejemplo.com",
        "estado": "enviado",
        "fecha_envio": "2025-10-14T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 6. Obtener Plantillas de Emails

Obtiene las plantillas de emails disponibles en el sistema.

```http
GET /api/emails/plantillas
```

**Headers:**

```
Authorization: Bearer <token_conanp>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Plantillas de emails obtenidas",
  "data": {
    "plantillas": [
      {
        "tipo": "alerta_clima",
        "asunto": "🌊 Alerta Meteorológica - Isla de Lobos",
        "plantilla_html": "<p>Estado: {estado}<br>Oleaje: {oleaje}m<br>Viento: {viento} km/h</p>",
        "plantilla_texto": "Estado: {estado}\nOleaje: {oleaje}m\nViento: {viento} km/h",
        "variables": ["estado", "oleaje", "viento"],
        "ejemplo": "Estado: CERRADO\nOleaje: 2.5m\nViento: 45 km/h"
      },
      {
        "tipo": "permiso_por_vencer",
        "asunto": "⚠️ Tu permiso vence en {dias} días",
        "plantilla_html": "<p>Hola {nombre},<br>Tu permiso vence en {dias} días.<br>Fecha: {fecha}</p>",
        "plantilla_texto": "Hola {nombre},\nTu permiso vence en {dias} días.\nFecha: {fecha}",
        "variables": ["nombre", "dias", "fecha"],
        "ejemplo": "Hola Juan Pérez,\nTu permiso vence en 15 días.\nFecha: 2025-10-28"
      },
      {
        "tipo": "confirmacion_salida",
        "asunto": "✅ Confirmación de Salida - Isla de Lobos",
        "plantilla_html": "<p>Destino: {destino}<br>Fecha: {fecha}<br>Pasajeros: {pasajeros}</p>",
        "plantilla_texto": "Destino: {destino}\nFecha: {fecha}\nPasajeros: {pasajeros}",
        "variables": ["destino", "fecha", "pasajeros"],
        "ejemplo": "Destino: Isla de Lobos\nFecha: 2025-10-13\nPasajeros: 12"
      }
    ],
    "total": 3
  }
}
```

---

### 7. Enviar Email de Prueba

Envía un email de prueba con plantilla HTML del sistema (solo en desarrollo).

```http
POST /api/emails/test
```

**Headers:**

```
Authorization: Bearer <token_conanp>
Content-Type: application/json
```

**Restricción:** Solo disponible cuando `NODE_ENV !== "production"`

**Body:**

```json
{
  "email": "tu-email@ejemplo.com"
}
```

**Parámetros:**

- `email` (string, requerido): Email del destinatario de prueba

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Email de prueba enviado",
  "data": {
    "email_info": {
      "success": true,
      "message_id": "test123@mail.gmail.com",
      "email": "tu-email@ejemplo.com",
      "estado": "enviado",
      "fecha_envio": "2025-10-14T10:30:00.000Z"
    }
  }
}
```

**Respuesta de Error en Producción (403):**

```json
{
  "status": "error",
  "message": "Endpoint de prueba no disponible en producción"
}
```

---

### 📊 **Tipos de Email Disponibles**

```typescript
enum TipoEmail {
  ALERTA_CLIMA = "alerta_clima",
  PERMISO_POR_VENCER = "permiso_por_vencer",
  PERMISO_VENCIDO = "permiso_vencido",
  CONFIRMACION_SALIDA = "confirmacion_salida",
  CANCELACION_SALIDA = "cancelacion_salida",
  STOCK_BRAZALETES_BAJO = "stock_brazaletes_bajo",
  RESUMEN_DIARIO = "resumen_diario",
  BIENVENIDA = "bienvenida",
  RECUPERACION_PASSWORD = "recuperacion_password",
  REGISTRO_EXITOSO = "registro_exitoso",
  NOTIFICACION_GENERAL = "notificacion_general",
}
```

### 🎨 **Estilo Visual de los Emails**

Los correos replican el diseño del dashboard con:

- **Paleta de colores**: Azul teal (#00796b), verde (#4caf50), naranja (#ff9800), blanco
- **Tipografía**: Sans-serif limpia y legible
- **Diseño**: Bordes redondeados, tarjetas con sombras sutiles
- **Iconografía**: Emojis y iconos planos estilizados
- **Responsive**: Adaptable a dispositivos móviles

### ⚙️ **Configuración Requerida**

```env
# Variables de entorno para Nodemailer
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
NODEMAILER_USER=tu-email@gmail.com
NODEMAILER_PASS=tu_password_de_aplicacion
```

### 🔒 **Consideraciones de Seguridad**

- **Solo CONANP**: Todos los endpoints requieren rol `conanp`
- **JWT Requerido**: Token debe incluirse en header `Authorization: Bearer <token>`
- **Validaciones**: Formato de email, longitud de contenido, UUIDs válidos
- **Rate Limiting**: Pausas automáticas entre emails masivos (200ms)
- **Modo Desarrollo**: Endpoint `/test` solo disponible en `NODE_ENV=development`

---

### 📖 **Documentación Adicional**

Para más detalles sobre implementación y uso:

- 📄 [`NOTIFICACIONES_EMAIL_API.md`](../NOTIFICACIONES_EMAIL_API.md)
- 📧 [Nodemailer Documentation](https://nodemailer.com/)
- 🎨 [HTML Email Templates Guide](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)

---

### ✅ **Checklist para Integración Frontend**

- [ ] Crear tipos TypeScript para emails
- [ ] Implementar hook `useEmails`
- [ ] Crear componente `EmailStatusBadge`
- [ ] Crear modal `AlertaClimaEmailModal`
- [ ] Crear modal `NotificacionEmailModal`
- [ ] Agregar botones de acción en Dashboard CONANP
- [ ] Mostrar feedback visual (toasts) al enviar
- [ ] Implementar preview de plantillas HTML
- [ ] Testing de integración con backend
- [ ] Configurar variables de entorno SMTP

---

## 📸 Avatares (`/api/avatars`)

**Proveedor**: Cloudinary  
**Acceso**: Todos los usuarios autenticados  
**Total de Endpoints**: 6  
**Características**: Upload automático, transformaciones, generación de avatares por defecto

### 1. Subir Avatar

Sube una imagen como avatar de usuario con transformaciones automáticas.

```http
POST /api/avatars/upload
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**

```
image: [archivo de imagen - JPEG, PNG, WebP]
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Avatar subido y actualizado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "2291234567",
      "avatar_url": "https://res.cloudinary.com/isla-lobos/image/upload/v1234567890/isla-lobos/avatars/user-uuid-1234567890.jpg",
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2025-12-31",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "ultimaNotificacion": null,
      "motivoSuspension": null,
      "createdAt": "2025-09-26",
      "updatedAt": "2025-01-14"
    },
    "avatar": {
      "url": "https://res.cloudinary.com/isla-lobos/image/upload/v1234567890/isla-lobos/avatars/user-uuid-1234567890.jpg",
      "uploaded_at": "2025-01-14T10:30:00.000Z"
    }
  }
}
```

**Respuesta de Error (400):**

```json
{
  "status": "error",
  "message": "El archivo excede el tamaño máximo permitido (5MB)",
  "error": "FILE_TOO_LARGE",
  "data": {
    "maxSize": 5242880,
    "currentSize": 8388608
  }
}
```

### 2. Eliminar Avatar

Elimina el avatar actual del usuario.

```http
DELETE /api/avatars
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Avatar eliminado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "2291234567",
      "avatar_url": null,
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2025-12-31",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "ultimaNotificacion": null,
      "motivoSuspension": null,
      "createdAt": "2025-09-26",
      "updatedAt": "2025-01-14"
    },
    "deleted_from_cloudinary": true
  }
}
```

### 3. Generar Avatar por Defecto

Genera un avatar usando las iniciales del usuario.

```http
POST /api/avatars/generate-default
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (opcional):**

```json
{
  "backgroundColor": "4f46e5",
  "textColor": "ffffff"
}
```

**Respuesta Exitosa (201):**

```json
{
  "status": "success",
  "message": "Avatar por defecto generado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "2291234567",
      "avatar_url": "https://res.cloudinary.com/isla-lobos/image/upload/v1234567890/sample",
      "rol": "prestador",
      "activo": true,
      "fechaVencimientoPermiso": "2025-12-31",
      "estadoPermiso": "vigente",
      "diasNotificacion": 30,
      "ultimaNotificacion": null,
      "motivoSuspension": null,
      "createdAt": "2025-09-26",
      "updatedAt": "2025-01-14"
    },
    "avatar": {
      "url": "https://res.cloudinary.com/isla-lobos/image/upload/v1234567890/sample",
      "type": "default",
      "generated_at": "2025-01-14T10:30:00.000Z"
    }
  }
}
```

### 4. Obtener Información del Avatar

Obtiene información detallada del avatar actual del usuario.

```http
GET /api/avatars/info
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Información del avatar obtenida exitosamente",
  "data": {
    "has_avatar": true,
    "avatar_url": "https://res.cloudinary.com/isla-lobos/image/upload/v1234567890/isla-lobos/avatars/user-uuid-1234567890.jpg",
    "is_cloudinary": true,
    "image_info": {
      "width": 300,
      "height": 300,
      "format": "jpg",
      "size": 24576,
      "created_at": "2025-01-14T10:30:00.000Z"
    },
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com"
    }
  }
}
```

### 5. Obtener Estadísticas de Cloudinary

Obtiene estadísticas de uso de Cloudinary (solo CONANP).

```http
GET /api/avatars/stats
```

**Headers:**

```
Authorization: Bearer <token_conanp>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Estadísticas de Cloudinary obtenidas exitosamente",
  "data": {
    "usage_stats": {
      "totalImages": 156,
      "totalStorage": 12582912,
      "totalBandwidth": 52428800
    },
    "limits": {
      "free_tier": {
        "storage_gb": 25,
        "bandwidth_gb": 25,
        "transformations": 25000
      }
    },
    "retrieved_at": "2025-01-14T10:30:00.000Z"
  }
}
```

### 6. Verificar Estado del Servicio

Verifica el estado del servicio de avatares.

```http
GET /api/avatars/health
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "status": "success",
  "message": "Servicio de avatares funcionando correctamente",
  "data": {
    "service": "avatar-service",
    "version": "1.0.0",
    "cloudinary_configured": true,
    "timestamp": "2025-01-14T10:30:00.000Z",
    "endpoints": {
      "upload": "POST /api/avatars/upload",
      "delete": "DELETE /api/avatars",
      "generate_default": "POST /api/avatars/generate-default",
      "info": "GET /api/avatars/info",
      "stats": "GET /api/avatars/stats (CONANP only)",
      "health": "GET /api/avatars/health"
    },
    "limits": {
      "max_file_size": "5242880",
      "allowed_types": ["image/jpeg", "image/png", "image/webp"],
      "max_dimension": "2048",
      "rate_limit": "5 uploads per 15 minutes"
    }
  }
}
```

### 📊 **Resumen de Endpoints de Avatares**

| Método | Endpoint                        | Descripción                | Auth       |
| ------ | ------------------------------- | -------------------------- | ---------- |
| POST   | `/api/avatars/upload`           | Subir avatar de usuario    | ✅ Usuario |
| DELETE | `/api/avatars`                  | Eliminar avatar actual     | ✅ Usuario |
| POST   | `/api/avatars/generate-default` | Generar avatar por defecto | ✅ Usuario |
| GET    | `/api/avatars/info`             | Información del avatar     | ✅ Usuario |
| GET    | `/api/avatars/stats`            | Estadísticas Cloudinary    | 🔐 CONANP  |
| GET    | `/api/avatars/health`           | Estado del servicio        | ✅ Usuario |

### 🎯 **Características del Sistema de Avatares**

- **Transformaciones Automáticas**: Redimensionado a 300x300px con detección de cara
- **Optimización**: Compresión automática y conversión a formato optimizado
- **Rate Limiting**: Máximo 5 uploads por usuario cada 15 minutos
- **Validación**: Tipos de archivo (JPEG, PNG, WebP) y tamaño máximo 5MB
- **Fallback**: Generación automática de avatares por defecto con iniciales
- **CDN Global**: Entrega rápida desde Cloudinary
- **Gestión Automática**: Eliminación de avatares anteriores al subir nuevos

### 🔧 **Configuración Requerida**

**Variables de Entorno:**

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
AVATAR_MAX_SIZE=5242880
AVATAR_ALLOWED_TYPES=image/jpeg,image/png,image/webp
AVATAR_MAX_DIMENSION=2048
```

### 💡 **Casos de Uso Prácticos para Frontend**

**1. Upload con Preview:**

```javascript
const handleAvatarUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/avatars/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (result.success) {
    setUserAvatar(result.data.avatar.url);
  }
};
```

**2. Generar Avatar por Defecto:**

```javascript
const generateDefaultAvatar = async () => {
  const response = await fetch("/api/avatars/generate-default", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      backgroundColor: "4f46e5",
      textColor: "ffffff",
    }),
  });

  const result = await response.json();
  if (result.success) {
    setUserAvatar(result.data.avatar.url);
  }
};
```

**3. Mostrar Avatar con Fallback:**

```jsx
const UserAvatar = ({ user }) => {
  const avatarUrl = user.avatar_url || "/default-avatar.png";

  return (
    <img
      src={avatarUrl}
      alt={`Avatar de ${user.nombre}`}
      className="w-24 h-24 rounded-full object-cover"
      onError={(e) => {
        e.target.src = "/default-avatar.png";
      }}
    />
  );
};
```

### 🔐 **Consideraciones de Seguridad**

- **Validación de Archivos**: Verificación de tipo MIME y magic numbers
- **Rate Limiting**: Prevención de spam y abuso
- **Sanitización**: Nombres de archivo seguros y únicos
- **CDN Seguro**: URLs firmadas y acceso controlado
- **Eliminación Automática**: Limpieza de archivos huérfanos

### 📖 **Documentación Adicional**

- 🌐 [Cloudinary Docs](https://cloudinary.com/documentation)
- 🎨 [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- 📱 [Upload Widget](https://cloudinary.com/documentation/upload_widget_reference)

---
