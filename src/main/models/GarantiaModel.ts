import { getDb } from './db'

export class GarantiaModel {
  static async findById(id: number): Promise<Garantia | undefined> {
    const db = await getDb()
    return db.get<Garantia>('SELECT * FROM Garantia WHERE id = ?', [id])
  }
  static async create(garantia: Omit<Garantia, 'id'>): Promise<{ id: number }> {
    const db = await getDb()
    const { tiempo, unidad } = garantia // Extraer las propiedades necesarias de 'garantia'

    const result = await db.run(
      `
    INSERT INTO Garantia (tiempo, unidad) VALUES (?, ?)
    `,
      [tiempo, unidad] // Pasar los valores correspondientes
    )

    return { id: result.lastID as number } // Retornar el ID generado
  }
}
