import { OrdenTrabajoModel } from '../models/OrdenTrabajoModel';

export class OrdenController {
  static async getOrdenDetalle(id: number) {
    try {
      const orden = await OrdenTrabajoModel.getById(id);
      if (!orden) throw new Error('Orden no encontrada');
      return orden;
    } catch (error) {
      throw new Error('Error al obtener detalle de orden');
    }
  }
}