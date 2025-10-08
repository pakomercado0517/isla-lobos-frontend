export function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-MX");
}

export function getTipoBadgeProps(tipo: string) {
  if (tipo === "universal") {
    return {
      className: "bg-blue-50 text-blue-700",
      label: "🏝️ Universal",
    };
  }
  return {
    className: "bg-teal-50 text-teal-700", 
    label: "🐠 Universal",
  };
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
