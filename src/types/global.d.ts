import { tipo } from './types'
declare global {
  export interface Error {
    message: string
  }

  // Vehículo registrado en el taller
  export interface Vehiculo {
    id: number
    modelo: string
    placa: string
    anio: string
    tipo: tipo
    cliente_id: number
  }

  // Cliente que solicita el servicio
  export interface Cliente {
    id: number
    nombre: string
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
    fecha: string
    vehiculo_id: number
    mecanico_id: number
    cliente_id: number
    trabajo_realizado: string
    notas?: string
    garantia_id?: number | null
  }
}
export {}
