import { RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
        <p className="text-gray-600">Cargando tus brazaletes...</p>
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
