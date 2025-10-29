"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
} from "lucide-react";
import { FiltrosBrazaletes } from "@/lib/types/brazaletes";

const busquedaSchema = z.object({
  codigo: z.string().optional(),
  tipo: z.enum(["universal", "todos"]).optional(),
  estado: z
    .enum(["disponible", "asignado", "utilizado", "perdido", "todos"])
    .optional(),
  prestador_id: z.string().optional(),
  lote_id: z.string().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  turista_nacionalidad: z
    .enum(["local", "nacional", "internacional", "todas"])
    .optional(),
});

type BusquedaFormData = z.infer<typeof busquedaSchema>;

interface BusquedaAvanzadaProps {
  onSearch: (filtros: FiltrosBrazaletes) => void;
  loading?: boolean;
  resultadosCount?: number;
  filtrosGuardados?: Array<{
    id: string;
    nombre: string;
    filtros: FiltrosBrazaletes;
  }>;
  onSaveFiltros?: (nombre: string, filtros: FiltrosBrazaletes) => void;
  prestadores?: Array<{ id: string; nombre: string }>;
  lotes?: Array<{ id: string; numero_lote: string }>;
}

export function BusquedaAvanzada({
  onSearch,
  loading = false,
  resultadosCount,
  filtrosGuardados = [],
  onSaveFiltros,
  prestadores = [],
  lotes = [],
}: BusquedaAvanzadaProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState<FiltrosBrazaletes>({});
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [nombreFiltro, setNombreFiltro] = useState("");

  const form = useForm<BusquedaFormData>({
    resolver: zodResolver(busquedaSchema),
    defaultValues: {
      codigo: "",
      tipo: "todos",
      estado: "todos",
      prestador_id: "",
      lote_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      turista_nacionalidad: "todas",
    },
  });

  const watchedValues = form.watch();

  // Usar useMemo para evitar re-renders innecesarios y bucles infinitos
  const filtrosCalculados = useMemo(() => {
    const filtros: FiltrosBrazaletes = {};

    if (watchedValues.codigo?.trim())
      filtros.codigo = watchedValues.codigo.trim();
    if (watchedValues.tipo && watchedValues.tipo !== "todos")
      filtros.tipo = watchedValues.tipo;
    if (watchedValues.estado && watchedValues.estado !== "todos")
      filtros.estado = watchedValues.estado;
    if (watchedValues.prestador_id && watchedValues.prestador_id !== "todos")
      filtros.prestador_id = watchedValues.prestador_id;
    if (watchedValues.lote_id && watchedValues.lote_id !== "todos")
      filtros.lote_id = watchedValues.lote_id;
    if (watchedValues.fecha_inicio)
      filtros.fecha_inicio = watchedValues.fecha_inicio;
    if (watchedValues.fecha_fin) filtros.fecha_fin = watchedValues.fecha_fin;
    // turista_nacionalidad no está disponible en FiltrosBrazaletes

    return filtros;
  }, [
    watchedValues.codigo,
    watchedValues.tipo,
    watchedValues.estado,
    watchedValues.prestador_id,
    watchedValues.lote_id,
    watchedValues.fecha_inicio,
    watchedValues.fecha_fin,
  ]);

  useEffect(() => {
    setFiltrosActivos(filtrosCalculados);
  }, [filtrosCalculados]);

  const handleSearch = () => {
    onSearch(filtrosActivos);
  };

  const handleClearFilters = () => {
    form.reset();
    setFiltrosActivos({});
    onSearch({});
  };

  const handleSaveFiltros = () => {
    if (nombreFiltro.trim() && onSaveFiltros) {
      onSaveFiltros(nombreFiltro.trim(), filtrosActivos);
      setNombreFiltro("");
      setShowSaveDialog(false);
    }
  };

  const handleLoadFiltros = (filtros: FiltrosBrazaletes) => {
    form.reset({
      codigo: filtros.codigo || "",
      tipo: filtros.tipo || "todos",
      estado: filtros.estado || "todos",
      prestador_id: filtros.prestador_id || "",
      lote_id: filtros.lote_id || "",
      fecha_inicio: filtros.fecha_inicio || "",
      fecha_fin: filtros.fecha_fin || "",
      turista_nacionalidad: "todas", // No disponible en FiltrosBrazaletes
    });
    onSearch(filtros);
  };

  const getFiltrosActivosCount = () => {
    return Object.keys(filtrosActivos).length;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <CardTitle className="flex flex-col sm:flex-row items-center gap-2 text-xl sm:text-2xl">
              <Search className="w-5 h-5 text-gray-600" />
              <span>Búsqueda Avanzada</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Busca y filtra brazaletes con criterios específicos
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {resultadosCount !== undefined && (
              <Badge
                variant="secondary"
                className="w-full sm:w-auto justify-center text-xs sm:text-sm py-1"
              >
                {resultadosCount} resultados
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto h-9 text-xs sm:text-sm"
            >
              <Filter className="w-4 h-4 mr-1.5 sm:mr-2" />
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 ml-1.5" />
                  <span className="hidden sm:inline">Ocultar Filtros</span>
                  <span className="sm:hidden">Ocultar</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 ml-1.5" />
                  <span className="hidden sm:inline">Mostrar Filtros</span>
                  <span className="sm:hidden">Filtros</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Filtros rápidos */}
        {filtrosGuardados.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
            <span className="text-xs sm:text-sm text-gray-600">
              Filtros guardados:
            </span>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full">
              {filtrosGuardados.map((filtro) => (
                <Button
                  key={filtro.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadFiltros(filtro.filtros)}
                  className="text-xs sm:text-sm h-8"
                >
                  {filtro.nombre}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Búsqueda básica */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="codigo" className="text-xs sm:text-sm">
              Código de Brazalete
            </Label>
            <Input
              id="codigo"
              placeholder="Ej: BRZ-2024-000001"
              className="h-9 text-sm"
              {...form.register("codigo")}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="tipo" className="text-xs sm:text-sm">
              Tipo
            </Label>
            <Select
              onValueChange={(value) =>
                form.setValue("tipo", value as "universal" | "todos")
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos" className="text-sm">
                  Todos
                </SelectItem>
                <SelectItem value="universal" className="text-sm">
                  🎫 Universal
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="estado" className="text-xs sm:text-sm">
              Estado
            </Label>
            <Select
              onValueChange={(value) =>
                form.setValue(
                  "estado",
                  value as
                    | "disponible"
                    | "asignado"
                    | "utilizado"
                    | "perdido"
                    | "todos"
                )
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos" className="text-sm">
                  Todos
                </SelectItem>
                <SelectItem value="disponible" className="text-sm">
                  Disponible
                </SelectItem>
                <SelectItem value="asignado" className="text-sm">
                  Asignado
                </SelectItem>
                <SelectItem value="utilizado" className="text-sm">
                  Utilizado
                </SelectItem>
                <SelectItem value="perdido" className="text-sm">
                  Perdido
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros expandidos */}
        {isExpanded && (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="prestador_id" className="text-xs sm:text-sm">
                  Prestador
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("prestador_id", value)
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccionar prestador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos" className="text-sm">
                      Todos
                    </SelectItem>
                    {prestadores.map((prestador) => (
                      <SelectItem
                        key={prestador.id}
                        value={prestador.id}
                        className="text-sm"
                      >
                        {prestador.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="lote_id" className="text-xs sm:text-sm">
                  Lote
                </Label>
                <Select
                  onValueChange={(value) => form.setValue("lote_id", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccionar lote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos" className="text-sm">
                      Todos
                    </SelectItem>
                    {lotes.map((lote) => (
                      <SelectItem
                        key={lote.id}
                        value={lote.id}
                        className="text-sm"
                      >
                        {lote.numero_lote}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="fecha_inicio" className="text-xs sm:text-sm">
                  Fecha Inicio
                </Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  className="h-9 text-sm"
                  {...form.register("fecha_inicio")}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="fecha_fin" className="text-xs sm:text-sm">
                  Fecha Fin
                </Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  className="h-9 text-sm"
                  {...form.register("fecha_fin")}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="turista_nacionalidad"
                  className="text-xs sm:text-sm"
                >
                  Nacionalidad Turista
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      "turista_nacionalidad",
                      value as "local" | "nacional" | "internacional" | "todas"
                    )
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccionar nacionalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas" className="text-sm">
                      Todas
                    </SelectItem>
                    <SelectItem value="local" className="text-sm">
                      Local
                    </SelectItem>
                    <SelectItem value="nacional" className="text-sm">
                      Nacional
                    </SelectItem>
                    <SelectItem value="internacional" className="text-sm">
                      Internacional
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Filtros activos */}
        {getFiltrosActivosCount() > 0 && (
          <div className="mt-3 sm:mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 mb-2">
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                Filtros activos ({getFiltrosActivosCount()})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 h-8 text-xs sm:text-sm w-full sm:w-auto"
              >
                <X className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                Limpiar
              </Button>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
              {Object.entries(filtrosActivos).map(([key, value]) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="text-[10px] sm:text-xs py-0.5"
                >
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 sm:mt-6 gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto h-10 text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1.5" />
                  <span>Buscar</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={loading}
              className="w-full sm:w-auto h-10 text-sm"
            >
              <X className="w-4 h-4 mr-1.5" />
              <span>Limpiar</span>
            </Button>

            {getFiltrosActivosCount() > 0 && onSaveFiltros && (
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(true)}
                disabled={loading}
                className="w-full sm:w-auto h-10 text-sm"
              >
                <Save className="w-4 h-4 mr-1.5" />
                <span>Guardar Filtros</span>
              </Button>
            )}
          </div>
        </div>

        {/* Dialog para guardar filtros */}
        {showSaveDialog && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="nombreFiltro" className="text-xs sm:text-sm">
                Nombre del filtro
              </Label>
              <Input
                id="nombreFiltro"
                value={nombreFiltro}
                onChange={(e) => setNombreFiltro(e.target.value)}
                placeholder="Ej: Brazaletes Isla Disponibles"
                className="h-9 text-sm"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveFiltros}
                  disabled={!nombreFiltro.trim()}
                  className="w-full sm:w-auto h-9 text-sm"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Guardar</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setNombreFiltro("");
                  }}
                  className="w-full sm:w-auto h-9 text-sm"
                >
                  <span>Cancelar</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
