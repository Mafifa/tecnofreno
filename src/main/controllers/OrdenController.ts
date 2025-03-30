import { IpcMain } from 'electron'
import { OrdenTrabajoModel } from '../models/OrdenTrabajoModel'

export function setupOrdenController(ipcMain: IpcMain): void {
  ipcMain.handle('orden:getDetalle', async (_, id: number) => {
    try {
      const orden = await OrdenTrabajoModel.getById(id)
      if (!orden) {
        throw new Error('Orden no encontrada')
      }
      return orden
    } catch (error) {
      console.error('Error al obtener detalle de orden:', error)
      throw new Error('Error al obtener detalle de orden')
    }
  })

  ipcMain.handle('orden:create', async (_, ordenData) => {
    try {
      return await OrdenTrabajoModel.create(ordenData)
    } catch (error) {
      console.error('Error al crear orden:', error)
      throw new Error('Error al crear orden')
    }
  })
}
