import { IpcMain } from 'electron'
import { GarantiaModel } from '../models/GarantiaModel'

export function setupGarantiaController(ipcMain: IpcMain): void {
  ipcMain.handle('garantia:getById', async (_, id: number) => {
    try {
      const garantia = await GarantiaModel.findById(id)
      if (!garantia) {
        throw new Error(`Garantia no encontrado con ID: ${id}`)
      }
      return garantia
    } catch (error) {
      console.error('Error buscando garantia por ID:', error)
      throw new Error('ID de vehículo inválido')
    }
  })
}
