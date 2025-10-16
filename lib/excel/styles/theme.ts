/**
 * Tema y colores corporativos de CONANP para archivos Excel
 */

import { FillPattern, BorderStyle } from "exceljs";

export const CONANP_THEME = {
  // Colores principales CONANP
  colors: {
    primary: "0066CC",        // Azul principal CONANP
    secondary: "009900",      // Verde naturaleza
    accent: "FF6600",         // Naranja accent
    success: "28A745",        // Verde éxito
    warning: "FFC107",        // Amarillo advertencia
    danger: "DC3545",         // Rojo peligro
    info: "17A2B8",          // Azul información
    
    // Grises
    dark: "343A40",
    medium: "6C757D",
    light: "F8F9FA",
    white: "FFFFFF",
    
    // Colores de datos para gráficos
    chartColors: [
      "0066CC", // Azul CONANP
      "009900", // Verde
      "FF6600", // Naranja
      "9900CC", // Morado
      "CC6600", // Marrón
      "00CC99", // Turquesa
      "CC0066", // Magenta
      "6699FF", // Azul claro
    ],
  },

  // Fuentes corporativas
  fonts: {
    title: {
      name: "Calibri",
      size: 16,
      bold: true,
      color: { argb: "FF0066CC" }, // Azul CONANP
    },
    subtitle: {
      name: "Calibri",
      size: 14,
      bold: true,
      color: { argb: "FF343A40" }, // Gris oscuro
    },
    header: {
      name: "Calibri",
      size: 12,
      bold: true,
      color: { argb: "FFFFFFFF" }, // Blanco
    },
    body: {
      name: "Calibri",
      size: 11,
      bold: false,
      color: { argb: "FF343A40" }, // Gris oscuro
    },
    number: {
      name: "Calibri",
      size: 11,
      bold: false,
      color: { argb: "FF0066CC" }, // Azul para números
    },
  },

  // Fills/Backgrounds
  fills: {
    headerPrimary: {
      type: "pattern" as FillPattern["type"],
      pattern: "solid" as FillPattern["pattern"],
      fgColor: { argb: "FF0066CC" }, // Azul CONANP
    },
    headerSecondary: {
      type: "pattern" as FillPattern["type"],
      pattern: "solid" as FillPattern["pattern"],
      fgColor: { argb: "FF009900" }, // Verde
    },
    alternateRow: {
      type: "pattern" as FillPattern["type"],
      pattern: "solid" as FillPattern["pattern"],
      fgColor: { argb: "FFF8F9FA" }, // Gris muy claro
    },
    success: {
      type: "pattern" as FillPattern["type"],
      pattern: "solid" as FillPattern["pattern"],
      fgColor: { argb: "FF28A745" }, // Verde éxito
    },
    warning: {
      type: "pattern" as FillPattern["type"],
      pattern: "solid" as FillPattern["pattern"],
      fgColor: { argb: "FFFFC107" }, // Amarillo advertencia
    },
    danger: {
      type: "pattern" as FillPattern["type"],
      pattern: "solid" as FillPattern["pattern"],
      fgColor: { argb: "FFDC3545" }, // Rojo peligro
    },
  },

  // Bordes estándar
  borders: {
    thin: {
      top: { style: "thin" as BorderStyle, color: { argb: "FF6C757D" } },
      left: { style: "thin" as BorderStyle, color: { argb: "FF6C757D" } },
      bottom: { style: "thin" as BorderStyle, color: { argb: "FF6C757D" } },
      right: { style: "thin" as BorderStyle, color: { argb: "FF6C757D" } },
    },
    thick: {
      top: { style: "thick" as BorderStyle, color: { argb: "FF0066CC" } },
      left: { style: "thick" as BorderStyle, color: { argb: "FF0066CC" } },
      bottom: { style: "thick" as BorderStyle, color: { argb: "FF0066CC" } },
      right: { style: "thick" as BorderStyle, color: { argb: "FF0066CC" } },
    },
    bottom: {
      bottom: { style: "thick" as BorderStyle, color: { argb: "FF0066CC" } },
    },
  },

  // Alineaciones comunes
  alignments: {
    center: {
      horizontal: "center" as const,
      vertical: "middle" as const,
    },
    left: {
      horizontal: "left" as const,
      vertical: "middle" as const,
    },
    right: {
      horizontal: "right" as const,
      vertical: "middle" as const,
    },
  },
} as const;

// Helper para obtener color por índice para gráficos
export function getChartColor(index: number): string {
  return CONANP_THEME.colors.chartColors[index % CONANP_THEME.colors.chartColors.length];
}

// Helper para determinar color basado en valor
export function getConditionalColor(value: number, thresholds: { high: number; medium: number }): string {
  if (value >= thresholds.high) return CONANP_THEME.colors.success;
  if (value >= thresholds.medium) return CONANP_THEME.colors.warning;
  return CONANP_THEME.colors.danger;
}

// Estilos de celda predefinidos
export const CELL_STYLES = {
  title: {
    font: CONANP_THEME.fonts.title,
    alignment: CONANP_THEME.alignments.center,
    border: CONANP_THEME.borders.bottom,
  },
  
  subtitle: {
    font: CONANP_THEME.fonts.subtitle,
    alignment: CONANP_THEME.alignments.left,
  },
  
  header: {
    font: CONANP_THEME.fonts.header,
    fill: CONANP_THEME.fills.headerPrimary,
    alignment: CONANP_THEME.alignments.center,
    border: CONANP_THEME.borders.thin,
  },
  
  headerSecondary: {
    font: CONANP_THEME.fonts.header,
    fill: CONANP_THEME.fills.headerSecondary,
    alignment: CONANP_THEME.alignments.center,
    border: CONANP_THEME.borders.thin,
  },
  
  body: {
    font: CONANP_THEME.fonts.body,
    alignment: CONANP_THEME.alignments.left,
    border: CONANP_THEME.borders.thin,
  },
  
  number: {
    font: CONANP_THEME.fonts.number,
    alignment: CONANP_THEME.alignments.right,
    border: CONANP_THEME.borders.thin,
    numFmt: "#,##0",
  },
  
  currency: {
    font: CONANP_THEME.fonts.number,
    alignment: CONANP_THEME.alignments.right,
    border: CONANP_THEME.borders.thin,
    numFmt: '"$"#,##0.00',
  },
  
  percentage: {
    font: CONANP_THEME.fonts.number,
    alignment: CONANP_THEME.alignments.right,
    border: CONANP_THEME.borders.thin,
    numFmt: "0.00%",
  },
  
  date: {
    font: CONANP_THEME.fonts.body,
    alignment: CONANP_THEME.alignments.center,
    border: CONANP_THEME.borders.thin,
    numFmt: "dd/mm/yyyy",
  },
} as const;