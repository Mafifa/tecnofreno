import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

export const useCliente = () => {
  const [error, setError] = useState<string | null>(null)

  const addCliente = useMutation({
    mutationFn: async (clienteData: Omit<Cliente, 'id'>) => {
      try {
        return await window.electron.ipcRenderer.invoke('cliente:create', clienteData)
      } catch (error) {
        const err = error as Error
        console.log(err.message)
      }
    },
    onError: (err: Error) => setError(err.message)
  })

  return {
    addCliente,
    error,
    isLoading: addCliente.isPending
  }
}
