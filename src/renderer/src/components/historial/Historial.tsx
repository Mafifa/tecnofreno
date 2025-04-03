"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, User, Car, PenToolIcon as Tool } from "lucide-react"
import DetalleOrdenModal from "../principal/modals/detalle-orden-modal"
interface OrdenTrabajoDetallada extends OrdenTrabajo {
  // Información del cliente
  cliente_nombre: string
  cliente_telefono?: string

  // Información del vehículo
  vehiculo_modelo: string
  vehiculo_placa: string
  vehiculo_anio: string
  vehiculo_tipo: "Camioneta" | "Sedan" | "Autobus" | "Camion"

  // Información del mecánico
  mecanico_nombre: string

  // Información de la garantía (opcional)
  garantia_tiempo?: number
  garantia_unidad?: "dias" | "semanas" | "meses"
}

// Respuesta paginada para historial
interface HistorialResponse {
  ordenes: OrdenTrabajoDetallada[]
  totalPaginas: number
  totalRegistros: number
}

// Filtros para búsqueda en historial
interface HistorialFiltros {
  clienteId?: number
  vehiculoId?: number
  mecanicoId?: number
  pagina: number
  itemsPorPagina: number
}

export default function Historial () {
  // Estado para resultados y paginación
  const [ordenes, setOrdenes] = useState<OrdenTrabajoDetallada[]>([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para modal de detalles
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenTrabajoDetallada | null>(null)
  const [modalAbierta, setModalAbierta] = useState(false)

  // Constante para items por página
  const ITEMS_POR_PAGINA = 8

  // Cargar órdenes al montar el componente o cambiar filtros/página
  useEffect(() => {
    cargarOrdenes()
  }, [paginaActual])

  const cargarOrdenes = async () => {
    setCargando(true)
    setError(null)

    try {
      // Construir objeto de filtros
      const filtros: HistorialFiltros = {
        pagina: paginaActual,
        itemsPorPagina: ITEMS_POR_PAGINA,
      }

      // Llamar al backend
      const resultado = (await window.electron.ipcRenderer.invoke("orden:getHistorial", filtros)) as HistorialResponse

      if (!resultado || !resultado.ordenes) {
        throw new Error("Respuesta inválida del servidor")
      }

      setOrdenes(resultado.ordenes)
      setTotalPaginas(resultado.totalPaginas)
      setTotalRegistros(resultado.totalRegistros)
    } catch (err) {
      console.error("Error al cargar historial:", err)
      setError("Ocurrió un error al cargar el historial. Intente nuevamente.")
      setOrdenes([])
      setTotalPaginas(1)
      setTotalRegistros(0)
    } finally {
      setCargando(false)
    }
  }

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1)
    }
  }

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1)
    }
  }

  const handleSeleccionarOrden = (orden: OrdenTrabajoDetallada) => {
    setOrdenSeleccionada(orden)
    setModalAbierta(true)
  }

  const handleCerrarModal = () => {
    setModalAbierta(false)
    setOrdenSeleccionada(null)
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 -my-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-6xl mx-auto transition-colors duration-200">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Historial de Órdenes</h2>

        {/* Tabla de resultados */}
        <div className="overflow-x-auto">
          {cargando ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : ordenes.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">No se encontraron órdenes.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Vehículo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Mecánico
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {ordenes.map((orden) => (
                  <tr
                    key={orden.id}
                    onClick={() => handleSeleccionarOrden(orden)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{orden.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatearFecha(orden.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        {orden.cliente_nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center">
                        <Car size={16} className="mr-2 text-gray-400" />
                        {orden.vehiculo_placa} - {orden.vehiculo_modelo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center">
                        <Tool size={16} className="mr-2 text-gray-400" />
                        {orden.mecanico_nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSeleccionarOrden(orden)
                        }}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        {!cargando && ordenes.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span className="font-medium">{(paginaActual - 1) * ITEMS_POR_PAGINA + 1}</span> a{" "}
              <span className="font-medium">{Math.min(paginaActual * ITEMS_POR_PAGINA, totalRegistros)}</span> de{" "}
              <span className="font-medium">{totalRegistros}</span> resultados
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePaginaAnterior}
                disabled={paginaActual === 1}
                className={`px-3 py-2 rounded-lg flex items-center ${paginaActual === 1
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
                  } transition-colors duration-200`}
              >
                <ChevronLeft size={18} className="mr-1" />
                Anterior
              </button>
              <button
                onClick={handlePaginaSiguiente}
                disabled={paginaActual === totalPaginas}
                className={`px-3 py-2 rounded-lg flex items-center ${paginaActual === totalPaginas
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
                  } transition-colors duration-200`}
              >
                Siguiente
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {ordenSeleccionada && (
        <DetalleOrdenModal orden={ordenSeleccionada} isOpen={modalAbierta} onClose={handleCerrarModal} />
      )}
    </div>
  )
}

