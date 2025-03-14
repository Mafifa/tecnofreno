"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { obtenerHistorialRecibos } from "./servicios-historial"
import DetalleOrdenModal from "../busqueda/DetalleOrdenModal"
import type { OrdenTrabajo } from "./orden-trabajo"

export default function Historial () {
  // Estado para filtros
  const [filtroId, setFiltroId] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  // Estado para resultados y paginación
  const [recibos, setRecibos] = useState<OrdenTrabajo[]>([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para modal de detalles
  const [reciboSeleccionado, setReciboSeleccionado] = useState<OrdenTrabajo | null>(null)
  const [modalAbierta, setModalAbierta] = useState(false)

  // Cargar recibos al montar el componente o cambiar filtros/página
  useEffect(() => {
    cargarRecibos()
  }, [paginaActual])

  const cargarRecibos = async () => {
    setCargando(true)
    setError(null)

    try {
      const resultado = await obtenerHistorialRecibos({
        pagina: paginaActual,
        id: filtroId || undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
      })

      setRecibos(resultado.recibos)
      setTotalPaginas(resultado.totalPaginas)
    } catch (err) {
      console.error("Error al cargar historial:", err)
      setError("Ocurrió un error al cargar el historial. Intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  const handleBuscar = () => {
    setPaginaActual(1) // Resetear a primera página al buscar
    cargarRecibos()
  }

  const handleLimpiarFiltros = () => {
    setFiltroId("")
    setFechaInicio("")
    setFechaFin("")
    setPaginaActual(1)
    cargarRecibos()
  }

  const handleSeleccionarRecibo = (recibo: OrdenTrabajo) => {
    setReciboSeleccionado(recibo)
    setModalAbierta(true)
  }

  const handleCerrarModal = () => {
    setModalAbierta(false)
    setReciboSeleccionado(null)
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-6xl mx-auto transition-colors duration-200">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Historial de Recibos</h2>

        {/* Sección de filtros (siempre visible) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filtroId" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de Recibo
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="filtroId"
                  value={filtroId}
                  onChange={(e) => setFiltroId(e.target.value)}
                  placeholder="Buscar por ID"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fechaInicio" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha Inicio
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fechaFin" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha Fin
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  id="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={handleLimpiarFiltros}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Limpiar
            </button>
            <button
              onClick={handleBuscar}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center"
            >
              <Search size={18} className="mr-2" />
              Buscar
            </button>
          </div>
        </div>

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
          ) : recibos.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No se encontraron recibos con los criterios de búsqueda.
            </div>
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
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recibos.map((recibo) => (
                  <tr
                    key={recibo.id}
                    onClick={() => handleSeleccionarRecibo(recibo)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{recibo.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatearFecha(recibo.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {recibo.cliente_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {recibo.vehiculo_placa} - {recibo.vehiculo_modelo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {recibo.mecanico_nombre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        {!cargando && recibos.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando página <span className="font-medium">{paginaActual}</span> de{" "}
              <span className="font-medium">{totalPaginas}</span>
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
      {reciboSeleccionado && (
        <DetalleOrdenModal orden={reciboSeleccionado} isOpen={modalAbierta} onClose={handleCerrarModal} />
      )}
    </div>
  )
}

