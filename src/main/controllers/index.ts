import { ipcMain } from 'electron'
// Importa las funciones de setup de cada controlador
import { setupClienteController } from './ClienteController'
import { setupVehiculoController } from './VehiculoController'
import { setupOrdenController } from './OrdenController'
import { setupMecanicosController } from './MecanicosController'
import { setupGarantiaController } from './GarantiaController'
import { setupAnalisisController } from './analisisController'
import { setupConfiguracionController } from './ConfiguracionController'

let controllersSetup = false

export function setupAllControllers(): void {
  if (controllersSetup) {
    console.log('Controllers already initialized')
    return
  }

  // Ejecuta los setups de cada controlador
  setupClienteController(ipcMain)
  setupVehiculoController(ipcMain)
  setupOrdenController(ipcMain)
  setupMecanicosController(ipcMain)
  setupGarantiaController(ipcMain)
  setupAnalisisController(ipcMain)
  setupConfiguracionController(ipcMain)

  controllersSetup = true
  console.log('All controllers initialized successfully')
}
