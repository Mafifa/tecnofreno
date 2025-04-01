import { getDb } from './db'

export class VehiculoModel {
  static async create(vehiculo: Omit<Vehiculo, 'id'>): Promise<Vehiculo> {
    const db = await getDb()
    try {
      const { lastID } = await db.run(
        'INSERT INTO Vehiculo (modelo, placa, anio, tipo, cliente_id) VALUES (?, ?, ?, ?, ?)',
        [vehiculo.modelo, vehiculo.placa, vehiculo.anio, vehiculo.tipo, vehiculo.cliente_id]
      )
      return { ...vehiculo, id: lastID as number }
    } catch (error) {
      console.log('error desde el modelo', error.message)
      throw new Error('Error creating vehicle')
    }
  }

  static async findByPlaca(placa: string): Promise<Vehiculo | undefined> {
    const db = await getDb()
    return db.get<Vehiculo>('SELECT * FROM Vehiculo WHERE placa = ?', [placa])
  }

  static async findById(id: number): Promise<Vehiculo | undefined> {
    const db = await getDb()
    return db.get<Vehiculo>('SELECT * FROM Vehiculo WHERE id = ?', [id])
  }
}
