import { IpcMain } from 'electron'
import { ClienteModel } from '../models/ClienteModel'

export function setupClienteController(ipcMain: IpcMain): void {
  ipcMain.handle('cliente:create', async (_, clienteData) => {
    try {
      return await ClienteModel.create(clienteData)
    } catch (error) {
      console.error('Error creando cliente:', error)
      throw new Error(`Error al crear cliente: ${error.message}`)
    }
  })

  ipcMain.handle('cliente:getByCedula', async (_, cedula) => {
    try {
      const cliente = await ClienteModel.findByCedula(cedula)
      if (!cliente) {
        throw new Error(`Cliente no encontrado con cédula: ${cedula}`)
      }
      return cliente
    } catch (error) {
      console.error('Error buscando cliente por cédula:', error)
      throw new Error(
        error.message.includes('no encontrado')
          ? error.message
          : 'Formato de cédula inválido (Ej: V-12345678)'
      )
    }
  })

  ipcMain.handle('cliente:getById', async (_, id) => {
    try {
      const cliente = await ClienteModel.findById(id)
      if (!cliente) {
        throw new Error(`Cliente no encontrado con ID: ${id}`)
      }
      return cliente
    } catch (error) {
      console.error('Error buscando cliente por ID:', error)
      throw new Error('ID de cliente inválido')
    }
  })

  // Nuevo manejador para buscar clientes por nombre
  ipcMain.handle('cliente:findByName', async (_, name) => {
    try {
      const clientes = await ClienteModel.findByName(name)
      if (clientes.length === 0) {
        throw new Error(`No se encontraron clientes con el nombre: ${name}`)
      }
      return clientes
    } catch (error) {
      console.error('Error buscando clientes por nombre:', error)
      throw new Error(`Error al buscar clientes: ${error.message}`)
    }
  })
}
