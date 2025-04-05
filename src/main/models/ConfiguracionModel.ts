import { getDb } from './db'

export interface Mecanico {
  id: number
  nombre: string
  ordenes_count?: number
}

export interface Cliente {
  id: number
  nombre: string
  telefono: string
  vehiculos_count?: number
  ordenes_count?: number
}

export interface Vehiculo {
  id: number
  modelo: string
  placa: string
  anio: number
  tipo: string
  cliente_id: number
  cliente_nombre?: string
  ordenes_count?: number
}

export interface OrdenResumen {
  id: number
  fecha: string
  cliente_nombre: string
  vehiculo_placa: string
  mecanico_nombre: string
  trabajo_realizado: string
}

export interface Garantia {
  id: number
  tiempo: number
  unidad: 'dias' | 'semanas' | 'meses'
  ordenes_count?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export interface QueryParams {
  busqueda?: string
  pagina: number
  itemsPorPagina: number
}

export class ConfiguracionModel {
  // ===== MECÁNICOS =====
  static async obtenerMecanicos(params: QueryParams): Promise<PaginatedResponse<Mecanico>> {
    const db = await getDb()
    const { busqueda = '', pagina = 1, itemsPorPagina = 10 } = params
    const offset = (pagina - 1) * itemsPorPagina

    // Construir la consulta base
    let queryBase = `
      FROM Mecanico m
      WHERE 1=1
    `

    // Parámetros para la consulta
    const queryParams: any[] = []

    // Añadir condición de búsqueda si existe
    if (busqueda) {
      queryBase += ` AND m.nombre LIKE ? `
      queryParams.push(`%${busqueda}%`)
    }

    // Consulta para contar el total de registros
    const countQuery = `SELECT COUNT(*) as total ${queryBase}`
    const { total } = await db.get(countQuery, queryParams)
    const totalPages = Math.ceil(total / itemsPorPagina)

    // Consulta para obtener los datos paginados
    const dataQuery = `
      SELECT 
        m.id, 
        m.nombre,
        (SELECT COUNT(*) FROM OrdenTrabajo ot WHERE ot.mecanico_id = m.id) as ordenes_count
      ${queryBase}
      ORDER BY m.id DESC
      LIMIT ? OFFSET ?
    `

    // Añadir parámetros de paginación
    const dataParams = [...queryParams, itemsPorPagina, offset]
    const items = await db.all(dataQuery, dataParams)

    return {
      items,
      totalItems: total,
      totalPages,
      currentPage: pagina
    }
  }

  static async eliminarMecanico(id: number): Promise<boolean> {
    const db = await getDb()

    try {
      // La base de datos tiene ON DELETE CASCADE para órdenes de trabajo
      await db.run('DELETE FROM Mecanico WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Error al eliminar mecánico:', error)
      throw error
    }
  }

  // ===== CLIENTES =====
  static async obtenerClientes(params: QueryParams): Promise<PaginatedResponse<Cliente>> {
    const db = await getDb()
    const { busqueda = '', pagina = 1, itemsPorPagina = 10 } = params
    const offset = (pagina - 1) * itemsPorPagina

    // Construir la consulta base
    let queryBase = `
      FROM Cliente c
      WHERE 1=1
    `

    // Parámetros para la consulta
    const queryParams: any[] = []

    // Añadir condición de búsqueda si existe
    if (busqueda) {
      queryBase += ` AND (c.nombre LIKE ? OR c.telefono LIKE ?) `
      queryParams.push(`%${busqueda}%`, `%${busqueda}%`)
    }

    // Consulta para contar el total de registros
    const countQuery = `SELECT COUNT(*) as total ${queryBase}`
    const { total } = await db.get(countQuery, queryParams)
    const totalPages = Math.ceil(total / itemsPorPagina)

    // Consulta para obtener los datos paginados
    const dataQuery = `
      SELECT 
        c.id, 
        c.nombre,
        c.telefono,
        (SELECT COUNT(*) FROM Vehiculo v WHERE v.cliente_id = c.id) as vehiculos_count,
        (SELECT COUNT(*) FROM OrdenTrabajo ot WHERE ot.cliente_id = c.id) as ordenes_count
      ${queryBase}
      ORDER BY c.id DESC
      LIMIT ? OFFSET ?
    `

    // Añadir parámetros de paginación
    const dataParams = [...queryParams, itemsPorPagina, offset]
    const items = await db.all(dataQuery, dataParams)

    return {
      items,
      totalItems: total,
      totalPages,
      currentPage: pagina
    }
  }

