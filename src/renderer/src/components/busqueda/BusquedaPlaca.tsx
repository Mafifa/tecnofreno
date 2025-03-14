"use client"

import { useState } from "react"
import { Search, Calendar, Car } from "lucide-react"
import { buscarOrdenesPorPlaca } from "./servicios-mock"

interface OrdenTrabajo {
  id: string
  fecha: string
  trabajo_realizado: string
  // ... other properties
}

interface BusquedaPlacaProps {
  onVerDetalle: any
}

export default function BusquedaPlaca ({ onVerDetalle }: BusquedaPlacaProps) {
  const [placa, setPlaca] = useState("")
  const [resultados, setResultados] = useState<OrdenTrabajo[]>([])
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBuscar = async () => {
    if (!placa.trim()) {
      setError("Por favor ingrese una placa para buscar")
      return
    }

    setBuscando(true)
    setError(null)

    try {
      const ordenes = await buscarOrdenesPorPlaca(placa)
      setResultados(ordenes)

      if (ordenes.length === 0) {
        setError("No se encontraron resultados para esta placa")
      }
    } catch (err) {
      setError("Error al buscar. Intente nuevamente.")
      console.error(err)
    } finally {
      setBuscando(false)
    }
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Función para truncar texto largo
  const truncarTexto = (texto: string, longitud = 50) => {
    return texto.length > longitud ? texto.substring(0, longitud) + "..." : texto
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Car className="mr-2" size={20} />
        Búsqueda por Placa
      </h3>

      <div className="flex mb-4">
        <input
          type="text"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          placeholder="Ingrese la placa"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white uppercase"
        />
        <button
          onClick={handleBuscar}
          disabled={buscando}
          className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400"
        >
          {buscando ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4">{error}</div>
      )}

      {resultados.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Historial de Servicios</h4>
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {resultados.map((orden) => (
                <li
                  key={orden.id}
                  className="py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors duration-150"
                  onClick={() => onVerDetalle(orden)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <Calendar size={14} className="mr-1" />
                        {formatearFecha(orden.fecha)}
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">Orden #{orden.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {truncarTexto(orden.trabajo_realizado)}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Ver
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

