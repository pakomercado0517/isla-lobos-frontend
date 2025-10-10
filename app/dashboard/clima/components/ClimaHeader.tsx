import { Cloud, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClimaHeaderProps {
  onSincronizar: () => void;
  sincronizando: boolean;
  ultimaActualizacion?: string;
  esConanp: boolean;
}

export function ClimaHeader({
  onSincronizar,
  sincronizando,
  ultimaActualizacion,
  esConanp,
}: ClimaHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 p-3">
          <Cloud className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Condiciones Meteorológicas
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitoreo del clima y estado del puerto
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {ultimaActualizacion && (
          <div className="text-xs text-muted-foreground hidden md:block">
            Última actualización: {ultimaActualizacion}
          </div>
        )}
        {esConanp && (
          <Button
            onClick={onSincronizar}
            disabled={sincronizando}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${sincronizando ? "animate-spin" : ""}`}
            />
            {sincronizando ? "Sincronizando..." : "Sincronizar SMN"}
          </Button>
        )}
      </div>
    </div>
  );
}
