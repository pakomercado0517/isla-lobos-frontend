import { TrendingUp, TrendingDown } from "lucide-react";

export function getTendenciaIcon(valor: number) {
  if (valor > 0) {
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  } else if (valor < 0) {
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  }
  return null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

