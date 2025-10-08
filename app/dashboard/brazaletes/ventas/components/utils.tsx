export function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-MX");
}

export function getEstadoVentaColor(estado: string): string {
  switch (estado) {
    case "pagado":
      return "bg-green-100 text-green-800";
    case "pendiente":
      return "bg-yellow-100 text-yellow-800";
    case "cancelado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
