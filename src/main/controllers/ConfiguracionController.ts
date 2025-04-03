import type { IpcMain } from 'electron'
import { ConfiguracionModel } from '../models/ConfiguracionModel'

export function setupConfiguracionController(ipcMain: IpcMain): void {
  // ===== MECÁNICOS =====
  ipcMain.handle('configuracion:obtenerMecanicos', async (_, busqueda = '') => {
    try {
      const mecanicos = await ConfiguracionModel.obtenerMecanicos(busqueda)
      return mecanicos
    } catch (error) {
      console.error('Error al obtener mecánicos:', error)
      throw new Error('Error al obtener mecánicos')
    }
  })

  ipcMain.handle('configuracion:eliminarMecanico', async (_, id: number) => {
    try {
      const resultado = await ConfiguracionModel.eliminarMecanico(id)
      return resultado
    } catch (error) {
      console.error('Error al eliminar mecánico:', error)
      throw new Error(
        'Error al eliminar mecánico. Es posible que haya un problema con la base de datos.'
      )
    }
  })

  // ===== CLIENTES =====
  ipcMain.handle('configuracion:obtenerClientes', async (_, busqueda = '') => {
    try {
      const clientes = await ConfiguracionModel.obtenerClientes(busqueda)
      return clientes
    } catch (error) {
      console.error('Error al obtener clientes:', error)
      throw new Error('Error al obtener clientes')
    }
  })

  ipcMain.handle('configuracion:eliminarCliente', async (_, id: number) => {
    try {
      const resultado = await ConfiguracionModel.eliminarCliente(id)
      return resultado
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      throw new Error(
        'Error al eliminar cliente. Es posible que haya un problema con la base de datos.'
      )
    }
  })

  // ===== VEHÍCULOS =====
  ipcMain.handle('configuracion:obtenerVehiculos', async (_, busqueda = '') => {
    try {
      const vehiculos = await ConfiguracionModel.obtenerVehiculos(busqueda)
      return vehiculos
    } catch (error) {
      console.error('Error al obtener vehículos:', error)
      throw new Error('Error al obtener vehículos')
    }
  })

  ipcMain.handle('configuracion:eliminarVehiculo', async (_, id: number) => {
    try {
      const resultado = await ConfiguracionModel.eliminarVehiculo(id)
      return resultado
    } catch (error) {
      console.error('Error al eliminar vehículo:', error)
      throw new Error(
        'Error al eliminar vehículo. Es posible que haya un problema con la base de datos.'
      )
    }
  })

  // ===== ÓRDENES =====
  ipcMain.handle('configuracion:obtenerOrdenes', async (_, busqueda = '') => {
    try {
      const ordenes = await ConfiguracionModel.obtenerOrdenes(busqueda)
      return ordenes
    } catch (error) {
      console.error('Error al obtener órdenes:', error)
      throw new Error('Error al obtener órdenes')
    }
  })

  ipcMain.handle('configuracion:eliminarOrden', async (_, id: number) => {
    try {
      const resultado = await ConfiguracionModel.eliminarOrden(id)
      return resultado
    } catch (error) {
      console.error('Error al eliminar orden:', error)
      throw new Error('Error al eliminar orden')
    }
  })

  // ===== GARANTÍAS =====
  ipcMain.handle('configuracion:obtenerGarantias', async () => {
    try {
      const garantias = await ConfiguracionModel.obtenerGarantias()
      return garantias
    } catch (error) {
      console.error('Error al obtener garantías:', error)
      throw new Error('Error al obtener garantías')
    }
  })

  ipcMain.handle('configuracion:eliminarGarantia', async (_, id: number) => {
    try {
      const resultado = await ConfiguracionModel.eliminarGarantia(id)
      return resultado
    } catch (error) {
      console.error('Error al eliminar garantía:', error)
      throw new Error('Error al eliminar garantía')
    }
  })
}
