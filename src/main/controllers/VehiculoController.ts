import { VehiculoModel, type Vehiculo } from '../models/VehiculoModel'

export class VehiculoController {
  static async createVehiculo(
    vehiculoData: Omit<Vehiculo, 'id'> & { clienteId: number }
  ): Promise<Vehiculo> {
    try {
      return await VehiculoModel.create(vehiculoData)
    } catch (error) {
      console.log('error desde el controlador', error.message)
      throw new Error('Failed to create vehicle')
    }
  }

  static async getByPlaca(placa: string): Promise<Vehiculo | undefined> {
    try {
      return await VehiculoModel.findByPlaca(placa)
    } catch (error) {
      throw new Error('Error fetching vehicle by plate')
    }
  }
}
