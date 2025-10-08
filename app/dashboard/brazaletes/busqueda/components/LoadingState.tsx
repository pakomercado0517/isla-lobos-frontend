import { Search } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Search className="w-8 h-8 animate-pulse mx-auto mb-4 text-[var(--isla-teal)]" />
        <p className="text-gray-600">Cargando resultados de búsqueda...</p>
      </div>
    </div>
  );
}

export function AuthLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Search className="w-8 h-8 animate-pulse mx-auto mb-4 text-[var(--isla-teal)]" />
        <p className="text-gray-600">Cargando búsqueda avanzada...</p>
      </div>
    </div>
  );
}
