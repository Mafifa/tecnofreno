import { useQuery } from '@tanstack/react-query'

export function useSearchClient(cedula?: string, clienteId?: string) {
  const searchByCedula = useQuery({
    queryKey: ['cedula', cedula],
    queryFn: async ({ queryKey }: { queryKey: [string, string | undefined] }) => {
      const cedula = queryKey[1]
      return window.electron.ipcRenderer.invoke('cliente:getByCedula', cedula)
    }
  })

  const searchById = useQuery({
    queryKey: ['id', clienteId],
    queryFn: async ({ queryKey }: { queryKey: [string, string | undefined] }) => {
      const cedula = queryKey[1]
      return window.electron.ipcRenderer.invoke('cliente:getByCedula', cedula)
    }
  })

  return { searchByCedula, searchById }
}
