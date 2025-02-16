import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
// FIXME: ARREGLAR ESTE PROBLEMA
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { is } from '@electron-toolkit/utils'

// Verifica si estamos en modo desarrollo
// const isDevelopment = process.env.NODE_ENV === 'development'

export async function getDb() {
  let dbFilePath: string

  if (is.dev) {
    // Ruta de la base de datos en la raíz del proyecto en modo desarrollo
    dbFilePath = path.join(__dirname, '..', '..', 'db', 'inventory.db')
    console.log(dbFilePath)
  } else {
    // Ruta de la base de datos en modo producción (userData de Electron)
    const userDataPath = app.getPath('userData')
    const dbFolderPath = path.join(userDataPath, 'db')
    dbFilePath = path.join(dbFolderPath, 'inventory.db')

    // Crear el directorio 'db' si no existe
    if (!fs.existsSync(dbFolderPath)) {
      fs.mkdirSync(dbFolderPath, { recursive: true })
    }
  }

  // Abrir la base de datos
  const db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database
  })

  // Crear tablas si no existen
  await db.exec(`
  PRAGMA foreign_keys = ON; -- Habilita las claves foráneas en SQLite

  CREATE TABLE Vehiculo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      modelo TEXT NOT NULL,  -- Ejemplo: 4Runner, Corolla, Fusion
      placa TEXT UNIQUE NOT NULL
  );

  CREATE TABLE Cliente (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      cedula_rif TEXT UNIQUE NOT NULL,
      telefono TEXT NOT NULL
  );

  CREATE TABLE Mecanico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
  );

  CREATE TABLE Garantia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tiempo INTEGER NOT NULL,
      unidad TEXT CHECK (unidad IN ('días', 'semanas', 'meses'))  -- Define si es en días, semanas o meses
  );

  CREATE TABLE OrdenTrabajo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Se registra la fecha automáticamente
      vehiculo_id INTEGER NOT NULL,
      mecanico_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      trabajo_realizado TEXT NOT NULL,
      notas TEXT,
      garantia_id INTEGER,
      FOREIGN KEY (vehiculo_id) REFERENCES Vehiculo(id) ON DELETE CASCADE,
      FOREIGN KEY (mecanico_id) REFERENCES Mecanico(id) ON DELETE CASCADE,
      FOREIGN KEY (cliente_id) REFERENCES Cliente(id) ON DELETE CASCADE,
      FOREIGN KEY (garantia_id) REFERENCES Garantia(id) ON DELETE SET NULL
  );
  `)

  return db
}
