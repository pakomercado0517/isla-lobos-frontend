/**
 * Utilidades para agrupar datos diarios por mes
 */

import { OcupacionPorDia } from "@/actions/reportes";
import { normalizarFechaDelBackend } from "@/lib/utils";

export interface DatosMensuales {
  mes: string; // "Enero", "Febrero", etc.
  mesNumero: number; // 1-12
  año: number;
  objetivo: number; // Capacidad objetivo (días del mes × 195)
  realizado: number; // Total de pasajeros realizados
  tasa_finalizacion: number; // Porcentaje de ocupación promedio
  total_salidas: number; // Total de salidas en el mes
  dias_operados: number; // Días con al menos una salida
  dias_totales: number; // Total de días en el mes
}

/**
 * Agrupa datos de ocupación diaria por mes
 */
export function agruparDatosPorMes(
  ocupacionPorDia: OcupacionPorDia[],
  fechaInicio?: string,
  fechaFin?: string
): DatosMensuales[] {
  // Crear mapa para agrupar por mes-año
  const datosPorMes = new Map<string, {
    mes: string;
    mesNumero: number;
    año: number;
    dias: OcupacionPorDia[];
    diasOperados: number;
  }>();

  // Procesar cada día
  ocupacionPorDia.forEach((dia) => {
    const fechaNormalizada = normalizarFechaDelBackend(dia.fecha);
    const fecha = new Date(fechaNormalizada + "T12:00:00"); // Mediodía para evitar problemas de timezone
    
    // Filtrar por rango de fechas si se proporciona
    if (fechaInicio && fechaNormalizada < fechaInicio) return;
    if (fechaFin && fechaNormalizada > fechaFin) return;

    const año = fecha.getFullYear();
    const mesNumero = fecha.getMonth() + 1; // 1-12
    const clave = `${año}-${mesNumero.toString().padStart(2, "0")}`;

    if (!datosPorMes.has(clave)) {
      const nombreMes = fecha.toLocaleDateString("es-MX", { month: "long" });
      datosPorMes.set(clave, {
        mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
        mesNumero,
        año,
        dias: [],
        diasOperados: 0,
      });
    }

    const datosMes = datosPorMes.get(clave);
    if (datosMes) {
      datosMes.dias.push(dia);
      if (dia.total_salidas > 0) {
        datosMes.diasOperados++;
      }
    }
  });

  // Convertir a array y calcular métricas
  const resultado: DatosMensuales[] = Array.from(datosPorMes.values())
    .map((datos) => {
      const totalPasajeros = datos.dias.reduce(
        (sum, d) => sum + d.total_pasajeros,
        0
      );
      const totalSalidas = datos.dias.reduce(
        (sum, d) => sum + d.total_salidas,
        0
      );

      // Calcular días totales del mes
      const diasTotales = new Date(
        datos.año,
        datos.mesNumero,
        0
      ).getDate();

      // Capacidad objetivo: días del mes × capacidad diaria (195 pasajeros)
      const capacidadDiaria = 195; // 3 bloques × 65 pasajeros
      const objetivo = diasTotales * capacidadDiaria;

      // Tasa de finalización: promedio de ocupación porcentual del mes
      const ocupacionPromedio =
        datos.dias.length > 0
          ? datos.dias.reduce(
              (sum, d) => sum + d.ocupacion_porcentaje,
              0
            ) / datos.dias.length
          : 0;

      return {
        mes: datos.mes,
        mesNumero: datos.mesNumero,
        año: datos.año,
        objetivo,
        realizado: totalPasajeros,
        tasa_finalizacion: Math.round(ocupacionPromedio * 100) / 100, // Redondear a 2 decimales
        total_salidas: totalSalidas,
        dias_operados: datos.diasOperados,
        dias_totales: diasTotales,
      };
    })
    .sort((a, b) => {
      // Ordenar por año y mes
      if (a.año !== b.año) return a.año - b.año;
      return a.mesNumero - b.mesNumero;
    });

  return resultado;
}

/**
 * Obtiene el nombre del mes en español
 */
export function obtenerNombreMes(mesNumero: number): string {
  const fecha = new Date(2000, mesNumero - 1, 1);
  return fecha.toLocaleDateString("es-MX", { month: "long" });
}

