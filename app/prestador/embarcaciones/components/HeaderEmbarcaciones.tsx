"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Plus } from "lucide-react";

interface HeaderEmbarcacionesProps {
  totalEmbarcaciones: number;
  loading: boolean;
  onCreateDialogOpen: boolean;
  onCreateDialogChange: (open: boolean) => void;
  onActualizar: () => void;
  children: React.ReactNode; // Dialog content
}

export function HeaderEmbarcaciones({
  totalEmbarcaciones,
  loading,
  onCreateDialogOpen,
  onCreateDialogChange,
  onActualizar,
  children,
}: HeaderEmbarcacionesProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
          Mis Embarcaciones
        </h1>
        <p className="text-gray-600 mt-2">Gestiona tu flota de embarcaciones</p>
      </div>
      <div className="flex items-center gap-3">
        {totalEmbarcaciones > 0 && (
          <Badge variant="secondary" className="text-sm">
            {totalEmbarcaciones} embarcaciones
          </Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onActualizar}
          disabled={loading}
          className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
        <Dialog open={onCreateDialogOpen} onOpenChange={onCreateDialogChange}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Embarcación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva Embarcación</DialogTitle>
              <DialogDescription>
                Registra una nueva embarcación en tu flota.
              </DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
