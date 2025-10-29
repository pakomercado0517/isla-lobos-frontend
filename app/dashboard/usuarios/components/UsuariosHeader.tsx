import { Button } from "@/components/ui/button";
import { Users, Plus, RefreshCw } from "lucide-react";

interface UsuariosHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
}

export function UsuariosHeader({
  onRefresh,
  onCreateClick,
}: UsuariosHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--isla-teal)] rounded-lg flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-[var(--isla-dark-teal)] truncate">
            Gestión de Usuarios
          </h1>
          <p className="text-xs md:text-sm text-gray-600 truncate">
            Administra prestadores y usuarios del sistema
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="h-9 text-xs md:text-sm border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
        >
          <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Actualizar
        </Button>
        <Button
          onClick={onCreateClick}
          className="h-9 md:h-10 text-xs md:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>
    </div>
  );
}
