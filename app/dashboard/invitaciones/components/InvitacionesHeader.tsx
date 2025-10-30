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
    <div className="mb-4 md:mb-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-[var(--isla-dark-teal)] flex items-center gap-2">
            <Mail className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
            <span className="truncate">Gestión de Invitaciones</span>
          </h1>
          <p className="text-xs md:text-sm text-[var(--isla-dark-teal)]/70 mt-1">
            Crea y administra invitaciones para nuevos usuarios
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={refreshing}
            className="h-9 md:h-10 text-xs md:text-sm border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)]/10"
          >
            <RefreshCw
              className={`w-3 h-3 md:w-4 md:h-4 mr-2 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Actualizar
          </Button>

          <Button
            onClick={onCreateClick}
            className="h-9 md:h-10 text-xs md:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)] text-white"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Nueva Invitación
          </Button>
        </div>
      </div>
    </div>
  );
}


