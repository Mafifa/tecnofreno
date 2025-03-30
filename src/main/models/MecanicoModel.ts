import { getDb } from './db'

export class MecanicoModel {
  // Obtener todos los mecánicos
  static async getAll(): Promise<Mecanico[]> {
    const db = await getDb()
    return db.all(`
      SELECT * FROM Mecanico
    `)
  }

  // Obtener un mecánico por ID
  static async getById(id: number): Promise<Mecanico | undefined> {
    const db = await getDb()
    return db.get(
      `
      SELECT * FROM Mecanico WHERE id = ?
    `,
      [id]
    )
  }

  // Crear un nuevo mecánico
  static async create(nombre: string): Promise<{ id: number }> {
    const db = await getDb()
    const result = await db.run(
      `
      INSERT INTO Mecanico (nombre) VALUES (?)
    `,
      [nombre]
    )
    return { id: result.lastID as number }
  }

  // Actualizar un mecánico existente
  static async update(id: number, nombre: string): Promise<void> {
    const db = await getDb()
    await db.run(
      `
      UPDATE Mecanico SET nombre = ? WHERE id = ?
    `,
      [nombre, id]
    )
  }

  // Eliminar un mecánico por ID
  static async delete(id: number): Promise<void> {
    const db = await getDb()
    await db.run(
      `
      DELETE FROM Mecanico WHERE id = ?
    `,
      [id]
    )
  }

  // Buscar mecánicos por nombre
  static async searchByName(nombre: string): Promise<Mecanico[]> {
    const db = await getDb()
    return db.all(
      `
    SELECT * FROM Mecanico
    WHERE nombre LIKE ?
    `,
      [`%${nombre}%`]
    )
  }
}
