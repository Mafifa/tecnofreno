import { getDb } from './db'

export interface Cliente {
  id?: number
  nombre: string
  cedula_rif: string
  telefono: string
}

export class ClienteModel {
  static async create(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const db = await getDb()
    try {
      const { lastID } = await db.run(
        'INSERT INTO Cliente (nombre, cedula_rif, telefono) VALUES (?, ?, ?)',
        [cliente.nombre, cliente.cedula_rif, cliente.telefono]
      )
      return { ...cliente, id: lastID }
    } catch (error) {
      throw new Error('Error creating client')
    }
  }

  static async findByCedula(cedula: string): Promise<Cliente | undefined> {
    console.log('mostrando cedula desd el modelo:', cedula)

    const db = await getDb()
    try {
      return await db.get<Cliente>('SELECT * FROM Cliente WHERE cedula_rif = ? COLLATE NOCASE', [
        cedula
      ])
    } catch (error) {
      console.error('Database query error:', error)
      throw new Error(`Error searching client: ${error.message}`)
    }
  }

  static async findById(id: number): Promise<Cliente | undefined> {
    console.log('mostrando id desde el modelo:', id)

    const db = await getDb()
    try {
      return await db.get<Cliente>('SELECT * FROM Cliente WHERE id = ?', [id])
    } catch (error) {
      console.error('Database query error:', error)
      throw new Error(`Error searching client: ${error.message}`)
    }
  }
}
