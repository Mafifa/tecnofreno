// Este archivo contiene funciones simuladas para obtener datos
// En una aplicación real, estas funciones harían llamadas a una API o base de datos

// Definición de tipos (simulados)
interface Cliente {
  id: number
  nombre: string
  cedula_rif: string
  telefono: string
}

interface Vehiculo {
  id: number
  modelo: string
  placa: string
  anio: number
  tipo: string
}

interface Mecanico {
  id: number
  nombre: string
}

interface Garantia {
  id: number
  tiempo: number
  unidad: string
}

interface OrdenTrabajo {
  id: number
  fecha: string
  vehiculo_id: number
  mecanico_id: number
  cliente_id: number
  trabajo_realizado: string
  notas?: string
  garantia_id: number | null
}

// Datos de ejemplo
const clientes: Cliente[] = [
  { id: 1, nombre: 'Juan Pérez', cedula_rif: 'V-12345678', telefono: '0414-1234567' },
  { id: 2, nombre: 'María González', cedula_rif: 'V-87654321', telefono: '0424-7654321' },
  { id: 3, nombre: 'Carlos Rodríguez', cedula_rif: 'J-29876543', telefono: '0412-9876543' }
]

const vehiculos: Vehiculo[] = [
  { id: 1, modelo: 'Toyota Corolla', placa: 'ABC123', anio: 2018, tipo: 'Sedan' },
  { id: 2, modelo: 'Ford Explorer', placa: 'XYZ789', anio: 2020, tipo: 'Camioneta' },
  { id: 3, modelo: 'Honda Civic', placa: 'DEF456', anio: 2019, tipo: 'Sedan' },
  { id: 4, modelo: 'Toyota 4Runner', placa: 'GHI789', anio: 2021, tipo: 'Camioneta' }
]

const mecanicos: Mecanico[] = [
  { id: 1, nombre: 'Pedro Martínez' },
  { id: 2, nombre: 'Luis Hernández' },
  { id: 3, nombre: 'Ana Castillo' }
]

const garantias: Garantia[] = [
  { id: 1, tiempo: 30, unidad: 'días' },
  { id: 2, tiempo: 3, unidad: 'meses' },
  { id: 3, tiempo: 2, unidad: 'semanas' }
]

const ordenesTrabajo: OrdenTrabajo[] = [
  {
    id: 1,
    fecha: '2023-05-15T10:30:00',
    vehiculo_id: 1,
    mecanico_id: 1,
    cliente_id: 1,
    trabajo_realizado: 'Cambio de aceite y filtro. Revisión de frenos.',
    notas: 'Cliente reporta ruido en la suspensión delantera.',
    garantia_id: 1
  },
  {
    id: 2,
    fecha: '2023-06-20T14:45:00',
    vehiculo_id: 2,
    mecanico_id: 2,
    cliente_id: 2,
    trabajo_realizado: 'Reparación de sistema de aire acondicionado. Cambio de refrigerante.',
    garantia_id: 2
  },
  {
    id: 3,
    fecha: '2023-07-05T09:15:00',
    vehiculo_id: 3,
    mecanico_id: 3,
    cliente_id: 3,
    trabajo_realizado: 'Alineación y balanceo. Rotación de neumáticos.',
    notas: 'Se recomienda cambio de amortiguadores en próximo servicio.',
    garantia_id: null
  },
  {
    id: 4,
    fecha: '2023-08-10T11:00:00',
    vehiculo_id: 1,
    mecanico_id: 1,
    cliente_id: 1,
    trabajo_realizado: 'Cambio de pastillas de freno delanteras. Revisión de sistema eléctrico.',
    garantia_id: 3
  },
  {
    id: 5,
    fecha: '2023-09-15T13:20:00',
    vehiculo_id: 4,
    mecanico_id: 2,
    cliente_id: 2,
    trabajo_realizado: 'Reparación de transmisión. Cambio de líquido de transmisión.',
    notas: 'Vehículo presentaba dificultad al cambiar de marcha.',
    garantia_id: 2
  },
  {
    id: 6,
    fecha: '2023-10-22T15:30:00',
    vehiculo_id: 2,
    mecanico_id: 3,
    cliente_id: 3,
    trabajo_realizado: 'Diagnóstico y reparación de sistema de inyección. Limpieza de inyectores.',
    garantia_id: 1
  }
]

// Función para simular un retraso en la respuesta (como una llamada a API real)
const simularRetraso = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Buscar órdenes por placa
export const buscarOrdenesPorPlaca = async (placa: string): Promise<OrdenTrabajo[]> => {
  await simularRetraso()

  // Encontrar el vehículo por placa
  const vehiculo = vehiculos.find((v) => v.placa.toLowerCase() === placa.toLowerCase())

  if (!vehiculo) {
    return []
  }

  // Encontrar todas las órdenes para ese vehículo
  return ordenesTrabajo
    .filter((orden) => orden.vehiculo_id === vehiculo.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Ordenar por fecha descendente
}

// Buscar órdenes por mecánico
export const buscarOrdenesPorMecanico = async (mecanicoId: number): Promise<OrdenTrabajo[]> => {
  await simularRetraso()

  // Encontrar todas las órdenes para ese mecánico
  return ordenesTrabajo
    .filter((orden) => orden.mecanico_id === mecanicoId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Ordenar por fecha descendente
}

// Obtener lista de mecánicos
export const buscarMecanicos = async (): Promise<Mecanico[]> => {
  await simularRetraso(300)
  return mecanicos
}

// Obtener detalle completo de una orden
export const obtenerDetalleOrden = async (ordenId: number) => {
  await simularRetraso(800)

  const orden = ordenesTrabajo.find((o) => o.id === ordenId)

  if (!orden) {
    throw new Error('Orden no encontrada')
  }

  const cliente = clientes.find((c) => c.id === orden.cliente_id)
  const vehiculo = vehiculos.find((v) => v.id === orden.vehiculo_id)
  const mecanico = mecanicos.find((m) => m.id === orden.mecanico_id)
  const garantia = orden.garantia_id ? garantias.find((g) => g.id === orden.garantia_id) : undefined

  if (!cliente || !vehiculo || !mecanico) {
    throw new Error('Datos incompletos para la orden')
  }

  return {
    orden,
    cliente,
    vehiculo,
    mecanico,
    garantia
  }
}
