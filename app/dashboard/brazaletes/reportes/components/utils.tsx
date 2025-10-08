export function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-MX");
}

export function getNacionalidadDisplay(nacionalidad: string): string {
  switch (nacionalidad) {
    case "local":
      return "🏠 Local";
    case "nacional":
      return "🇲🇽 Nacional";
    case "internacional":
      return "🌍 Internacional";
    default:
      return "N/A";
  }
}
