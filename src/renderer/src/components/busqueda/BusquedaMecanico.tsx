"use client"

import type React from "react"

import { useState } from "react"
import { Search, Calendar, PenToolIcon as Tool } from "lucide-react"
import { buscarOrdenesPorMecanico, buscarMecanicos } from "./servicios-mock"

interface OrdenTrabajo {
  id: number
  fecha: string
  trabajo_realizado: string
  mecanico_id: number
}

interface Mecanico {
  id: number
  nombre: string
}

interface BusquedaMecanicoProps {
  onVerDetalle: any
}

export default function BusquedaMecanico ({ onVerDetalle }: BusquedaMecanicoProps) {
  const [nombreMecanico, setNombreMecanico] = useState("")
  const [resultados, setResultados] = useState<OrdenTrabajo[]>([])
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
  const [mecanicosFiltrados, setMecanicosFiltrados] = useState<Mecanico[]>([])
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState<Mecanico | null>(null)

  // Cargar lista de mecánicos al montar el componente
  useState(() => {
    const cargarMecanicos = async () => {
      try {
        const listaMecanicos = await buscarMecanicos()
        setMecanicos(listaMecanicos)
      } catch (err) {
        console.error("Error al cargar mecánicos:", err)
      }
    }

    cargarMecanicos()
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setNombreMecanico(valor)

    if (valor.trim()) {
      const filtrados = mecanicos.filter((m) => m.nombre.toLowerCase().includes(valor.toLowerCase()))
      setMecanicosFiltrados(filtrados)
    } else {
      setMecanicosFiltrados([])
    }
  }

  const handleSeleccionarMecanico = (mecanico: Mecanico) => {
    setMecanicoSeleccionado(mecanico)
    setNombreMecanico(mecanico.nombre)
    setMecanicosFiltrados([])
  }

  const handleBuscar = async () => {
    if (!mecanicoSeleccionado) {
      setError("Por favor seleccione un mecánico para buscar")
      return
    }

    setBuscando(true)
    setError(null)

    try {
      const ordenes = await buscarOrdenesPorMecanico(mecanicoSeleccionado.id)
      setResultados(ordenes)

      if (ordenes.length === 0) {
        setError("No se encontraron resultados para este mecánico")
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
        <Tool className="mr-2" size={20} />
        Búsqueda por Mecánico
      </h3>

      <div className="relative mb-4">
        <div className="flex">
          <input
            type="text"
            value={nombreMecanico}
            onChange={handleInputChange}
            placeholder="Nombre del mecánico"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleBuscar}
            disabled={buscando || !mecanicoSeleccionado}
            className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400"
          >
            {buscando ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>

        {/* Lista de sugerencias */}
        {mecanicosFiltrados.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {mecanicosFiltrados.map((mecanico) => (
              <li
                key={mecanico.id}
                onClick={() => handleSeleccionarMecanico(mecanico)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              >
                {mecanico.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4">{error}</div>
      )}

      {resultados.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Trabajos Realizados</h4>
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

