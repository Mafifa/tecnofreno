import { getDb } from './db'

export interface AnalisisData {
  kpis: {
    totalOrdenes: number
    promedioDiario: number
    mecanicoDestacado: {
      nombre: string
      ordenes: number
    }
    garantiasActivas: number
  }
  ordenesporTiempo: Array<{
    fecha: string
    cantidad: number
  }>
  distribucionVehiculos: Array<{
    tipo: string
    cantidad: number
  }>
  ordenesPorMecanico: Array<{
    nombre: string
    ordenes: number
  }>
  distribucionAnios: Array<{
    anio: number
    cantidad: number
  }>
  clientesFrecuentes: Array<{
    nombre: string
    ordenes: number
  }>
  vehiculosConMasServicios: Array<{
    modelo: string
    placa: string
    tipo: string
    servicios: number
    anio: number
  }>
}

export class AnalisisModel {
  /**
   * Obtiene los datos de análisis según el período seleccionado
   * @param periodo 'semana', 'mes' o 'año'
   */
  static async obtenerDatosAnalisis(periodo: 'semana' | 'mes' | 'año'): Promise<AnalisisData> {
    const db = await getDb()

    // Determinar la fecha de inicio según el período
    const fechaInicio = this.obtenerFechaInicio(periodo)

    // Obtener todos los datos necesarios
    const [
      kpis,
      ordenesporTiempo,
      distribucionVehiculos,
      ordenesPorMecanico,
      distribucionAnios,
      clientesFrecuentes,
      vehiculosConMasServicios
    ] = await Promise.all([
      this.obtenerKPIs(db, fechaInicio),
      this.obtenerOrdenesPorTiempo(db, fechaInicio, periodo),
      this.obtenerDistribucionVehiculos(db, fechaInicio),
      this.obtenerOrdenesPorMecanico(db, fechaInicio),
      this.obtenerDistribucionAnios(db),
      this.obtenerClientesFrecuentes(db, fechaInicio),
      this.obtenerVehiculosConMasServicios(db)
    ])

    return {
      kpis,
      ordenesporTiempo,
      distribucionVehiculos,
      ordenesPorMecanico,
      distribucionAnios,
      clientesFrecuentes,
      vehiculosConMasServicios
    }
  }

  /**
   * Calcula la fecha de inicio según el período seleccionado y la formatea en DD/MM/YYYY
   */
  private static obtenerFechaInicio(periodo: 'semana' | 'mes' | 'año'): string {
    const hoy = new Date()
    const fechaInicio = new Date()

    switch (periodo) {
      case 'semana':
        fechaInicio.setDate(hoy.getDate() - 7)
        break
      case 'mes':
        fechaInicio.setMonth(hoy.getMonth() - 1)
        break
      case 'año':
        fechaInicio.setFullYear(hoy.getFullYear() - 1)
        break
    }

    // Formatear la fecha como DD/MM/YYYY
    const dia = fechaInicio.getDate().toString().padStart(2, '0')
    const mes = (fechaInicio.getMonth() + 1).toString().padStart(2, '0')
    const anio = fechaInicio.getFullYear()

    return `${dia}/${mes}/${anio}`
  }

