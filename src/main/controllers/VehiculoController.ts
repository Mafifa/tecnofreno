import { IpcMain } from 'electron'
import { VehiculoModel } from '../models/VehiculoModel'

export function setupVehiculoController(ipcMain: IpcMain): void {
  ipcMain.handle('vehiculo:create', async (_, vehiculoData: Omit<Vehiculo, 'id'>) => {
    try {
      const result = await VehiculoModel.create(vehiculoData)

      // Si el resultado es null, significa que ya existe un vehículo con esa placa
      if (result === null) {
        return {
          success: false,
          error: 'DUPLICATE_PLATE',
          message: `Ya existe un vehículo con la placa ${vehiculoData.placa}`
        }
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Error creando vehículo:', error)
      return {
        success: false,
        error: 'CREATION_ERROR',
        message: `Error al crear vehículo: ${error.message}`
      }
    }
  })

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
