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

  static async getByPlaca(
    placa: string,
    page?: number,
    itemsPerPage?: number
  ): Promise<{ ordenes: OrdenTrabajo[]; hayMas?: boolean }> {
    const db = await getDb()

    if (page === undefined || itemsPerPage === undefined) {
      // Si no se proporcionan `page` e `itemsPerPage`, devolver las 3 órdenes más recientes
      const query = `
      SELECT ot.*
      FROM OrdenTrabajo ot
      INNER JOIN Vehiculo v ON ot.vehiculo_id = v.id
      WHERE v.placa = ?
      ORDER BY ot.fecha DESC
      LIMIT 3
    `
      const ordenes = await db.all(query, [placa])
      return { ordenes }
    } else {
      // Si se proporcionan `page` e `itemsPerPage`, aplicar paginación
      const offset = (page - 1) * itemsPerPage

      const query = `
      SELECT ot.*
      FROM OrdenTrabajo ot
      INNER JOIN Vehiculo v ON ot.vehiculo_id = v.id
      WHERE v.placa = ?
      ORDER BY ot.fecha ASC
      LIMIT ? OFFSET ?
    `
      const ordenes = await db.all(query, [placa, itemsPerPage, offset])

      // Verificar si hay más resultados
      const countQuery = `
      SELECT COUNT(*) as total
      FROM OrdenTrabajo ot
      INNER JOIN Vehiculo v ON ot.vehiculo_id = v.id
      WHERE v.placa = ?
    `
      const { total } = await db.get(countQuery, [placa])
      const hayMas = offset + itemsPerPage < total

      return { ordenes, hayMas }
    }
  }

  static async getByMecanicoId(
    mecanicoId: number,
    page: number,
    itemsPerPage: number
  ): Promise<{ ordenes: OrdenTrabajo[]; hayMas: boolean }> {
    const db = await getDb()
    const offset = (page - 1) * itemsPerPage

    const query = `
      SELECT ot.*,
        c.nombre AS cliente_nombre,
        v.modelo AS vehiculo_modelo,
        v.placa AS vehiculo_placa,
        v.anio AS vehiculo_anio,
        v.tipo AS vehiculo_tipo
      FROM OrdenTrabajo ot
      JOIN Cliente c ON ot.cliente_id = c.id
      JOIN Vehiculo v ON ot.vehiculo_id = v.id
      WHERE ot.mecanico_id = ?
      ORDER BY ot.fecha ASC
      LIMIT ? OFFSET ?
    `
    const ordenes = await db.all(query, [mecanicoId, itemsPerPage, offset])

    // Verificar si hay más resultados
    const countQuery = `
      SELECT COUNT(*) as total
      FROM OrdenTrabajo
      WHERE mecanico_id = ?
    `
    const { total } = await db.get(countQuery, [mecanicoId])
    const hayMas = offset + itemsPerPage < total

    return { ordenes, hayMas }
  }
}
