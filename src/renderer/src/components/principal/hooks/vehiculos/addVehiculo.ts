import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

export const useAddVehiculo = () => {
  const [error, setError] = useState<string | null>(null)

  const addVehiculo = useMutation({
    mutationFn: async (vehiculoData: Omit<Vehiculo, 'id'> & { clienteId: number }) => {
      return window.electron.ipcRenderer.invoke('vehiculo:create', vehiculoData)
    },
    onError: (err: Error) => setError(err.message)
  })

  return {
    addVehiculo,
    error,
    isLoading: addVehiculo.isPending
  }
}
