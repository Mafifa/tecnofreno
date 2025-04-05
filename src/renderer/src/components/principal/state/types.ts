// Estado
export interface State {
  // Modal states
  modals: {
    trabajo: boolean
    nota: boolean
    mecanico: boolean
    cliente: boolean
    vehiculo: boolean
    detalle: boolean
  }
  // Form data
  form: {
    fecha: string
    mecanico: string
    mecanicoId?: number // ID del mecánico seleccionado
    trabajoRealizado: string
    nota: string
    placa: string
    datos: {
      vehiculo?: string
      cliente?: string
      cedula?: string
      vehiculoId?: number // Nuevo: ID del vehículo
      clienteId?: number // Nuevo: ID del cliente
    }
    garantia: {
      tiempo: string
      unidad: string
      id?: number // Nuevo: ID de la garantía registrada
    }
  }
  // Mechanics list
  mecanicos: string[] // Lista de nombres de mecánicos (para compatibilidad)
  filteredMecanicos: Mecanico[] // Lista de mecánicos filtrados de la API
  // Search states
  search: {
    resultados: OrdenTrabajo[]
    buscando: boolean
    error: string | null
    buscandoMecanicos: boolean
    guardandoGarantia: boolean // Estado para indicar registro de garantía
    guardandoOrden: boolean // Estado para indicar registro de orden
    guardandoVehiculo: boolean // Nuevo: Estado para indicar registro de vehículo
    guardandoCliente: boolean // Nuevo: Estado para indicar registro de cliente
    guardandoMecanico: boolean // Nuevo: Estado para indicar registro de mecánico
  }
  ordenSeleccionada: OrdenTrabajo | null
}

// Acciones
export type Action =
  | { type: 'TOGGLE_MODAL'; modalName: keyof State['modals']; value?: boolean }
  | { type: 'UPDATE_FORM'; field: string; value: any }
  | { type: 'UPDATE_GARANTIA'; field: 'tiempo' | 'unidad'; value: string }
  | { type: 'SET_DATOS'; datos: Partial<State['form']['datos']> }
  | { type: 'SET_FILTERED_MECANICOS'; mecanicos: Mecanico[] }
  | { type: 'SELECT_MECANICO'; mecanico: Mecanico }
  | { type: 'SET_SEARCH_RESULTS'; resultados: OrdenTrabajo[] }
  | { type: 'SET_SEARCH_STATUS'; buscando: boolean }
  | { type: 'SET_SEARCH_ERROR'; error: string | null }
  | { type: 'SET_SEARCHING_MECANICOS'; buscando: boolean }
  | { type: 'SET_GUARDANDO_GARANTIA'; guardando: boolean }
  | { type: 'SET_GUARDANDO_ORDEN'; guardando: boolean }
  | { type: 'SET_GUARDANDO_VEHICULO'; guardando: boolean } // Nueva acción
  | { type: 'SET_GUARDANDO_CLIENTE'; guardando: boolean } // Nueva acción
  | { type: 'SET_GUARDANDO_MECANICO'; guardando: boolean } // Nueva acción
  | { type: 'SET_GARANTIA_ID'; id: number }
  | { type: 'SELECT_ORDEN'; orden: OrdenTrabajo | null }
  | { type: 'ADD_MECANICO'; mecanico: Mecanico }
  | { type: 'SAVE_ORDEN' }
  | { type: 'RESET_FORM' }
