declare global {
  // Vehículo registrado en el taller
  export interface Vehiculo {
    id: number
    modelo: string // Ejemplo: "4Runner", "Corolla", "Fusion"
    placa: string // Placa única
  }

  // Cliente que solicita el servicio
  export interface Cliente {
    id: number
    nombre: string
    cedula_rif: string // Cédula o RIF único
    telefono: string
  }

  // Mecánico que realiza el trabajo
  export interface Mecanico {
    id: number
    nombre: string
  }

  // Garantía aplicada al trabajo
  export interface Garantia {
    id: number
    tiempo: number // Duración de la garantía
    unidad: 'días' | 'semanas' | 'meses' // Unidad de tiempo
  }

  // Orden de trabajo registrada en el sistema
  export interface OrdenTrabajo {
    id: number
    fecha: string // Fecha en formato ISO (YYYY-MM-DD HH:MM:SS)
    vehiculo_id: number // Relación con la tabla Vehiculo
    mecanico_id: number // Relación con la tabla Mecanico
    cliente_id: number // Relación con la tabla Cliente
    trabajo_realizado: string
    notas?: string // Puede ser opcional
    garantia_id?: number | null // Puede ser NULL si no tiene garantía
  }
}
export {}
