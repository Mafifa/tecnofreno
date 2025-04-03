import { getDb } from './db'
export class OrdenTrabajoModel {
  static async getById(id: number) {
    const db = await getDb()
    return db.get(
      `
      SELECT o.*, 
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono,
        v.modelo as vehiculo_modelo,
        v.placa as vehiculo_placa,
        v.anio as vehiculo_anio,
        v.tipo as vehiculo_tipo,
        m.nombre as mecanico_nombre,
        g.tiempo as garantia_tiempo,
        g.unidad as garantia_unidad
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
      ORDER BY ot.id DESC
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
      ORDER BY ot.id DESC
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
      ORDER BY ot.id DESC
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

  static async getHistorial(filtros: {
    clienteId?: number
    vehiculoId?: number
    mecanicoId?: number
    pagina: number
    itemsPorPagina: number
  }): Promise<{ ordenes: any[]; totalPaginas: number; totalRegistros: number }> {
    const db = await getDb()
    const { pagina, itemsPorPagina, clienteId, vehiculoId, mecanicoId } = filtros
    const offset = (pagina - 1) * itemsPorPagina

    // Construir la consulta base
    let queryBase = `
      FROM OrdenTrabajo ot
      JOIN Cliente c ON ot.cliente_id = c.id
      JOIN Vehiculo v ON ot.vehiculo_id = v.id
      JOIN Mecanico m ON ot.mecanico_id = m.id
      LEFT JOIN Garantia g ON ot.garantia_id = g.id
      WHERE 1=1
    `

    // Array para almacenar los parámetros
    const params: any[] = []

    // Añadir condiciones según los filtros
    if (clienteId) {
      queryBase += ` AND ot.cliente_id = ?`
      params.push(clienteId)
    }

    if (vehiculoId) {
      queryBase += ` AND ot.vehiculo_id = ?`
      params.push(vehiculoId)
    }

    if (mecanicoId) {
      queryBase += ` AND ot.mecanico_id = ?`
      params.push(mecanicoId)
    }

    // Consulta para obtener el total de registros
    const countQuery = `SELECT COUNT(*) as total ${queryBase}`
    const { total } = await db.get(countQuery, params)
    const totalPaginas = Math.ceil(total / itemsPorPagina)

    // Consulta para obtener las órdenes con paginación
    const dataQuery = `
      SELECT 
        ot.*,
        c.nombre AS cliente_nombre,
        c.telefono AS cliente_telefono,
        v.modelo AS vehiculo_modelo,
        v.placa AS vehiculo_placa,
        v.anio AS vehiculo_anio,
        v.tipo AS vehiculo_tipo,
        m.nombre AS mecanico_nombre,
        g.tiempo AS garantia_tiempo,
        g.unidad AS garantia_unidad
      ${queryBase}
      ORDER BY ot.id DESC
      LIMIT ? OFFSET ?
    `

    // Añadir parámetros de paginación
    const dataParams = [...params, itemsPorPagina, offset]
    const ordenes = await db.all(dataQuery, dataParams)

    return { ordenes, totalPaginas, totalRegistros: total }
  }
}
