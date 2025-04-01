import { IpcMain } from 'electron'
import { OrdenTrabajoModel } from '../models/OrdenTrabajoModel'

export function setupOrdenController(ipcMain: IpcMain): void {
  ipcMain.handle('orden:getById', async (_, id: number) => {
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

  ipcMain.handle('orden:create', async (_, ordenData: Omit<OrdenTrabajo, 'id'>) => {
    try {
      return await OrdenTrabajoModel.create(ordenData)
    } catch (error) {
      console.error('Error al crear orden:', error)
      throw new Error('Error al crear orden')
    }
  })

  ipcMain.handle('orden:getByPlaca', async (_, placa: string) => {
    try {
      const ordenes = await OrdenTrabajoModel.getByPlaca(placa)
      return ordenes
    } catch (error) {
      console.error('Error al obtener órdenes por placa desde el controller:', error)
      throw new Error('Error al obtener órdenes por placa')
    }
  })
}
