import { IpcMain } from 'electron'
import { VehiculoModel } from '../models/VehiculoModel'
import { Vehiculo } from '../models/VehiculoModel'

export function setupVehiculoController(ipcMain: IpcMain): void {
  ipcMain.handle(
    'vehiculo:create',
    async (_, vehiculoData: Omit<Vehiculo, 'id'> & { clienteId: number }) => {
      try {
        return await VehiculoModel.create(vehiculoData)
      } catch (error) {
        console.error('Error creando vehículo:', error)
        throw new Error(`Error al crear vehículo: ${error.message}`)
      }
    }
  )

  ipcMain.handle('vehiculo:getByPlaca', async (_, placa: string) => {
    try {
      const vehiculo = await VehiculoModel.findByPlaca(placa)
      if (!vehiculo) {
        throw new Error(`Vehículo no encontrado con placa: ${placa}`)
      }
      return vehiculo
    } catch (error) {
      console.error('Error buscando vehículo por placa:', error)
      throw new Error(`Error al buscar vehículo: ${error.message}`)
    }
  })

  ipcMain.handle('vehiculo:getById', async (_, id: number) => {
    try {
      const vehiculo = await VehiculoModel.findById(id)
      if (!vehiculo) {
        throw new Error(`Vehículo no encontrado con ID: ${id}`)
      }
      return vehiculo
    } catch (error) {
      console.error('Error buscando vehículo por ID:', error)
      throw new Error('ID de vehículo inválido')
    }
  })
}
