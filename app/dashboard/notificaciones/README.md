# 📱 Módulo de Notificaciones WhatsApp

Sistema completo de envío de notificaciones por WhatsApp integrado con Twilio.

---

## 🚀 Inicio Rápido

### **1. Configuración de Desarrollo (Twilio Sandbox)**

Crear archivo `.env.local`:

```env
NODE_ENV=development
NEXT_PUBLIC_TWILIO_TEST_NUMBER=2291234567  # Tu número registrado en sandbox
```

### **2. Registrar Número en Twilio Sandbox**

1. Ir a [Twilio Console](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. Enviar mensaje de WhatsApp al número mostrado
3. Seguir las instrucciones para activar sandbox
4. Copiar tu número al `.env.local`

### **3. Iniciar Aplicación**

```bash
npm run dev
```

### **4. Acceder al Módulo**

1. Login como CONANP: `admin@conanp.gob.mx`
2. Ir a `/dashboard/notificaciones`
3. Verificar badge: 🟢 Twilio Activo
4. Probar "Enviar Mensaje de Prueba"

---

## 📋 Funcionalidades

### **Tab 1: Envío Individual**

- Enviar mensaje a un número específico
- Seleccionar tipo y prioridad
- Validaciones en tiempo real
- Preview de destinatario

### **Tab 2: Envío Masivo**

- Enviar mensaje a múltiples usuarios
- Ingreso de IDs separados por comas
- Resumen de envíos

### **Tab 3: Alertas**

- **Alerta Clima**: A todos los prestadores
- **Alerta Permisos**: Permisos por vencer

### **Tab 4: Plantillas**

- Ver plantillas predefinidas
- Ejemplos de mensajes
- Variables disponibles

---

## 🔄 Modo Desarrollo vs Producción

### **Desarrollo (Sandbox)**

```typescript
// Todos los mensajes van al número de prueba
NEXT_PUBLIC_TWILIO_TEST_NUMBER=2291234567

// Indicadores visuales:
- Badge "🧪 Modo Desarrollo"
- Alert amarillo de advertencia
- Preview muestra destinatario original y de prueba
```

### **Producción (WhatsApp Business)**

```typescript
// Mensajes van a números reales
NODE_ENV = production;
// NEXT_PUBLIC_TWILIO_TEST_NUMBER removido

// Sin indicadores de desarrollo
// Envíos directos a usuarios reales
```

---

## 📊 Tipos de Notificaciones

| Tipo                    | Uso                        | Ejemplo                        |
| ----------------------- | -------------------------- | ------------------------------ |
| `alerta_clima`          | Condiciones meteorológicas | Puerto cerrado por oleaje      |
| `permiso_por_vencer`    | Avisos de vencimiento      | Permiso vence en 30 días       |
| `confirmacion_salida`   | Confirmación de registro   | Salida confirmada a Isla Lobos |
| `stock_brazaletes_bajo` | Inventario bajo            | Solo quedan 20 brazaletes      |
| `recordatorio_generico` | Mensajes personalizados    | Recordatorio de reunión        |

---

## 🔐 Seguridad

### **Acceso:**

- ✅ Solo usuarios con rol `conanp`
- ✅ Autenticación JWT requerida
- ✅ Validación en Server Actions
- ✅ Redirección automática si no autorizado

### **Validaciones:**

- ✅ Teléfono: 10 dígitos
- ✅ Mensaje: 10-1600 caracteres
- ✅ Oleaje: 0-10 metros
- ✅ Viento: 0-200 km/h

---

## 📝 Ejemplos de Uso

### **Envío Individual:**

```typescript
await enviarNotificacion({
  telefono: "2291234567",
  mensaje: "🌊 Puerto cerrado por condiciones adversas",
  tipo: "alerta_clima",
  prioridad: "urgente",
});
```

### **Alerta de Clima:**

```typescript
await enviarAlertaClima({
  estado_puerto: "cerrado",
  oleaje: 2.5,
  viento_velocidad: 45,
  mensaje_adicional: "Condiciones mejorarán en 6 horas",
});
```

---

## 🐛 Troubleshooting

### **Servicio No Configurado**

```
Badge: 🔴 No Configurado
```

**Solución:** Verificar credenciales de Twilio en backend

### **Mensaje No Llega**

```
Error: "The 'To' number is not reachable"
```

**Solución:** Verificar que el número esté registrado en sandbox

### **Error de Autenticación**

```
Error: "No autenticado"
```

**Solución:** Hacer logout/login nuevamente

---

## 📞 Soporte

- **Documentación API**: `documentation/API_ROUTES_REFERENCE.md`
- **Twilio Docs**: https://www.twilio.com/docs/whatsapp
- **Reglas de Trabajo**: `documentation/REGLAS_DE_TRABAJO.md`
