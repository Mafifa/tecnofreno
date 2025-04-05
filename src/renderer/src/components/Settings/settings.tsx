"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Moon, Sun, Search, Trash2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { useConfig } from "./useSettings"

interface ConfiguracionProps {
  onClose: () => void
}

// Interfaces para los datos
interface Mecanico {
  id: number
  nombre: string
  ordenes_count?: number
}

interface Cliente {
  id: number
  nombre: string
  telefono: string
  vehiculos_count?: number
  ordenes_count?: number
}

interface Vehiculo {
  id: number
  modelo: string
  placa: string
  anio: number
  tipo: string
  cliente_id: number
  cliente_nombre?: string
  ordenes_count?: number
}

interface OrdenResumen {
  id: number
  fecha: string
  cliente_nombre: string
  vehiculo_placa: string
  mecanico_nombre: string
  trabajo_realizado: string
}

// Interfaz para la respuesta paginada
interface PaginatedResponse<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
}

type TabType = "mecanicos" | "clientes" | "vehiculos" | "ordenes"

const ITEMS_POR_PAGINA = 10

const Configuracion: React.FC<ConfiguracionProps> = ({ onClose }) => {
  const { config, updateConfig } = useConfig()
  const [tabActiva, setTabActiva] = useState<TabType>("mecanicos")

  // Estados para búsqueda
  const [busquedaMecanicos, setBusquedaMecanicos] = useState("")
  const [busquedaClientes, setBusquedaClientes] = useState("")
  const [busquedaVehiculos, setBusquedaVehiculos] = useState("")
  const [busquedaOrdenes, setBusquedaOrdenes] = useState("")

  // Estados para datos
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [ordenes, setOrdenes] = useState<OrdenResumen[]>([])

  // Estados para paginación
  const [paginaMecanicos, setPaginaMecanicos] = useState(1)
  const [paginaClientes, setPaginaClientes] = useState(1)
  const [paginaVehiculos, setPaginaVehiculos] = useState(1)
  const [paginaOrdenes, setPaginaOrdenes] = useState(1)

  const [totalPaginasMecanicos, setTotalPaginasMecanicos] = useState(1)
  const [totalPaginasClientes, setTotalPaginasClientes] = useState(1)
  const [totalPaginasVehiculos, setTotalPaginasVehiculos] = useState(1)
  const [totalPaginasOrdenes, setTotalPaginasOrdenes] = useState(1)

  const [totalMecanicos, setTotalMecanicos] = useState(0)
  const [totalClientes, setTotalClientes] = useState(0)
  const [totalVehiculos, setTotalVehiculos] = useState(0)
  const [totalOrdenes, setTotalOrdenes] = useState(0)

  // Estados para carga y errores
  const [cargando, setCargando] = useState<TabType | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Estado para confirmación de eliminación
  const [confirmacion, setConfirmacion] = useState<{
    tipo: "mecanico" | "cliente" | "vehiculo" | "orden"
    id: number
    nombre: string
    advertencia?: string
  } | null>(null)

  // Cargar datos según la pestaña activa
  useEffect(() => {
    if (tabActiva === "mecanicos") {
      cargarMecanicos()
    } else if (tabActiva === "clientes") {
      cargarClientes()
    } else if (tabActiva === "vehiculos") {
      cargarVehiculos()
    } else if (tabActiva === "ordenes") {
      cargarOrdenes()
    }
  }, [tabActiva, paginaMecanicos, paginaClientes, paginaVehiculos, paginaOrdenes])

  // Funciones para cargar datos
  const cargarMecanicos = async () => {
    setCargando("mecanicos")
    setError(null)
    try {
      const resultado = (await window.electron.ipcRenderer.invoke("configuracion:obtenerMecanicos", {
        busqueda: busquedaMecanicos,
        pagina: paginaMecanicos,
        itemsPorPagina: ITEMS_POR_PAGINA,
        ordenarPor: "id",
        ordenDireccion: "DESC",
      })) as PaginatedResponse<Mecanico>

      setMecanicos(resultado.items)
      setTotalPaginasMecanicos(resultado.totalPages)
      setTotalMecanicos(resultado.totalItems)
    } catch (err) {
      console.error("Error al cargar mecánicos:", err)
      setError("Error al cargar mecánicos. Intente nuevamente.")
    } finally {
      setCargando(null)
    }
  }

  const cargarClientes = async () => {
    setCargando("clientes")
    setError(null)
    try {
      const resultado = (await window.electron.ipcRenderer.invoke("configuracion:obtenerClientes", {
        busqueda: busquedaClientes,
        pagina: paginaClientes,
        itemsPorPagina: ITEMS_POR_PAGINA,
        ordenarPor: "id",
        ordenDireccion: "DESC",
      })) as PaginatedResponse<Cliente>

      setClientes(resultado.items)
      setTotalPaginasClientes(resultado.totalPages)
      setTotalClientes(resultado.totalItems)
    } catch (err) {
      console.error("Error al cargar clientes:", err)
      setError("Error al cargar clientes. Intente nuevamente.")
    } finally {
      setCargando(null)
    }
  }

  const cargarVehiculos = async () => {
    setCargando("vehiculos")
    setError(null)
    try {
      const resultado = (await window.electron.ipcRenderer.invoke("configuracion:obtenerVehiculos", {
        busqueda: busquedaVehiculos,
        pagina: paginaVehiculos,
        itemsPorPagina: ITEMS_POR_PAGINA,
        ordenarPor: "id",
        ordenDireccion: "DESC",
      })) as PaginatedResponse<Vehiculo>

      setVehiculos(resultado.items)
      setTotalPaginasVehiculos(resultado.totalPages)
      setTotalVehiculos(resultado.totalItems)
    } catch (err) {
      console.error("Error al cargar vehículos:", err)
      setError("Error al cargar vehículos. Intente nuevamente.")
    } finally {
      setCargando(null)
    }
  }

  const cargarOrdenes = async () => {
    setCargando("ordenes")
    setError(null)
    try {
      const resultado = (await window.electron.ipcRenderer.invoke("configuracion:obtenerOrdenes", {
        busqueda: busquedaOrdenes,
        pagina: paginaOrdenes,
        itemsPorPagina: ITEMS_POR_PAGINA,
        ordenarPor: "id",
        ordenDireccion: "DESC",
      })) as PaginatedResponse<OrdenResumen>

      setOrdenes(resultado.items)
      setTotalPaginasOrdenes(resultado.totalPages)
      setTotalOrdenes(resultado.totalItems)
    } catch (err) {
      console.error("Error al cargar órdenes:", err)
      setError("Error al cargar órdenes. Intente nuevamente.")
    } finally {
      setCargando(null)
    }
  }

  // Funciones para eliminar
  const eliminarMecanico = async (id: number) => {
    try {
      await window.electron.ipcRenderer.invoke("configuracion:eliminarMecanico", id)
      setConfirmacion(null)
      cargarMecanicos()
    } catch (err: any) {
      setError(err.message || "Error al eliminar mecánico")
      setConfirmacion(null)
    }
  }

  const eliminarCliente = async (id: number) => {
    try {
      await window.electron.ipcRenderer.invoke("configuracion:eliminarCliente", id)
      setConfirmacion(null)
      cargarClientes()
    } catch (err: any) {
      setError(err.message || "Error al eliminar cliente")
      setConfirmacion(null)
    }
  }

  const eliminarVehiculo = async (id: number) => {
    try {
      await window.electron.ipcRenderer.invoke("configuracion:eliminarVehiculo", id)
      setConfirmacion(null)
      cargarVehiculos()
    } catch (err: any) {
      setError(err.message || "Error al eliminar vehículo")
      setConfirmacion(null)
    }
  }

  const eliminarOrden = async (id: number) => {
    try {
      await window.electron.ipcRenderer.invoke("configuracion:eliminarOrden", id)
      setConfirmacion(null)
      cargarOrdenes()
    } catch (err: any) {
      setError(err.message || "Error al eliminar orden")
      setConfirmacion(null)
    }
  }

  // Manejadores de búsqueda
  const handleBusquedaMecanicos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaMecanicos(e.target.value)
  }

  const handleBusquedaClientes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaClientes(e.target.value)
  }

  const handleBusquedaVehiculos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaVehiculos(e.target.value)
  }

  const handleBusquedaOrdenes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusquedaOrdenes(e.target.value)
  }

  // Manejadores de paginación
  const handlePaginaAnteriorMecanicos = () => {
    if (paginaMecanicos > 1) {
      setPaginaMecanicos(paginaMecanicos - 1)
    }
  }

  const handlePaginaSiguienteMecanicos = () => {
    if (paginaMecanicos < totalPaginasMecanicos) {
      setPaginaMecanicos(paginaMecanicos + 1)
    }
  }

  const handlePaginaAnteriorClientes = () => {
    if (paginaClientes > 1) {
      setPaginaClientes(paginaClientes - 1)
    }
  }

  const handlePaginaSiguienteClientes = () => {
    if (paginaClientes < totalPaginasClientes) {
      setPaginaClientes(paginaClientes + 1)
    }
  }

  const handlePaginaAnteriorVehiculos = () => {
    if (paginaVehiculos > 1) {
      setPaginaVehiculos(paginaVehiculos - 1)
    }
  }

  const handlePaginaSiguienteVehiculos = () => {
    if (paginaVehiculos < totalPaginasVehiculos) {
      setPaginaVehiculos(paginaVehiculos + 1)
    }
  }

  const handlePaginaAnteriorOrdenes = () => {
    if (paginaOrdenes > 1) {
      setPaginaOrdenes(paginaOrdenes - 1)
    }
  }

  const handlePaginaSiguienteOrdenes = () => {
    if (paginaOrdenes < totalPaginasOrdenes) {
      setPaginaOrdenes(paginaOrdenes + 1)
    }
  }

  // Manejador para cambios en la configuración
  const toggleModoOscuro = () => {
    updateConfig("modoOscuro", !config.modoOscuro)
  }

  // Renderizar modal de confirmación
  const renderConfirmacion = () => {
    if (!confirmacion) return null

    let mensaje = ""
    let advertencia = confirmacion.advertencia || ""
    let accion = () => { }

    switch (confirmacion.tipo) {
      case "mecanico":
        mensaje = `¿Está seguro que desea eliminar al mecánico "${confirmacion.nombre}"?`
        if (confirmacion.advertencia) {
          advertencia = `ADVERTENCIA: ${confirmacion.advertencia}`
        }
        accion = () => eliminarMecanico(confirmacion.id)
        break
      case "cliente":
        mensaje = `¿Está seguro que desea eliminar al cliente "${confirmacion.nombre}"?`
        if (confirmacion.advertencia) {
          advertencia = `ADVERTENCIA: ${confirmacion.advertencia}`
        }
        accion = () => eliminarCliente(confirmacion.id)
        break
      case "vehiculo":
        mensaje = `¿Está seguro que desea eliminar el vehículo "${confirmacion.nombre}"?`
        if (confirmacion.advertencia) {
          advertencia = `ADVERTENCIA: ${confirmacion.advertencia}`
        }
        accion = () => eliminarVehiculo(confirmacion.id)
        break
      case "orden":
        mensaje = `¿Está seguro que desea eliminar la orden #${confirmacion.id}?`
        accion = () => eliminarOrden(confirmacion.id)
        break
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="flex items-center mb-4 text-yellow-500">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Confirmar eliminación</h3>
          </div>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{mensaje}</p>

          {advertencia && (
            <div className="mb-6 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
              {advertencia}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setConfirmacion(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={accion}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Función para formatear la fecha
  const formatearFecha = (fecha: string): string => {
    try {
      // Si la fecha ya está en formato DD/MM/YYYY, HH:MM
      if (fecha.includes("/")) {
        return fecha.split(",")[0] // Devolver solo la parte de la fecha
      }

      // Si es una fecha ISO o timestamp
      const fechaObj = new Date(fecha)
      return fechaObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return fecha // Devolver la fecha original si hay error
    }
  }

  // Componente para renderizar la paginación
  const Paginacion = ({
    paginaActual,
    totalPaginas,
    totalItems,
    onAnterior,
    onSiguiente,
  }: {
    paginaActual: number
    totalPaginas: number
    totalItems: number
    onAnterior: () => void
    onSiguiente: () => void
  }) => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA + 1
    const fin = Math.min(paginaActual * ITEMS_POR_PAGINA, totalItems)

    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Mostrando <span className="font-medium">{totalItems > 0 ? inicio : 0}</span> a{" "}
          <span className="font-medium">{fin}</span> de <span className="font-medium">{totalItems}</span> resultados
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onAnterior}
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
            onClick={onSiguiente}
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
            className={`px-3 py-2 rounded-lg flex items-center ${paginaActual === totalPaginas || totalPaginas === 0
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
              } transition-colors duration-200`}
          >
            Siguiente
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Configuración</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleModoOscuro}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title={config.modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {config.modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 h-16 overflow-x-auto">
          <button
            onClick={() => setTabActiva("mecanicos")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${tabActiva === "mecanicos"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            Mecánicos
          </button>
          <button
            onClick={() => setTabActiva("clientes")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${tabActiva === "clientes"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setTabActiva("vehiculos")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${tabActiva === "vehiculos"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            Vehículos
          </button>
          <button
            onClick={() => setTabActiva("ordenes")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${tabActiva === "ordenes"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            Órdenes
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">{error}</div>
          )}

          {/* Pestaña Mecánicos */}
          {tabActiva === "mecanicos" && (
            <div>
              <div className="mb-6 flex items-center">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar mecánicos..."
                    value={busquedaMecanicos}
                    onChange={handleBusquedaMecanicos}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <button
                  onClick={() => {
                    setPaginaMecanicos(1) // Resetear a la primera página al buscar
                    cargarMecanicos()
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Buscar
                </button>
              </div>

              {cargando === "mecanicos" ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Órdenes
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {mecanicos.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No se encontraron mecánicos
                            </td>
                          </tr>
                        ) : (
                          mecanicos.map((mecanico) => (
                            <tr key={mecanico.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {mecanico.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {mecanico.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {mecanico.ordenes_count || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    setConfirmacion({
                                      tipo: "mecanico",
                                      id: mecanico.id,
                                      nombre: mecanico.nombre,
                                      advertencia:
                                        mecanico.ordenes_count && mecanico.ordenes_count > 0
                                          ? `Este mecánico tiene ${mecanico.ordenes_count} órdenes asociadas que también serán eliminadas.`
                                          : undefined,
                                    })
                                  }
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Eliminar mecánico"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Paginacion
                    paginaActual={paginaMecanicos}
                    totalPaginas={totalPaginasMecanicos}
                    totalItems={totalMecanicos}
                    onAnterior={handlePaginaAnteriorMecanicos}
                    onSiguiente={handlePaginaSiguienteMecanicos}
                  />
                </>
              )}
            </div>
          )}

          {/* Pestaña Clientes */}
          {tabActiva === "clientes" && (
            <div>
              <div className="mb-6 flex items-center">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={busquedaClientes}
                    onChange={handleBusquedaClientes}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <button
                  onClick={() => {
                    setPaginaClientes(1) // Resetear a la primera página al buscar
                    cargarClientes()
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Buscar
                </button>
              </div>

              {cargando === "clientes" ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Teléfono
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Vehículos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Órdenes
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {clientes.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No se encontraron clientes
                            </td>
                          </tr>
                        ) : (
                          clientes.map((cliente) => (
                            <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {cliente.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {cliente.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {cliente.telefono}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {cliente.vehiculos_count || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {cliente.ordenes_count || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    setConfirmacion({
                                      tipo: "cliente",
                                      id: cliente.id,
                                      nombre: cliente.nombre,
                                      advertencia:
                                        (cliente.vehiculos_count && cliente.vehiculos_count > 0) ||
                                          (cliente.ordenes_count && cliente.ordenes_count > 0)
                                          ? `Este cliente tiene ${cliente.vehiculos_count || 0} vehículos y ${cliente.ordenes_count || 0} órdenes asociadas que también serán eliminadas.`
                                          : undefined,
                                    })
                                  }
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Eliminar cliente"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Paginacion
                    paginaActual={paginaClientes}
                    totalPaginas={totalPaginasClientes}
                    totalItems={totalClientes}
                    onAnterior={handlePaginaAnteriorClientes}
                    onSiguiente={handlePaginaSiguienteClientes}
                  />
                </>
              )}
            </div>
          )}

          {/* Pestaña Vehículos */}
          {tabActiva === "vehiculos" && (
            <div>
              <div className="mb-6 flex items-center">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar vehículos..."
                    value={busquedaVehiculos}
                    onChange={handleBusquedaVehiculos}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <button
                  onClick={() => {
                    setPaginaVehiculos(1)
                    cargarVehiculos()
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Buscar
                </button>
              </div>

              {cargando === "vehiculos" ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Placa
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Modelo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Año
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Órdenes
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {vehiculos.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No se encontraron vehículos
                            </td>
                          </tr>
                        ) : (
                          vehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {vehiculo.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {vehiculo.placa}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {vehiculo.modelo}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {vehiculo.anio}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {vehiculo.tipo}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {vehiculo.cliente_nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {vehiculo.ordenes_count || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    setConfirmacion({
                                      tipo: "vehiculo",
                                      id: vehiculo.id,
                                      nombre: `${vehiculo.placa} - ${vehiculo.modelo}`,
                                      advertencia:
                                        vehiculo.ordenes_count && vehiculo.ordenes_count > 0
                                          ? `Este vehículo tiene ${vehiculo.ordenes_count} órdenes asociadas que también serán eliminadas.`
                                          : undefined,
                                    })
                                  }
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Eliminar vehículo"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Paginacion
                    paginaActual={paginaVehiculos}
                    totalPaginas={totalPaginasVehiculos}
                    totalItems={totalVehiculos}
                    onAnterior={handlePaginaAnteriorVehiculos}
                    onSiguiente={handlePaginaSiguienteVehiculos}
                  />
                </>
              )}
            </div>
          )}

          {/* Pestaña Órdenes */}
          {tabActiva === "ordenes" && (
            <div>
              <div className="mb-6 flex items-center">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar órdenes..."
                    value={busquedaOrdenes}
                    onChange={handleBusquedaOrdenes}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <button
                  onClick={() => {
                    setPaginaOrdenes(1)
                    cargarOrdenes()
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Buscar
                </button>
              </div>

              {cargando === "ordenes" ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Vehículo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Mecánico
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Trabajo
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {ordenes.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No se encontraron órdenes
                            </td>
                          </tr>
                        ) : (
                          ordenes.map((orden) => (
                            <tr key={orden.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {orden.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatearFecha(orden.fecha)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {orden.cliente_nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {orden.vehiculo_placa}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {orden.mecanico_nombre}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {orden.trabajo_realizado}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    setConfirmacion({
                                      tipo: "orden",
                                      id: orden.id,
                                      nombre: orden.id.toString(),
                                    })
                                  }
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Eliminar orden"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Paginacion
                    paginaActual={paginaOrdenes}
                    totalPaginas={totalPaginasOrdenes}
                    totalItems={totalOrdenes}
                    onAnterior={handlePaginaAnteriorOrdenes}
                    onSiguiente={handlePaginaSiguienteOrdenes}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {renderConfirmacion()}
    </div>
  )
}

export default Configuracion

