export function getEstadoLoteColor(estado: string): string {
  switch (estado) {
    case "activo":
      return "bg-green-100 text-green-800";
    case "agotado":
      return "bg-red-100 text-red-800";
    case "vencido":
      return "bg-orange-100 text-orange-800";
    case "cancelado":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
