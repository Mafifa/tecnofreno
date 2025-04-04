import { getDb } from './db'

export class ClienteModel {
  static async create(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const db = await getDb()
    try {
      const { lastID } = await db.run('INSERT INTO Cliente (nombre, telefono) VALUES (?, ?)', [
        cliente.nombre,
        cliente.telefono
      ])
      return { ...cliente, id: lastID as number }
    } catch (error) {
      throw new Error('Error creating client')
    }
  }

  static async findByName(name: string): Promise<Cliente[]> {
    const db = await getDb()
    try {
      const query = 'SELECT * FROM Cliente WHERE nombre LIKE ? COLLATE NOCASE'
      const results = await db.all<Cliente[]>(query, [`%${name}%`])
      return results
    } catch (error) {
      console.error('Database query error:', error)
      throw new Error(`Error from model searching clients by name: ${error}`)
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
      throw new Error(`Error searching client: ${error}`)
    }
  }

  static async findById(id: number): Promise<Cliente | undefined> {
    console.log('mostrando id desde el modelo:', id)

    const db = await getDb()
    try {
      return await db.get<Cliente>('SELECT * FROM Cliente WHERE id = ?', [id])
    } catch (error) {
      console.error('Database query error:', error)
      throw new Error(`Error searching client: ${error}`)
    }
  }
}
