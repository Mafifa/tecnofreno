import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
// FIXME: ARREGLAR ESTE PROBLEMA
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { is } from '@electron-toolkit/utils'

export async function getDb() {
  let dbFilePath: string
  let dbFolderPath: string

  if (is.dev) {
    // Development mode - project root/db directory
    dbFolderPath = path.join(process.cwd(), 'db')
    dbFilePath = path.join(dbFolderPath, 'inventory.db')

    // Create db directory if it doesn't exist
    if (!fs.existsSync(dbFolderPath)) {
      fs.mkdirSync(dbFolderPath, { recursive: true })
    }
  } else {
    // Production mode - userData directory
    const userDataPath = app.getPath('userData')
    dbFolderPath = path.join(userDataPath, 'db')
    dbFilePath = path.join(dbFolderPath, 'inventory.db')

    // Create db directory if it doesn't exist
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
    PRAGMA foreign_keys = ON;

-- Crear tabla Cliente sin la columna cedula_rif
CREATE TABLE IF NOT EXISTS Cliente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL
);

-- Tabla Mecanico permanece igual
CREATE TABLE IF NOT EXISTS Mecanico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- Tabla Garantia permanece igual
CREATE TABLE IF NOT EXISTS Garantia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tiempo INTEGER NOT NULL,
    unidad TEXT CHECK (unidad IN ('días', 'semanas', 'meses'))  -- Define si es en días, semanas o meses
);

-- Tabla Vehiculo con cliente_id como referencia al id de Cliente
CREATE TABLE IF NOT EXISTS Vehiculo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modelo TEXT NOT NULL,
    placa TEXT UNIQUE NOT NULL,
    anio INTEGER NOT NULL, 
    tipo TEXT NOT NULL,
    cliente_id INTEGER NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id) ON DELETE CASCADE
);

-- Tabla OrdenTrabajo con cliente_id como referencia al id de Cliente
CREATE TABLE IF NOT EXISTS OrdenTrabajo (
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
