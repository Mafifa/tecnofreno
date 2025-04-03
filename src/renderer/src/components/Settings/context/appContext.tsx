import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definición de la interfaz para la configuración
export interface Config {
  tasaCambioInventario: string
  tasaPersonalizadaInventario: number | null
  tasaCambioFacturacion: string
  tasaPersonalizadaFacturacion: number | null
  modalidadBolivarParalelo: boolean
  idioma: "es" | "en"
  modoOscuro: boolean
}

// Valores por defecto para la configuración
const defaultConfig: Config = {
  tasaCambioInventario: "bancoCentral",
  tasaPersonalizadaInventario: null,
  tasaCambioFacturacion: "bancoCentral",
  tasaPersonalizadaFacturacion: null,
  modalidadBolivarParalelo: false,
  idioma: "es",
  modoOscuro: false,
}

// Interfaz para el contexto de la aplicación
interface AppContextType {
  config: Config
  updateConfig: <K extends keyof Config>(key: K, value: Config[K]) => void
  // Aquí puedes añadir más estados globales si los necesitas
}

// Crear el contexto
const AppContext = createContext<AppContextType | undefined>(undefined)

// Props para el proveedor
interface AppProviderProps {
  children: ReactNode
}

// Proveedor del contexto
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Estado para la configuración
  const [config, setConfig] = useState<Config>(() => {
    // Intentar cargar la configuración desde localStorage al iniciar
    try {
      const savedConfig = localStorage.getItem("appConfig")
      return savedConfig ? JSON.parse(savedConfig) : defaultConfig
    } catch (error) {
      console.error("Error al cargar la configuración:", error)
      return defaultConfig
    }
  })

  // Función para actualizar una propiedad específica de la configuración
  const updateConfig = <K extends keyof Config> (key: K, value: Config[K]) => {
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig, [key]: value }

      // Guardar en localStorage
      try {
        localStorage.setItem("appConfig", JSON.stringify(newConfig))
      } catch (error) {
        console.error("Error al guardar la configuración:", error)
      }

      return newConfig
    })
  }

  // Efecto para aplicar el modo oscuro
  useEffect(() => {
    if (config.modoOscuro) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [config.modoOscuro])

  // Valor del contexto
  const contextValue: AppContextType = {
    config,
    updateConfig,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

// Hook personalizado para usar el contexto
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

