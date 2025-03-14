// Servicio para obtener datos de análisis
// En un entorno real, estos datos vendrían de la base de datos SQLite

// Función para generar datos aleatorios para fechas
const generarFechasRecientes = (dias: number) => {
  const fechas = []
  const hoy = new Date()

  for (let i = dias; i >= 0; i--) {
    const fecha = new Date()
    fecha.setDate(hoy.getDate() - i)
    fechas.push(fecha.toISOString().split('T')[0])
  }

  return fechas
}

// Función para generar datos aleatorios
const generarDatosAleatorios = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Función para obtener datos de análisis según el período seleccionado
export const obtenerDatosAnalisis = async (periodo: 'semana' | 'mes' | 'año') => {
  // Simulamos un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Determinamos el número de días según el período
  let dias = 0
  switch (periodo) {
    case 'semana':
      dias = 7
      break
    case 'mes':
      dias = 30
      break
    case 'año':
      dias = 365
      break
  }

  // Generamos fechas para el período
  const fechas = generarFechasRecientes(dias)

  // Generamos datos de órdenes por tiempo
  const ordenesporTiempo = fechas.map((fecha) => ({
    fecha,
    cantidad: generarDatosAleatorios(1, 15)
  }))

  // Calculamos el total de órdenes
  const totalOrdenes = ordenesporTiempo.reduce((sum, item) => sum + item.cantidad, 0)

  // Datos de órdenes por mecánico
  const ordenesPorMecanico = [
    { id: 1, nombre: 'Carlos Rodríguez', ordenes: generarDatosAleatorios(20, 50) },
    { id: 2, nombre: 'Luis Martínez', ordenes: generarDatosAleatorios(15, 45) },
    { id: 3, nombre: 'Miguel Sánchez', ordenes: generarDatosAleatorios(25, 55) },
    { id: 4, nombre: 'Ana Gómez', ordenes: generarDatosAleatorios(10, 40) }
  ].sort((a, b) => b.ordenes - a.ordenes)

  // Datos de distribución de vehículos por tipo
  const distribucionVehiculos = [
    { tipo: 'Sedan', cantidad: generarDatosAleatorios(30, 100) },
    { tipo: 'SUV', cantidad: generarDatosAleatorios(20, 80) },
    { tipo: 'Pickup', cantidad: generarDatosAleatorios(15, 50) },
    { tipo: 'Compacto', cantidad: generarDatosAleatorios(10, 40) },
    { tipo: 'Deportivo', cantidad: generarDatosAleatorios(5, 20) }
  ]

  // Datos de distribución por año de fabricación
  const distribucionAnios = [
    { anio: 2023, cantidad: generarDatosAleatorios(5, 15) },
    { anio: 2022, cantidad: generarDatosAleatorios(8, 20) },
    { anio: 2021, cantidad: generarDatosAleatorios(10, 25) },
    { anio: 2020, cantidad: generarDatosAleatorios(12, 30) },
    { anio: 2019, cantidad: generarDatosAleatorios(10, 25) },
    { anio: 2018, cantidad: generarDatosAleatorios(8, 20) },
    { anio: 2017, cantidad: generarDatosAleatorios(5, 15) },
    { anio: '2016 o anterior', cantidad: generarDatosAleatorios(15, 40) }
  ]

  // Datos de clientes frecuentes
  const clientesFrecuentes = [
    { id: 1, nombre: 'Juan Pérez', ordenes: generarDatosAleatorios(3, 10) },
    { id: 2, nombre: 'María González', ordenes: generarDatosAleatorios(2, 8) },
    { id: 3, nombre: 'Carlos Rodríguez', ordenes: generarDatosAleatorios(4, 12) },
    { id: 4, nombre: 'Ana Martínez', ordenes: generarDatosAleatorios(3, 9) },
    { id: 5, nombre: 'Luis Hernández', ordenes: generarDatosAleatorios(2, 7) },
    { id: 6, nombre: 'Laura Sánchez', ordenes: generarDatosAleatorios(1, 6) },
    { id: 7, nombre: 'Roberto Díaz', ordenes: generarDatosAleatorios(2, 5) },
    { id: 8, nombre: 'Patricia López', ordenes: generarDatosAleatorios(1, 4) }
  ].sort((a, b) => b.ordenes - a.ordenes)

  // Datos de distribución de garantías
  const distribucionGarantias = [
    { tipo: 'Sin garantía', cantidad: generarDatosAleatorios(10, 30) },
    { tipo: '30 días', cantidad: generarDatosAleatorios(20, 50) },
    { tipo: '3 meses', cantidad: generarDatosAleatorios(15, 40) },
    { tipo: '6 meses', cantidad: generarDatosAleatorios(5, 20) }
  ]

  // Datos de trabajos realizados frecuentes
  const trabajosRealizados = [
    {
      trabajo: 'Cambio de aceite y filtro',
      cantidad: generarDatosAleatorios(30, 80),
      porcentaje: generarDatosAleatorios(15, 25)
    },
    {
      trabajo: 'Alineación y balanceo',
      cantidad: generarDatosAleatorios(20, 60),
      porcentaje: generarDatosAleatorios(10, 20)
    },
    {
      trabajo: 'Cambio de frenos',
      cantidad: generarDatosAleatorios(15, 50),
      porcentaje: generarDatosAleatorios(8, 18)
    },
    {
      trabajo: 'Reparación eléctrica',
      cantidad: generarDatosAleatorios(10, 40),
      porcentaje: generarDatosAleatorios(5, 15)
    },
    {
      trabajo: 'Diagnóstico general',
      cantidad: generarDatosAleatorios(25, 70),
      porcentaje: generarDatosAleatorios(12, 22)
    },
    {
      trabajo: 'Cambio de batería',
      cantidad: generarDatosAleatorios(8, 35),
      porcentaje: generarDatosAleatorios(4, 12)
    },
    {
      trabajo: 'Reparación de suspensión',
      cantidad: generarDatosAleatorios(5, 30),
      porcentaje: generarDatosAleatorios(3, 10)
    },
    {
      trabajo: 'Cambio de correa de distribución',
      cantidad: generarDatosAleatorios(3, 25),
      porcentaje: generarDatosAleatorios(2, 8)
    }
  ].sort((a, b) => b.cantidad - a.cantidad)

  // Datos de vehículos con más servicios
  const vehiculosConMasServicios = [
    {
      modelo: 'Toyota Corolla',
      placa: 'ABC123',
      tipo: 'Sedan',
      servicios: generarDatosAleatorios(10, 30),
      anio: 2020
    },
    {
      modelo: 'Ford F-150',
      placa: 'DEF456',
      tipo: 'Pickup',
      servicios: generarDatosAleatorios(8, 25),
      anio: 2019
    },
    {
      modelo: 'Honda Civic',
      placa: 'GHI789',
      tipo: 'Sedan',
      servicios: generarDatosAleatorios(12, 35),
      anio: 2021
    },
    {
      modelo: 'Chevrolet Tahoe',
      placa: 'JKL012',
      tipo: 'SUV',
      servicios: generarDatosAleatorios(7, 20),
      anio: 2018
    },
    {
      modelo: 'Nissan Sentra',
      placa: 'MNO345',
      tipo: 'Sedan',
      servicios: generarDatosAleatorios(9, 28),
      anio: 2022
    },
    {
      modelo: 'Toyota Camry',
      placa: 'PQR678',
      tipo: 'Sedan',
      servicios: generarDatosAleatorios(6, 18),
      anio: 2017
    },
    {
      modelo: 'Honda Accord',
      placa: 'STU901',
      tipo: 'Sedan',
      servicios: generarDatosAleatorios(5, 15),
      anio: 2020
    },
    {
      modelo: 'Ford Explorer',
      placa: 'VWX234',
      tipo: 'SUV',
      servicios: generarDatosAleatorios(4, 12),
      anio: 2021
    }
  ].sort((a, b) => b.servicios - a.servicios)

  // Calculamos el promedio diario de órdenes
  const promedioDiario = Math.round((totalOrdenes / dias) * 10) / 10

  // Obtenemos el mecánico con más órdenes
  const mecanicoDestacado = ordenesPorMecanico[0]

  // Obtenemos el trabajo más frecuente
  const trabajoMasFrecuente = trabajosRealizados[0]

  // Calculamos KPIs
  const kpis = {
    totalOrdenes,
    promedioDiario,
    mecanicoDestacado,
    trabajoMasFrecuente,
    garantiasActivas: distribucionGarantias.reduce(
      (sum, item) => (item.tipo !== 'Sin garantía' ? sum + item.cantidad : sum),
      0
    ),
    porcentajeGarantias: generarDatosAleatorios(60, 85)
  }

  return {
    ordenesporTiempo,
    ordenesPorMecanico,
    distribucionVehiculos,
    distribucionAnios,
    clientesFrecuentes,
    distribucionGarantias,
    trabajosRealizados,
    vehiculosConMasServicios,
    kpis
  }
}
