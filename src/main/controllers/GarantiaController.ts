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
      throw new Error('ID de garantía inválido')
    }
  })

  ipcMain.handle('garantia:create', async (_, garantiaData: Omit<Garantia, 'id'>) => {
    try {
      return await GarantiaModel.create(garantiaData)
    } catch (error) {
      console.error('Error creando garantía:', error)
      throw new Error(`Error al crear garantía: ${error}`)
    }
  })
}