  /**
   * Obtiene los KPIs principales
   */
  private static async obtenerKPIs(db: any, fechaInicio: string) {
    // Total de órdenes en el período
    const { totalOrdenes } = await db.get(
      `
    SELECT COUNT(*) as totalOrdenes
    FROM OrdenTrabajo
    WHERE substr(fecha, 7, 4) || substr(fecha, 4, 2) || substr(fecha, 1, 2) >= 
          substr(?, 7, 4) || substr(?, 4, 2) || substr(?, 1, 2)
  `,
      [fechaInicio, fechaInicio, fechaInicio]
    )

    // Calcular el promedio diario de órdenes
    const hoy = new Date()
    const partesFecha = fechaInicio.split('/')
    const inicio = new Date(
      Number.parseInt(partesFecha[2]), // año
      Number.parseInt(partesFecha[1]) - 1, // mes (0-11)
      Number.parseInt(partesFecha[0]) // día
    )
    const diasTranscurridos = Math.max(
      1,
      Math.ceil((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
    )
    const promedioDiario = Math.round((totalOrdenes / diasTranscurridos) * 10) / 10 // Redondear a 1 decimal

    // Mecánico con más órdenes
    const mecanicoDestacado = (await db.get(
      `
    SELECT m.nombre, COUNT(ot.id) as ordenes
    FROM OrdenTrabajo ot
    JOIN Mecanico m ON ot.mecanico_id = m.id
    WHERE substr(ot.fecha, 7, 4) || substr(ot.fecha, 4, 2) || substr(ot.fecha, 1, 2) >= 
          substr(?, 7, 4) || substr(?, 4, 2) || substr(?, 1, 2)
    GROUP BY ot.mecanico_id
    ORDER BY ordenes DESC
    LIMIT 1
  `,
      [fechaInicio, fechaInicio, fechaInicio]
    )) || { nombre: 'N/A', ordenes: 0 }

    // Garantías activas - Convertir fechas para comparación
    const { garantiasActivas } = await db.get(
      `
    SELECT COUNT(*) as garantiasActivas
    FROM OrdenTrabajo ot
    JOIN Garantia g ON ot.garantia_id = g.id
    WHERE substr(ot.fecha, 7, 4) || substr(ot.fecha, 4, 2) || substr(ot.fecha, 1, 2) >= 
          substr(?, 7, 4) || substr(?, 4, 2) || substr(?, 1, 2)
    AND (
      (g.unidad = 'dias' AND julianday('now') - julianday(
        substr(ot.fecha, 7, 4) || '-' || substr(ot.fecha, 4, 2) || '-' || substr(ot.fecha, 1, 2)
      ) <= g.tiempo) OR
      (g.unidad = 'semanas' AND julianday('now') - julianday(
        substr(ot.fecha, 7, 4) || '-' || substr(ot.fecha, 4, 2) || '-' || substr(ot.fecha, 1, 2)
      ) <= g.tiempo * 7) OR
      (g.unidad = 'meses' AND julianday('now') - julianday(
        substr(ot.fecha, 7, 4) || '-' || substr(ot.fecha, 4, 2) || '-' || substr(ot.fecha, 1, 2)
      ) <= g.tiempo * 30)
    )
  `,
      [fechaInicio, fechaInicio, fechaInicio]
    )

    return {
      totalOrdenes,
      promedioDiario,
      mecanicoDestacado,
      garantiasActivas
    }
  }

  /**
   * Obtiene las órdenes por tiempo para el gráfico de línea
   */
  private static async obtenerOrdenesPorTiempo(
    db: any,
    fechaInicio: string,
    periodo: 'semana' | 'mes' | 'año'
  ) {
    let groupBy = ''

    switch (periodo) {
      case 'semana':
        // Agrupar por día (DD/MM/YYYY)
        groupBy = 'substr(fecha, 1, 10)'
        break
      case 'mes':
        // Agrupar por día (DD/MM/YYYY)
        groupBy = 'substr(fecha, 1, 10)'
        break
      case 'año':
        // Agrupar por mes (MM/YYYY)
        groupBy = 'substr(fecha, 4, 7)'
        break
    }

    const ordenesPorTiempo = await db.all(
      `
    SELECT 
      ${groupBy} as fecha,
      COUNT(*) as cantidad
    FROM OrdenTrabajo
    WHERE substr(fecha, 7, 4) || substr(fecha, 4, 2) || substr(fecha, 1, 2) >= 
          substr(?, 7, 4) || substr(?, 4, 2) || substr(?, 1, 2)
    GROUP BY ${groupBy}
    ORDER BY 
      substr(fecha, 7, 4), 
      substr(fecha, 4, 2), 
      substr(fecha, 1, 2)
  `,
      [fechaInicio, fechaInicio, fechaInicio]
    )

    // Para el caso de agrupación por mes, añadir un día ficticio para el formateo
    if (periodo === 'año') {
      return ordenesPorTiempo.map((item: any) => ({
        ...item,
        fecha: `01/${item.fecha}` // Añadir el día para que sea DD/MM/YYYY
      }))
    }

    return ordenesPorTiempo
  }

  /**
   * Obtiene la distribución de vehículos por tipo
   */
  private static async obtenerDistribucionVehiculos(db: any, fechaInicio: string) {
    return db.all(
      `
    SELECT 
      v.tipo,
      COUNT(*) as cantidad
    FROM OrdenTrabajo ot
    JOIN Vehiculo v ON ot.vehiculo_id = v.id
    WHERE substr(ot.fecha, 7, 4) || substr(ot.fecha, 4, 2) || substr(ot.fecha, 1, 2) >= 
          substr(?, 7, 4) || substr(?, 4, 2) || substr(?, 1, 2)
    GROUP BY v.tipo
    ORDER BY cantidad DESC
  `,
      [fechaInicio, fechaInicio, fechaInicio]
    )
  }

  /**
   * Obtiene las órdenes por mecánico
   */
  private static async obtenerOrdenesPorMecanico(db: any, fechaInicio: string) {
    return db.all(
      `
    SELECT 
      m.nombre,
      COUNT(ot.id) as ordenes
    FROM OrdenTrabajo ot
    JOIN Mecanico m ON ot.mecanico_id = m.id
    WHERE substr(ot.fecha, 7, 4) || substr(ot.fecha, 4, 2) || substr(ot.fecha, 1, 2) >= 
          substr(?, 7, 4) || substr(?, 4, 2) || substr(?, 1, 2)
    GROUP BY ot.mecanico_id
    ORDER BY ordenes DESC
  `,
      [fechaInicio, fechaInicio, fechaInicio]
    )
  }

  /**
   * Obtiene la distribución de vehículos por año de fabricación
   */
  private static async obtenerDistribucionAnios(db: any) {
    return db.all(`
      SELECT 
        v.anio,
        COUNT(*) as cantidad
      FROM Vehiculo v
      GROUP BY v.anio
      ORDER BY v.anio DESC
    `)
  }

  /**
   * Obtiene los clientes más frecuentes
   */
  private static async obtenerClientesFrecuentes(db: any, fechaInicio: string) {
    return db.all(
      `
    SELECT 
      c.nombre,
      COUNT(ot.id) as ordenes
    FROM OrdenTrabajo ot
    JOIN Cliente c ON ot.cliente_id = c.id
    WHERE substr(ot.fecha, 7, 4) || substr(ot.fecha, 4, 2) || substr(ot.fecha, 1, 2) >= 
          substr(?, 7, 4) || substr(?, 4, 2) || substr(?, 1, 2)
    GROUP BY ot.cliente_id
    ORDER BY ordenes DESC
    LIMIT 10
  `,
      [fechaInicio, fechaInicio, fechaInicio]
    )
  }

  /**
   * Obtiene los vehículos con más servicios
   */
  private static async obtenerVehiculosConMasServicios(db: any) {
    return db.all(`
      SELECT 
        v.modelo,
        v.placa,
        v.tipo,
        v.anio,
        COUNT(ot.id) as servicios
      FROM OrdenTrabajo ot
      JOIN Vehiculo v ON ot.vehiculo_id = v.id
      GROUP BY ot.vehiculo_id
      ORDER BY servicios DESC
      LIMIT 10
    `)
  }
}
