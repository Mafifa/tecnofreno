import { useAppContext } from './context/appContext'

// Hook personalizado para acceder a la configuración
export const useConfig = () => {
  const { config, updateConfig } = useAppContext()
  return { config, updateConfig }
}
