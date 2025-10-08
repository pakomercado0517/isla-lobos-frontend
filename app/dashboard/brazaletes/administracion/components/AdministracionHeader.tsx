import { Shield } from "lucide-react";

export function AdministracionHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Administración de Brazaletes
        </h1>
        <p className="text-gray-600 mt-1">
          Herramientas avanzadas de administración y mantenimiento del sistema
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-[var(--isla-teal)]" />
        <span className="text-sm text-gray-600">Panel de Administración</span>
      </div>
    </div>
  );
}
