// Datos de ejemplo para el historial de recibos

interface OrdenTrabajo {
  id: number
  fecha: string
  vehiculo_id: number
  mecanico_id: number
  cliente_id: number
  trabajo_realizado: string
  notas?: string
  garantia_id: number | null
  cliente_nombre: string
  vehiculo_placa: string
  vehiculo_modelo: string
  mecanico_nombre: string
}

const recibosEjemplo: OrdenTrabajo[] = [
  {
    id: 1001,
    fecha: '2023-12-15T10:30:00',
    vehiculo_id: 1,
    mecanico_id: 1,
    cliente_id: 1,
    trabajo_realizado: 'Cambio de aceite y filtro',
    notas: 'Cliente solicitó revisión de frenos para próxima visita',
    garantia_id: 1,
    // Propiedades adicionales para mostrar en la tabla
    cliente_nombre: 'Juan Pérez',
    vehiculo_placa: 'ABC123',
    vehiculo_modelo: 'Toyota Corolla',
    mecanico_nombre: 'Carlos Rodríguez'
  },
  {
    id: 1002,
    fecha: '2023-12-10T14:45:00',
    vehiculo_id: 2,
    mecanico_id: 2,
    cliente_id: 2,
    trabajo_realizado: 'Alineación y balanceo',
    garantia_id: 2,
    cliente_nombre: 'María González',
    vehiculo_placa: 'XYZ789',
    vehiculo_modelo: 'Honda Civic',
    mecanico_nombre: 'Luis Martínez'
  },
  {
    id: 1003,
    fecha: '2023-12-05T09:15:00',
    vehiculo_id: 3,
    mecanico_id: 1,
    cliente_id: 3,
    trabajo_realizado: 'Cambio de frenos delanteros',
    notas: 'Se recomienda cambiar los traseros en 3 meses',
    garantia_id: 3,
    cliente_nombre: 'Pedro Ramírez',
    vehiculo_placa: 'DEF456',
    vehiculo_modelo: 'Nissan Sentra',
    mecanico_nombre: 'Carlos Rodríguez'
  },
  {
    id: 1004,
    fecha: '2023-11-28T16:20:00',
    vehiculo_id: 4,
    mecanico_id: 3,
    cliente_id: 4,
    trabajo_realizado: 'Reparación de alternador',
    garantia_id: 1,
    cliente_nombre: 'Ana López',
    vehiculo_placa: 'GHI789',
    vehiculo_modelo: 'Ford Focus',
    mecanico_nombre: 'Miguel Sánchez'
  },
  {
    id: 1005,
    fecha: '2023-11-20T11:00:00',
    vehiculo_id: 5,
    mecanico_id: 2,
    cliente_id: 5,
    trabajo_realizado: 'Cambio de correa de distribución',
    garantia_id: 3,
    cliente_nombre: 'Roberto Díaz',
    vehiculo_placa: 'JKL012',
    vehiculo_modelo: 'Chevrolet Aveo',
    mecanico_nombre: 'Luis Martínez'
  },
  {
    id: 1006,
    fecha: '2023-11-15T13:30:00',
    vehiculo_id: 6,
    mecanico_id: 1,
    cliente_id: 6,
    trabajo_realizado: 'Diagnóstico y reparación de sistema eléctrico',
    notas: 'Se reemplazó fusible principal y se revisó cableado',
    garantia_id: 2,
    cliente_nombre: 'Carmen Vargas',
    vehiculo_placa: 'MNO345',
    vehiculo_modelo: 'Kia Rio',
    mecanico_nombre: 'Carlos Rodríguez'
  },
  {
    id: 1007,
    fecha: '2023-11-10T08:45:00',
    vehiculo_id: 7,
    mecanico_id: 3,
    cliente_id: 7,
    trabajo_realizado: 'Cambio de amortiguadores traseros',
    garantia_id: 1,
    cliente_nombre: 'Javier Morales',
    vehiculo_placa: 'PQR678',
    vehiculo_modelo: 'Hyundai Accent',
    mecanico_nombre: 'Miguel Sánchez'
  },
  {
    id: 1008,
    fecha: '2023-11-05T15:15:00',
    vehiculo_id: 8,
    mecanico_id: 2,
    cliente_id: 8,
    trabajo_realizado: 'Reparación de aire acondicionado',
    notas: 'Se recargó gas y se cambió compresor',
    garantia_id: null,
    cliente_nombre: 'Sofía Castro',
    vehiculo_placa: 'STU901',
    vehiculo_modelo: 'Mazda 3',
    mecanico_nombre: 'Luis Martínez'
  },
  {
    id: 1009,
    fecha: '2023-10-30T10:00:00',
    vehiculo_id: 9,
    mecanico_id: 1,
    cliente_id: 9,
    trabajo_realizado: 'Cambio de batería',
    garantia_id: 2,
    cliente_nombre: 'Eduardo Mendoza',
    vehiculo_placa: 'VWX234',
    vehiculo_modelo: 'Volkswagen Golf',
    mecanico_nombre: 'Carlos Rodríguez'
  },
  {
    id: 1010,
    fecha: '2023-10-25T14:00:00',
    vehiculo_id: 10,
    mecanico_id: 3,
    cliente_id: 10,
    trabajo_realizado: 'Revisión general y cambio de filtros',
    notas: 'Próximo servicio en 5,000 km',
    garantia_id: null,
    cliente_nombre: 'Laura Herrera',
    vehiculo_placa: 'YZA567',
    vehiculo_modelo: 'Renault Sandero',
    mecanico_nombre: 'Miguel Sánchez'
  },
  {
    id: 1011,
    fecha: '2023-10-20T09:30:00',
    vehiculo_id: 11,
    mecanico_id: 2,
    cliente_id: 11,
    trabajo_realizado: 'Cambio de bujías y cables',
    garantia_id: 1,
    cliente_nombre: 'Daniel Torres',
    vehiculo_placa: 'BCD890',
    vehiculo_modelo: 'Fiat Palio',
    mecanico_nombre: 'Luis Martínez'
  },
  {
    id: 1012,
    fecha: '2023-10-15T16:45:00',
    vehiculo_id: 12,
    mecanico_id: 1,
    cliente_id: 12,
    trabajo_realizado: 'Reparación de caja de cambios',
    notas: 'Se reemplazaron sincronizadores y aceite de transmisión',
    garantia_id: 3,
    cliente_nombre: 'Gabriela Rojas',
    vehiculo_placa: 'EFG123',
    vehiculo_modelo: 'Peugeot 208',
    mecanico_nombre: 'Carlos Rodríguez'
  }
]

