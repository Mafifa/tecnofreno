import { ipcMain } from 'electron'
import { ClienteController } from './ClienteController'
import { VehiculoController } from './VehiculoController'
import { OrdenController } from './OrdenController'

let controllersSetup = false

export function setupAllControllers(): void {
  if (controllersSetup) {
    console.log('Controllers already initialized')
    return
  }

  // Clientes
  ipcMain.handle('cliente:create', async (_, clienteData) => {
    return ClienteController.createCliente(clienteData)
  })
  ipcMain.handle('cliente:getByCedula', async (_, cedula) => {
    return ClienteController.getByCedula(cedula)
  })
  ipcMain.handle('cliente:getById', async (_, cedula) => {
    return ClienteController.getById(cedula)
  })
  // Vehículos
  ipcMain.handle('vehiculo:create', async (_, vehiculoData) => {
    return VehiculoController.createVehiculo(vehiculoData)
  })
  ipcMain.handle('vehiculo:getByPlaca', async (_, placa) => {
    return VehiculoController.getByPlaca(placa)
  })

  // Órdenes de trabajo
  ipcMain.handle('orden:detalle', async (_, ordenId) => {
    return OrdenController.getOrdenDetalle(ordenId)
  })

  controllersSetup = true
  console.log('All controllers initialized successfully')
}
