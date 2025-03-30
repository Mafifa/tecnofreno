import { IpcMain } from 'electron'
import { MecanicoModel } from '../models/MecanicoModel'

export function setupMecanicosController(ipcMain: IpcMain): void {
  // Obtener todos los mecánicos
  ipcMain.handle('mecanico:getAll', async () => {
    try {
      return await MecanicoModel.getAll()
    } catch (error) {
      console.error('Error al obtener mecánicos:', error)
      throw new Error('Error al obtener mecánicos')
    }
  })

  // Obtener un mecánico por ID
  ipcMain.handle('mecanico:getById', async (_, id: number) => {
    try {
      const mecanico = await MecanicoModel.getById(id)
      if (!mecanico) {
        throw new Error('Mecánico no encontrado')
      }
      return mecanico
    } catch (error) {
      console.error('Error al obtener mecánico por ID:', error)
      throw new Error('Error al obtener mecánico por ID')
    }
  })

  // Crear un nuevo mecánico
  ipcMain.handle('mecanico:create', async (_, nombre: string) => {
    try {
      return await MecanicoModel.create(nombre)
    } catch (error) {
      console.error('Error al crear mecánico:', error)
      throw new Error('Error al crear mecánico')
    }
  })

  // Actualizar un mecánico existente
  ipcMain.handle('mecanico:update', async (_, { id, nombre }: { id: number; nombre: string }) => {
    try {
      await MecanicoModel.update(id, nombre)
      return { success: true }
    } catch (error) {
      console.error('Error al actualizar mecánico:', error)
      throw new Error('Error al actualizar mecánico')
    }
  })

  // Eliminar un mecánico por ID
  ipcMain.handle('mecanico:delete', async (_, id: number) => {
    try {
      await MecanicoModel.delete(id)
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar mecánico:', error)
      throw new Error('Error al eliminar mecánico')
    }
  })

  // Buscar mecánicos por nombre
  ipcMain.handle('mecanico:searchByName', async (_, nombre: string) => {
    try {
      return await MecanicoModel.searchByName(nombre)
    } catch (error) {
      console.error('Error al buscar mecánicos por nombre:', error)
      throw new Error('Error al buscar mecánicos por nombre')
    }
  })
}
