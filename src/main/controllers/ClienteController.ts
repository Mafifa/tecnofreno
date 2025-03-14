import { ClienteModel, type Cliente } from '../models/ClienteModel'

export class ClienteController {
  static async createCliente(clienteData: Omit<Cliente, 'id'>): Promise<Cliente> {
    try {
      return await ClienteModel.create(clienteData)
    } catch (error) {
      console.error('Database Error:', error)
      throw new Error(`Error creating client: ${error.message}`)
    }
  }

  static async getByCedula(cedula: string): Promise<Cliente | undefined> {
    console.log('cedula desde el controlador:', cedula)

    try {
      const cliente = await ClienteModel.findByCedula(cedula)
      if (!cliente) {
        throw new Error(`Cliente no encontrado con cédula/RIF: ${cedula}`)
      }
      return cliente
    } catch (error) {
      console.error('Database Error:', error)
      throw new Error(
        error.message.includes('no encontrado')
          ? error.message
          : 'Error buscando cliente. Verifique el formato de la cédula (Ej: V-12345678)'
      )
    }
  }

  static async getById(id: number): Promise<Cliente | undefined> {
    console.log('id desde el controlador:', id)

    try {
      const cliente = await ClienteModel.findById(id)
      if (!cliente) {
        throw new Error(`Cliente no encontrado con el id: ${id}`)
      }
      return cliente
    } catch (error) {
      console.error('Database Error:', error)
      throw new Error(
        error.message.includes('no encontrado')
          ? error.message
          : 'Error buscando cliente. Verifique el formato del id'
      )
    }
  }
}
