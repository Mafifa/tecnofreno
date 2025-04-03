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

export class ConfiguracionModel {
  // ===== MECÁNICOS =====
  static async obtenerMecanicos(busqueda = ''): Promise<Mecanico[]> {
    const db = await getDb()

    let query = `
      SELECT 
        m.id, 
        m.nombre,
        (SELECT COUNT(*) FROM OrdenTrabajo ot WHERE ot.mecanico_id = m.id) as ordenes_count
      FROM Mecanico m
    `

    const params: any[] = []

    if (busqueda) {
      query += ` WHERE m.nombre LIKE ? `
      params.push(`%${busqueda}%`)
    }

    query += ` ORDER BY m.nombre `

    return db.all(query, params)
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
  static async obtenerClientes(busqueda = ''): Promise<Cliente[]> {
    const db = await getDb()

    let query = `
      SELECT 
        c.id, 
        c.nombre,
        c.telefono,
        (SELECT COUNT(*) FROM Vehiculo v WHERE v.cliente_id = c.id) as vehiculos_count,
        (SELECT COUNT(*) FROM OrdenTrabajo ot WHERE ot.cliente_id = c.id) as ordenes_count
      FROM Cliente c
    `

    const params: any[] = []

    if (busqueda) {
      query += ` WHERE c.nombre LIKE ? OR c.telefono LIKE ? `
      params.push(`%${busqueda}%`, `%${busqueda}%`)
    }

    query += ` ORDER BY c.nombre `

    return db.all(query, params)
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
  static async obtenerVehiculos(busqueda = ''): Promise<Vehiculo[]> {
    const db = await getDb()

    let query = `
      SELECT 
        v.id, 
        v.modelo,
        v.placa,
        v.anio,
        v.tipo,
        v.cliente_id,
        c.nombre as cliente_nombre,
        (SELECT COUNT(*) FROM OrdenTrabajo ot WHERE ot.vehiculo_id = v.id) as ordenes_count
      FROM Vehiculo v
      JOIN Cliente c ON v.cliente_id = c.id
    `

    const params: any[] = []

    if (busqueda) {
      query += ` WHERE v.modelo LIKE ? OR v.placa LIKE ? OR c.nombre LIKE ? `
      params.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`)
    }

    query += ` ORDER BY v.placa `

    return db.all(query, params)
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
  static async obtenerOrdenes(busqueda = ''): Promise<OrdenResumen[]> {
    const db = await getDb()

    let query = `
      SELECT 
        ot.id, 
        ot.fecha,
        c.nombre as cliente_nombre,
        v.placa as vehiculo_placa,
        m.nombre as mecanico_nombre,
        ot.trabajo_realizado
      FROM OrdenTrabajo ot
      JOIN Cliente c ON ot.cliente_id = c.id
      JOIN Vehiculo v ON ot.vehiculo_id = v.id
      JOIN Mecanico m ON ot.mecanico_id = m.id
    `

    const params: any[] = []

    if (busqueda) {
      query += ` 
        WHERE ot.id LIKE ? 
        OR c.nombre LIKE ? 
        OR v.placa LIKE ? 
        OR m.nombre LIKE ?
        OR ot.trabajo_realizado LIKE ?
      `
      params.push(
        `%${busqueda}%`,
        `%${busqueda}%`,
        `%${busqueda}%`,
        `%${busqueda}%`,
        `%${busqueda}%`
      )
    }

    query += `
      ORDER BY ot.id DESC
      LIMIT 100
    `

    return db.all(query, params)
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
