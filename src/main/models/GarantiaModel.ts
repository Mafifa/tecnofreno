import { getDb } from './db'

export class GarantiaModel {
  static async findById(id: number): Promise<Garantia | undefined> {
    const db = await getDb()
    return db.get<Garantia>('SELECT * FROM Garantia WHERE id = ?', [id])
  }
}