  static async eliminarCliente(id: number): Promise<boolean> {
    const db = await getDb()

    try {
      // La base de datos tiene ON DELETE CASCADE para vehículos y órdenes
      await db.run('DELETE FROM Cliente WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      throw error
    }
  }

  // ===== VEHÍCULOS =====
  static async obtenerVehiculos(params: QueryParams): Promise<PaginatedResponse<Vehiculo>> {
    const db = await getDb()
    const { busqueda = '', pagina = 1, itemsPorPagina = 10 } = params
    const offset = (pagina - 1) * itemsPorPagina

    // Construir la consulta base
    let queryBase = `
      FROM Vehiculo v
      JOIN Cliente c ON v.cliente_id = c.id
      WHERE 1=1
    `

    // Parámetros para la consulta
    const queryParams: any[] = []

    // Añadir condición de búsqueda si existe
    if (busqueda) {
      queryBase += ` AND (v.modelo LIKE ? OR v.placa LIKE ? OR c.nombre LIKE ?) `
      queryParams.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`)
    }

    // Consulta para contar el total de registros
    const countQuery = `SELECT COUNT(*) as total ${queryBase}`
    const { total } = await db.get(countQuery, queryParams)
    const totalPages = Math.ceil(total / itemsPorPagina)

    // Consulta para obtener los datos paginados
    const dataQuery = `
      SELECT 
        v.id, 
        v.modelo,
        v.placa,
        v.anio,
        v.tipo,
        v.cliente_id,
        c.nombre as cliente_nombre,
        (SELECT COUNT(*) FROM OrdenTrabajo ot WHERE ot.vehiculo_id = v.id) as ordenes_count
      ${queryBase}
      ORDER BY v.id DESC
      LIMIT ? OFFSET ?
    `

    // Añadir parámetros de paginación
    const dataParams = [...queryParams, itemsPorPagina, offset]
    const items = await db.all(dataQuery, dataParams)

    return {
      items,
      totalItems: total,
      totalPages,
      currentPage: pagina
    }
  }

  static async eliminarVehiculo(id: number): Promise<boolean> {
    const db = await getDb()

    try {
      // La base de datos tiene ON DELETE CASCADE para órdenes
      await db.run('DELETE FROM Vehiculo WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Error al eliminar vehículo:', error)
      throw error
    }
  }

  // ===== ÓRDENES =====
  static async obtenerOrdenes(params: QueryParams): Promise<PaginatedResponse<OrdenResumen>> {
    const db = await getDb()
    const { busqueda = '', pagina = 1, itemsPorPagina = 10 } = params
    const offset = (pagina - 1) * itemsPorPagina

    // Construir la consulta base
    let queryBase = `
      FROM OrdenTrabajo ot
      JOIN Cliente c ON ot.cliente_id = c.id
      JOIN Vehiculo v ON ot.vehiculo_id = v.id
      JOIN Mecanico m ON ot.mecanico_id = m.id
      WHERE 1=1
    `

    // Parámetros para la consulta
    const queryParams: any[] = []

    // Añadir condición de búsqueda si existe
    if (busqueda) {
      queryBase += ` 
        AND (ot.id LIKE ? 
        OR c.nombre LIKE ? 
        OR v.placa LIKE ? 
        OR m.nombre LIKE ?
        OR ot.trabajo_realizado LIKE ?)
      `
      queryParams.push(
        `%${busqueda}%`,
        `%${busqueda}%`,
        `%${busqueda}%`,
        `%${busqueda}%`,
        `%${busqueda}%`
      )
    }

    // Consulta para contar el total de registros
    const countQuery = `SELECT COUNT(*) as total ${queryBase}`
    const { total } = await db.get(countQuery, queryParams)
    const totalPages = Math.ceil(total / itemsPorPagina)

    // Consulta para obtener los datos paginados
    const dataQuery = `
      SELECT 
        ot.id, 
        ot.fecha,
        c.nombre as cliente_nombre,
        v.placa as vehiculo_placa,
        m.nombre as mecanico_nombre,
        ot.trabajo_realizado
      ${queryBase}
      ORDER BY ot.id DESC
      LIMIT ? OFFSET ?
    `

    // Añadir parámetros de paginación
    const dataParams = [...queryParams, itemsPorPagina, offset]
    const items = await db.all(dataQuery, dataParams)

    return {
      items,
      totalItems: total,
      totalPages,
      currentPage: pagina
    }
  }

  static async eliminarOrden(id: number): Promise<boolean> {
    const db = await getDb()

    try {
      await db.run('DELETE FROM OrdenTrabajo WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Error al eliminar orden:', error)
      throw error
    }
  }

  // ===== GARANTÍAS =====
  static async obtenerGarantias(): Promise<Garantia[]> {
    const db = await getDb()

    const query = `
      SELECT 
        g.id, 
        g.tiempo,
        g.unidad,
        (SELECT COUNT(*) FROM OrdenTrabajo ot WHERE ot.garantia_id = g.id) as ordenes_count
      FROM Garantia g
      ORDER BY g.tiempo, g.unidad
    `

    return db.all(query)
  }

  static async eliminarGarantia(id: number): Promise<boolean> {
    const db = await getDb()

    try {
      // La base de datos tiene ON DELETE SET NULL para garantías en órdenes
      await db.run('DELETE FROM Garantia WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Error al eliminar garantía:', error)
      throw error
    }
  }

  // ===== MÉTODOS AUXILIARES =====

  // Método para formatear la fecha en el formato DD/MM/YYYY
  static formatearFecha(fecha: string): string {
    try {
      // Si la fecha ya está en formato DD/MM/YYYY, HH:MM
      if (fecha.includes('/')) {
        return fecha.split(',')[0] // Devolver solo la parte de la fecha
      }

      // Si es una fecha ISO o timestamp
      const fechaObj = new Date(fecha)
      return fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      console.error('Error al formatear fecha:', error)
      return fecha // Devolver la fecha original si hay error
    }
  }
}
