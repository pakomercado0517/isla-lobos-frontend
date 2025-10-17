/**
 * 🧪 SCRIPT DE PRUEBAS - FUNCIONES DE FECHAS REGIONALES
 * 
 * Este script prueba las nuevas funciones de manejo de fechas
 * para verificar que interpretan correctamente las fechas del backend.
 */

// Simular las funciones (copia simplificada para testing)
function interpretarFechaDelBackend(fechaYYYYMMDD) {
  console.log(`📥 Interpretando fecha del backend: "${fechaYYYYMMDD}"`);
  
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaYYYYMMDD)) {
    throw new Error(`Formato inválido: ${fechaYYYYMMDD}`);
  }
  
  const [año, mes, dia] = fechaYYYYMMDD.split('-').map(Number);
  const fechaLocal = new Date(año, mes - 1, dia);
  
  return fechaLocal;
}

function formatearFechaRegional(fechaYYYYMMDD) {
  try {
    const fecha = interpretarFechaDelBackend(fechaYYYYMMDD);
    
    // Simulación del formateo en español
    const opciones = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return fecha.toLocaleDateString('es-MX', opciones);
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

function obtenerFechaLocalYYYYMMDD() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  
  return `${año}-${mes}-${dia}`;
}

// ============================================================================
// EJECUTAR PRUEBAS
// ============================================================================

console.log('🧪 TESTING - FUNCIONES DE FECHAS REGIONALES');
console.log('='.repeat(60));
console.log('');

// PRUEBA 1: Fechas del backend típicas
console.log('📋 PRUEBA 1: Interpretación de fechas del backend');
console.log('-'.repeat(50));

const fechasDelBackend = [
  '2025-10-16',  // Hoy
  '2025-12-25',  // Navidad
  '2025-01-01',  // Año nuevo
  '2025-09-16',  // Independencia
  '2025-02-29'   // Año bisiesto (debería fallar en 2025)
];

fechasDelBackend.forEach((fecha) => {
  try {
    const fechaInterpretada = interpretarFechaDelBackend(fecha);
    const fechaFormateada = formatearFechaRegional(fecha);
    
    console.log(`✅ ${fecha} → ${fechaFormateada}`);
    console.log(`   Objeto Date: ${fechaInterpretada}`);
    console.log(`   Timezone del navegador: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    console.log('');
  } catch (error) {
    console.log(`❌ ${fecha} → ${error.message}`);
    console.log('');
  }
});

// PRUEBA 2: Fecha actual local
console.log('📋 PRUEBA 2: Obtener fecha actual local');
console.log('-'.repeat(50));

const fechaActual = obtenerFechaLocalYYYYMMDD();
console.log(`✅ Fecha actual local: ${fechaActual}`);
console.log(`✅ Formateada: ${formatearFechaRegional(fechaActual)}`);
console.log('');

// PRUEBA 3: Casos edge
console.log('📋 PRUEBA 3: Casos límite y validaciones');
console.log('-'.repeat(50));

const casosLimite = [
  '',                    // Vacío
  '2025-13-01',         // Mes inválido
  '2025-02-30',         // Día inválido
  '25-10-16',           // Formato incorrecto
  '2025-10-16T10:30:00', // Con timestamp
  null,                 // Null
  undefined             // Undefined
];

casosLimite.forEach((caso) => {
  try {
    const resultado = formatearFechaRegional(caso);
    console.log(`⚠️  "${caso}" → ${resultado}`);
  } catch (error) {
    console.log(`❌ "${caso}" → Error: ${error.message}`);
  }
});

console.log('');

// PRUEBA 4: Comparación con comportamiento anterior
console.log('📋 PRUEBA 4: Comparación de comportamientos');
console.log('-'.repeat(50));

function comportamientoAnterior(fechaYYYYMMDD) {
  // Simula el comportamiento anterior que causaba problemas
  const fechaUTC = new Date(fechaYYYYMMDD + 'T00:00:00.000Z');
  return fechaUTC.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });
}

const fechaPrueba = '2025-10-16';
console.log(`📊 Fecha de prueba: ${fechaPrueba}`);
console.log(`🔴 Comportamiento anterior: ${comportamientoAnterior(fechaPrueba)}`);
console.log(`🟢 Comportamiento nuevo: ${formatearFechaRegional(fechaPrueba)}`);
console.log('');

console.log('🎯 INFORMACIÓN DEL NAVEGADOR:');
console.log('-'.repeat(50));
console.log(`🌍 Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
console.log(`📅 Locale: ${Intl.DateTimeFormat().resolvedOptions().locale}`);
console.log(`🕐 Fecha/Hora actual: ${new Date().toString()}`);
console.log('');

console.log('✅ TESTING COMPLETADO');
console.log('='.repeat(60));