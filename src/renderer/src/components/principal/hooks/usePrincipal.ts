import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useVehiculo = () => {
  const [error, setError] = useState<string | null>(null);

  const addVehiculo = useMutation({
    mutationFn: async (vehiculoData: any) => {
      return window.electron.ipcRenderer.invoke('vehiculo:create', vehiculoData);
    },
    onError: (err: Error) => setError(err.message)
  });

  const searchByPlaca = useQuery({
    queryKey: ['vehiculos'],
    queryFn: async ({ placa }: { placa: string }) => {
      return window.electron.ipcRenderer.invoke('vehiculo:getByPlaca', placa);
    },
    enabled: false,
    onError: (err: Error) => setError(err.message)
  });

  return {
    addVehiculo,
    searchByPlaca,
    error,
    isLoading: addVehiculo.isPending || searchByPlaca.isFetching
  };
};