import type { FiltrosBrazaletes } from "@/lib/types/brazaletes";

export interface FiltroGuardado {
  id: string;
  nombre: string;
  filtros: FiltrosBrazaletes;
}

export class LocalStorageService {
  private static readonly STORAGE_KEY = "brazaletes-filtros-guardados";

  static loadFiltrosGuardados(): FiltroGuardado[] {
    try {
      const filtrosGuardadosStr = localStorage.getItem(this.STORAGE_KEY);
      if (filtrosGuardadosStr) {
        const filtros = JSON.parse(filtrosGuardadosStr);
        console.log("🔍 Búsqueda: Filtros guardados cargados:", filtros.length);
        return filtros;
      }
      return [];
    } catch (error) {
      console.error("🔍 Búsqueda: Error al cargar filtros guardados:", error);
      return [];
    }
  }

  static saveFiltrosGuardados(filtros: FiltroGuardado[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtros));
      console.log("🔍 Búsqueda: Filtros guardados:", filtros.length);
    } catch (error) {
      console.error("🔍 Búsqueda: Error al guardar filtros:", error);
    }
  }

  static addFiltroGuardado(nombre: string, filtros: FiltrosBrazaletes): FiltroGuardado[] {
    const filtrosExistentes = this.loadFiltrosGuardados();
    const nuevoFiltro: FiltroGuardado = {
      id: Date.now().toString(),
      nombre,
      filtros,
    };

    const nuevosFiltros = [...filtrosExistentes, nuevoFiltro];
    this.saveFiltrosGuardados(nuevosFiltros);
    return nuevosFiltros;
  }
}
