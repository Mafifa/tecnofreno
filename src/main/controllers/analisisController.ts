import type { IpcMain } from 'electron'
import { AnalisisModel } from '../models/AnalisisModel'

export function setupAnalisisController(ipcMain: IpcMain): void {
  ipcMain.handle('analisis:obtenerDatos', async (_, periodo: 'semana' | 'mes' | 'año') => {
    try {
      const datos = await AnalisisModel.obtenerDatosAnalisis(periodo)
      return datos
    } catch (error) {
      console.error('Error al obtener datos de análisis:', error)
      throw new Error('Error al obtener datos de análisis')
    }
  })
}
