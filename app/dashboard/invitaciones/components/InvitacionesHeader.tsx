import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Mail } from "lucide-react";

interface InvitacionesHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
  refreshing?: boolean;
}

export function InvitacionesHeader({
  onRefresh,
  onCreateClick,
  refreshing = false,
}: InvitacionesHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)] flex items-center gap-2">
            <Mail className="w-8 h-8" />
            Gestión de Invitaciones
          </h1>
          <p className="text-[var(--isla-dark-teal)]/70 mt-1">
            Crea y administra invitaciones para nuevos usuarios
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={refreshing}
            className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)]/10"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>

          <Button
            onClick={onCreateClick}
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Invitación
          </Button>
        </div>
      </div>
    </div>
  );
}












