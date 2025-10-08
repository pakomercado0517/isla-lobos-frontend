"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Tipos y utilidades
export interface HistorialFilters {
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  page: number;
  limit: number;
}

const getResultadosRange = (
  currentPage: number,
  limit: number,
  totalSalidas: number
): { inicio: number; fin: number; total: number } => {
  const inicio = (currentPage - 1) * limit + 1;
  const fin = Math.min(currentPage * limit, totalSalidas);
  return { inicio, fin, total: totalSalidas };
};

const getPaginationPages = (
  currentPage: number,
  totalPages: number,
  maxPages: number = 5
): number[] => {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - Math.floor(maxPages / 2));
  const end = Math.min(totalPages, start + maxPages - 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

interface PaginacionHistorialProps {
  currentPage: number;
  totalPages: number;
  totalSalidas: number;
  filters: HistorialFilters;
  onPageChange: (newPage: number) => void;
}

export function PaginacionHistorial({
  currentPage,
  totalPages,
  totalSalidas,
  filters,
  onPageChange,
}: PaginacionHistorialProps) {
  if (totalPages <= 1) {
    return null;
  }

  const { inicio, fin } = getResultadosRange(
    currentPage,
    filters.limit,
    totalSalidas
  );
  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {inicio} - {fin} de {totalSalidas} salidas
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {pages.map((pageNum: number) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={
                    currentPage === pageNum
                      ? "bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
                      : ""
                  }
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
