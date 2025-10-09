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
        return filtros;
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  static saveFiltrosGuardados(filtros: FiltroGuardado[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtros));
    } catch (error) {}
  }

  static addFiltroGuardado(
    nombre: string,
    filtros: FiltrosBrazaletes
  ): FiltroGuardado[] {
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
