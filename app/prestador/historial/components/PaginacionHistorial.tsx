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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Mostrando {inicio} - {fin} de {totalSalidas} salidas
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Anterior</span>
            </Button>
            <div className="flex items-center gap-1">
              {pages.map((pageNum: number) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 p-0 text-xs sm:text-sm ${
                    currentPage === pageNum
                      ? "bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
                      : ""
                  }`}
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
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline mr-1">Siguiente</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
