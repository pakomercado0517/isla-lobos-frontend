import { RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
      </div>
    </div>
  );
}

export function AuthLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
        <p className="text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
  );
}