interface FiltrosHistorial {
  pagina: number
  id?: string
  fechaInicio?: string
  fechaFin?: string
}

/**
 * Función que simula la obtención de datos del historial de recibos
 * con filtros y paginación
 */
export const obtenerHistorialRecibos = async (filtros: FiltrosHistorial) => {
  // Simulamos un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Aplicamos filtros
  let recibosFiltrados = [...recibosEjemplo]

  // Filtro por ID
  if (filtros.id) {
    recibosFiltrados = recibosFiltrados.filter((recibo) =>
      recibo.id.toString().includes(filtros.id!)
    )
  }

  // Filtro por fecha de inicio
  if (filtros.fechaInicio) {
    const fechaInicio = new Date(filtros.fechaInicio)
    recibosFiltrados = recibosFiltrados.filter((recibo) => new Date(recibo.fecha) >= fechaInicio)
  }

  // Filtro por fecha de fin
  if (filtros.fechaFin) {
    const fechaFin = new Date(filtros.fechaFin)
    // Ajustamos la fecha fin para incluir todo el día
    fechaFin.setHours(23, 59, 59, 999)
    recibosFiltrados = recibosFiltrados.filter((recibo) => new Date(recibo.fecha) <= fechaFin)
  }

  // Ordenamos por fecha (más reciente primero)
  recibosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  // Calculamos la paginación
  const elementosPorPagina = 5
  const totalPaginas = Math.ceil(recibosFiltrados.length / elementosPorPagina)
  const inicio = (filtros.pagina - 1) * elementosPorPagina
  const fin = inicio + elementosPorPagina
  const recibosPaginados = recibosFiltrados.slice(inicio, fin)

  return {
    recibos: recibosPaginados,
    totalPaginas,
    totalRecibos: recibosFiltrados.length
  }
}
