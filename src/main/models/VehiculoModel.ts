import { getDb } from './db'

export class VehiculoModel {
  static async create(vehiculo: Omit<Vehiculo, 'id'>): Promise<Vehiculo | null> {
    const db = await getDb()
    try {
      // Verificar si ya existe un vehículo con la misma placa
      const existingVehicle = await this.findByPlaca(vehiculo.placa)

      if (existingVehicle) {
        // Si ya existe un vehículo con esa placa, retornar null
        return null
      }

      // Si no existe, proceder con la creación
      const { lastID } = await db.run(
        'INSERT INTO Vehiculo (modelo, placa, anio, tipo, cliente_id) VALUES (?, ?, ?, ?, ?)',
        [vehiculo.modelo, vehiculo.placa, vehiculo.anio, vehiculo.tipo, vehiculo.cliente_id]
      )
      return { ...vehiculo, id: lastID as number }
    } catch (error) {
      console.log('error desde el modelo', error)
      throw new Error(`Error creating vehicle: ${error}`)
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
