/**
 * Utilidades para generar archivos CSV con formato profesional
 * Optimizado para Excel en México (separador punto y coma, UTF-8 con BOM)
 */

/**
 * Escapa texto para CSV (maneja comillas y caracteres especiales)
 */
function escaparTextoCSV(texto: string | number | null | undefined): string {
  if (texto === null || texto === undefined) {
    return "";
  }

  const textoStr = String(texto);

  // Si contiene punto y coma, comillas o saltos de línea, envolver en comillas
  if (
    textoStr.includes(";") ||
    textoStr.includes('"') ||
    textoStr.includes("\n")
  ) {
    // Duplicar comillas internas
    return `"${textoStr.replace(/"/g, '""')}"`;
  }

  return textoStr;
}

/**
 * Formatea un número como moneda mexicana
 */
export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formatea un número con separador de miles
 */
export function formatearNumero(valor: number): string {
  return new Intl.NumberFormat("es-MX").format(valor);
}

/**
 * Formatea una fecha en formato legible español
 */
export function formatearFechaCSV(fecha: string): string {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
}

/**
 * Formatea una fecha con día de la semana
 */
export function formatearFechaConDia(fecha: string): string {
  try {
    const date = new Date(fecha);
    const dia = date.toLocaleDateString("es-MX", { weekday: "long" });
    const fechaFormateada = formatearFechaCSV(fecha);
    return `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${fechaFormateada}`;
  } catch {
    return fecha;
  }
}

/**
 * Convierte un array de objetos a CSV
 */
export function convertirACSV<
  T extends Record<string, string | number | null | undefined>
>(datos: T[], encabezados: string[]): string {
  if (datos.length === 0) {
    return encabezados.join(";");
  }

  const filas = datos.map((fila) => {
    return Object.values(fila)
      .map((valor) =>
        escaparTextoCSV(valor as string | number | null | undefined)
      )
      .join(";");
  });

  return [encabezados.join(";"), ...filas].join("\n");
}

/**
 * Crea un CSV con formato profesional y secciones separadas
 */
export function crearCSVConSecciones(secciones: {
  titulo?: string;
  subtitulo?: string;
  fecha?: string;
  bloques: Array<{
    titulo: string;
    encabezados: string[];
    datos: Array<Record<string, string | number | null | undefined>>;
    totales?: Record<string, string | number | null | undefined>;
  }>;
}): string {
  const lineas: string[] = [];

  // UTF-8 BOM para que Excel reconozca los acentos
  lineas.push("\ufeff");

  // Encabezado principal
  if (secciones.titulo) {
    lineas.push(secciones.titulo);
  }
  if (secciones.subtitulo) {
    lineas.push(secciones.subtitulo);
  }
  if (secciones.fecha) {
    lineas.push(`Generado: ${secciones.fecha}`);
  }
  lineas.push(""); // Línea en blanco

  // Procesar cada bloque
  secciones.bloques.forEach((bloque, index) => {
    // Título del bloque
    lineas.push(`=== ${bloque.titulo} ===`);

    // Encabezados
    lineas.push(bloque.encabezados.map((h) => escaparTextoCSV(h)).join(";"));

    // Datos
    bloque.datos.forEach((fila) => {
      const valores = Object.values(fila).map((valor) =>
        escaparTextoCSV(valor as string | number | null | undefined)
      );
      lineas.push(valores.join(";"));
    });

    // Totales (opcional)
    if (bloque.totales) {
      lineas.push(""); // Línea en blanco
      const valoresTotales = Object.values(bloque.totales).map((valor) =>
        escaparTextoCSV(valor as string | number | null | undefined)
      );
      lineas.push(valoresTotales.join(";"));
    }

    // Línea en blanco entre bloques (excepto el último)
    if (index < secciones.bloques.length - 1) {
      lineas.push("");
      lineas.push("");
    }
  });

  return lineas.join("\n");
}

/**
 * Genera el nombre del archivo con timestamp
 */
export function generarNombreArchivo(
  tipo: string,
  fechaInicio?: string,
  fechaFin?: string
): string {
  const timestamp = new Date().toISOString().split("T")[0];

  if (fechaInicio && fechaFin) {
    return `reporte_${tipo}_${fechaInicio}_a_${fechaFin}_${timestamp}.csv`;
  }

  return `reporte_${tipo}_${timestamp}.csv`;
}

/**
 * Convierte un CSV string a Blob para descarga
 */
export function crearBlobCSV(contenidoCSV: string): Blob {
  return new Blob([contenidoCSV], {
    type: "text/csv;charset=utf-8;",
  });
}

/**
 * Trigger de descarga automática del CSV
 */
export function descargarCSV(
  contenidoCSV: string,
  nombreArchivo: string
): void {
  const blob = crearBlobCSV(contenidoCSV);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = nombreArchivo;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
