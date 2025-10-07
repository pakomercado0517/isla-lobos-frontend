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
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[var(--isla-teal)] rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--isla-dark-teal)]">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">
            Administra prestadores y usuarios del sistema
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
        <Button
          onClick={onCreateClick}
          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>
    </div>
  );
}

