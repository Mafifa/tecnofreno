import { useQuery } from '@tanstack/react-query';

export const useOrdenDetalle = (ordenId?: number) => {
  return useQuery({
    queryKey: ['orden-detalle', ordenId],
    queryFn: async () => {
      if (!ordenId) return null;
      return window.electron.ipcRenderer.invoke('orden:detalle', ordenId);
    },
    enabled: !!ordenId
  });
};