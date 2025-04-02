import { useState } from 'react'

export function useSearchVehiculo() {
  // Estado para controlar si está buscando
  const [isSearching, setIsSearching] = useState(false)

  // Función simple para buscar por placa
  const searchByPlaca = async (placa: string) => {
    try {
      setIsSearching(true)
      const result = await window.electron.ipcRenderer.invoke('vehiculo:getByPlaca', placa)
      return result
    } catch (error) {
      console.error('Error al buscar vehículo:', error)
      throw error
    } finally {
      setIsSearching(false)
    }
  }

  return {
    searchByPlaca,
    isSearching
  }
}
