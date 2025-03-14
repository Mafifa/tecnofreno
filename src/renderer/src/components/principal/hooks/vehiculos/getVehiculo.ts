import { useQuery } from '@tanstack/react-query'

export function useSearchVehiculo(placa: string) {
  const searchByPlaca = useQuery({
    queryKey: ['vehiculos', placa],
    queryFn: async ({ queryKey }: { queryKey: [string, string] }) => {
      const placa = queryKey[1]
      return window.electron.ipcRenderer.invoke('vehiculo:getByPlaca', placa)
    }
  })

  return { searchByPlaca }
}
