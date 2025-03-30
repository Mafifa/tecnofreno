import { getDb } from './db'

export interface OrdenTrabajoDetallada {
  id: number
  fecha: string
  trabajo_realizado: string
  notas?: string
  cliente_id: number
  vehiculo_id: number
  mecanico_id: number
  garantia_id?: number
}

export class OrdenTrabajoModel {
  static async getById(id: number) {
    const db = await getDb()
    return db.get(
      `
      SELECT o.*, 
        c.nombre as cliente_nombre,
        c.cedula_rif,
        c.telefono,
        v.modelo,
        v.placa,
        v.anio,
        v.tipo,
        m.nombre as mecanico_nombre,
        g.tiempo,
        g.unidad
      FROM OrdenTrabajo o
      JOIN Cliente c ON o.cliente_id = c.id
      JOIN Vehiculo v ON o.vehiculo_id = v.id
      JOIN Mecanico m ON o.mecanico_id = m.id
      LEFT JOIN Garantia g ON o.garantia_id = g.id
      WHERE o.id = ?
    `,
      [id]
    )
  }
  // Crear orden
  static async create(ordenData: {
    fecha: string
    trabajo_realizado: string
    notas?: string
    cliente_id: number
    vehiculo_id: number
    mecanico_id: number
    garantia_id?: number
  }) {
    const db = await getDb()
    const result = await db.run(
      `
      INSERT INTO OrdenTrabajo (
        fecha,
        trabajo_realizado,
        notas,
        cliente_id,
        vehiculo_id,
        mecanico_id,
        garantia_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        ordenData.fecha,
        ordenData.trabajo_realizado,
        ordenData.notas || null,
        ordenData.cliente_id,
        ordenData.vehiculo_id,
        ordenData.mecanico_id,
        ordenData.garantia_id || null
      ]
    )

    // Retornar el ID de la nueva orden creada
    return { id: result.lastID }
  }
}
