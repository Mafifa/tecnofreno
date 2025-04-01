import { getDb } from './db'

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
  static async create(ordenData: Omit<OrdenTrabajo, 'id'>) {
    const db = await getDb()
    const result = await db.run(
      `
      INSERT INTO OrdenTrabajo (
        fecha,
        vehiculo_id,
        mecanico_id,
        cliente_id,
        trabajo_realizado,
        notas,
        garantia_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        ordenData.fecha,
        ordenData.vehiculo_id,
        ordenData.mecanico_id,
        ordenData.cliente_id,
        ordenData.trabajo_realizado,
        ordenData.notas || null,
        ordenData.garantia_id || null
      ]
    )

    // Retornar el ID de la nueva orden creada
    return { id: result.lastID }
  }

  static async getByPlaca(placa: string): Promise<OrdenTrabajo[]> {
    const db = await getDb()
    const query = `
    SELECT ot.*
    FROM OrdenTrabajo ot
    INNER JOIN Vehiculo v ON ot.vehiculo_id = v.id
    WHERE v.placa = ?
    ORDER BY ot.fecha DESC
    LIMIT 5
  `
    const ordenes = await db.all(query, [placa])
    return ordenes
  }
}
