import { Shield } from "lucide-react";

export function AdministracionHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      <div className="min-w-0 w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
          Administración de Brazaletes
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
          Herramientas avanzadas de administración y mantenimiento del sistema
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--isla-teal)]" />
        <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
          Panel de Administración
        </span>
      </div>
    </div>
  );
}
