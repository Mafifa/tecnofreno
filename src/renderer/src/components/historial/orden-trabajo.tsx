export interface OrdenTrabajo {
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
