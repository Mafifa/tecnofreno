"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, DollarSign, Globe, Moon, Sun, Percent, Search, Trash2, AlertTriangle } from "lucide-react"
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

interface Garantia {
  id: number
  tiempo: number
  unidad: "dias" | "semanas" | "meses"
  ordenes_count?: number
}

type TabType = "general" | "mecanicos" | "clientes" | "vehiculos" | "ordenes" | "garantias"

const Configuracion: React.FC<ConfiguracionProps> = ({ onClose }) => {
  const { config, updateConfig } = useConfig()
  const [tabActiva, setTabActiva] = useState<TabType>("general")

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
  const [garantias, setGarantias] = useState<Garantia[]>([])

  // Estados para carga y errores
  const [cargando, setCargando] = useState<TabType | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Estado para confirmación de eliminación
  const [confirmacion, setConfirmacion] = useState<{
    tipo: "mecanico" | "cliente" | "vehiculo" | "orden" | "garantia"
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
    } else if (tabActiva === "garantias") {
      cargarGarantias()
    }
  }, [tabActiva])

  // Funciones para cargar datos
  const cargarMecanicos = async () => {
    setCargando("mecanicos")
    setError(null)
    try {
      const resultado = await window.electron.ipcRenderer.invoke("configuracion:obtenerMecanicos", busquedaMecanicos)
      setMecanicos(resultado)
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
      const resultado = await window.electron.ipcRenderer.invoke("configuracion:obtenerClientes", busquedaClientes)
      setClientes(resultado)
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
      const resultado = await window.electron.ipcRenderer.invoke("configuracion:obtenerVehiculos", busquedaVehiculos)
      setVehiculos(resultado)
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
      const resultado = await window.electron.ipcRenderer.invoke("configuracion:obtenerOrdenes", busquedaOrdenes)
      setOrdenes(resultado)
    } catch (err) {
      console.error("Error al cargar órdenes:", err)
      setError("Error al cargar órdenes. Intente nuevamente.")
    } finally {
      setCargando(null)
    }
  }

  const cargarGarantias = async () => {
    setCargando("garantias")
    setError(null)
    try {
      const resultado = await window.electron.ipcRenderer.invoke("configuracion:obtenerGarantias")
      setGarantias(resultado)
    } catch (err) {
      console.error("Error al cargar garantías:", err)
      setError("Error al cargar garantías. Intente nuevamente.")
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

  const eliminarGarantia = async (id: number) => {
    try {
      await window.electron.ipcRenderer.invoke("configuracion:eliminarGarantia", id)
      setConfirmacion(null)
      cargarGarantias()
    } catch (err: any) {
      setError(err.message || "Error al eliminar garantía")
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

  // Manejador para cambios en la configuración general
  const handleChange = async (key: keyof typeof config, value: any) => {
    updateConfig(key, value)
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
      case "garantia":
        mensaje = `¿Está seguro que desea eliminar la garantía de ${confirmacion.nombre}?`
        if (confirmacion.advertencia) {
          advertencia = `ADVERTENCIA: ${confirmacion.advertencia}`
        }
        accion = () => eliminarGarantia(confirmacion.id)
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

  // Función para formatear la unidad de garantía
  const formatearUnidadGarantia = (unidad: string, tiempo: number): string => {
    switch (unidad) {
      case "dias":
        return tiempo === 1 ? "día" : "días"
      case "semanas":
        return tiempo === 1 ? "semana" : "semanas"
      case "meses":
        return tiempo === 1 ? "mes" : "meses"
      default:
        return unidad
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Configuración</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
          <button
            onClick={() => setTabActiva("general")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${tabActiva === "general"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            General
          </button>
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
          <button
            onClick={() => setTabActiva("garantias")}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${tabActiva === "garantias"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            Garantías
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">{error}</div>
          )}

          {/* Pestaña General */}
          {tabActiva === "general" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ConfigSection
                  title="Tasa de Cambio para Inventario"
                  icon={<Percent className="h-6 w-6 text-blue-500" />}
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="tasaCambioInventario"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Seleccionar tasa
                      </label>
                      <select
                        id="tasaCambioInventario"
                        value={config.tasaCambioInventario}
                        onChange={(e) => handleChange("tasaCambioInventario", e.target.value)}
                        disabled={config.modalidadBolivarParalelo}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="bancoCentral">Banco Central</option>
                        <option value="paralelo">Paralelo</option>
                        <option value="binance">Binance</option>
                        <option value="promedio">Promedio</option>
                        <option value="personalizada">Personalizada</option>
                      </select>
                    </div>
                    <div>
                      {config.tasaCambioInventario === "personalizada" && (
                        <div>
                          <label
                            htmlFor="tasaPersonalizadaInventario"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Tasa personalizada
                          </label>
                          <input
                            type="number"
                            id="tasaPersonalizadaInventario"
                            value={config.tasaPersonalizadaInventario || ""}
                            onChange={(e) =>
                              handleChange("tasaPersonalizadaInventario", Number.parseFloat(e.target.value))
                            }
                            disabled={config.modalidadBolivarParalelo}
                            className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ingrese tasa personalizada"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </ConfigSection>

                <ConfigSection
                  title="Tasa de Cambio para Facturación"
                  icon={<Percent className="h-6 w-6 text-green-500" />}
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="tasaCambioFacturacion"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Seleccionar tasa
                      </label>
                      <select
                        id="tasaCambioFacturacion"
                        value={config.tasaCambioFacturacion}
                        onChange={(e) => handleChange("tasaCambioFacturacion", e.target.value)}
                        disabled={config.modalidadBolivarParalelo}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="bancoCentral">Banco Central</option>
                        <option value="paralelo">Paralelo</option>
                        <option value="binance">Binance</option>
                        <option value="promedio">Promedio</option>
                        <option value="personalizada">Personalizada</option>
                      </select>
                    </div>
                    <div>
                      {config.tasaCambioFacturacion === "personalizada" && (
                        <div>
                          <label
                            htmlFor="tasaPersonalizadaFacturacion"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Tasa personalizada
                          </label>
                          <input
                            type="number"
                            id="tasaPersonalizadaFacturacion"
                            value={config.tasaPersonalizadaFacturacion || ""}
                            onChange={(e) =>
                              handleChange("tasaPersonalizadaFacturacion", Number.parseFloat(e.target.value))
                            }
                            disabled={config.modalidadBolivarParalelo}
                            className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ingrese tasa personalizada"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </ConfigSection>
              </div>

              <div className="space-y-6">
                <ConfigSection title="Preferencias de Idioma" icon={<Globe className="h-6 w-6 text-purple-500" />}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Idioma</span>
                    <select
                      id="idioma"
                      value={config.idioma}
                      onChange={(e) => handleChange("idioma", e.target.value as "es" | "en")}
                      className="px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </ConfigSection>

                <ConfigSection
                  title="Apariencia"
                  icon={
                    config.modoOscuro ? (
                      <Moon className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <Sun className="h-6 w-6 text-yellow-500" />
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</span>
                    <Toggle enabled={config.modoOscuro} onChange={(value) => handleChange("modoOscuro", value)} />
                  </div>
                </ConfigSection>
              </div>
            </div>
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
                  onClick={cargarMecanicos}
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
                  onClick={cargarClientes}
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
                  onClick={cargarVehiculos}
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
                  onClick={cargarOrdenes}
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
              )}
            </div>
          )}

          {/* Pestaña Garantías */}
          {tabActiva === "garantias" && (
            <div>
              {cargando === "garantias" ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tiempo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Unidad
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
                      {garantias.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No se encontraron garantías
                          </td>
                        </tr>
                      ) : (
                        garantias.map((garantia) => (
                          <tr key={garantia.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {garantia.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {garantia.tiempo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatearUnidadGarantia(garantia.unidad, garantia.tiempo)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {garantia.ordenes_count || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() =>
                                  setConfirmacion({
                                    tipo: "garantia",
                                    id: garantia.id,
                                    nombre: `${garantia.tiempo} ${formatearUnidadGarantia(garantia.unidad, garantia.tiempo)}`,
                                    advertencia:
                                      garantia.ordenes_count && garantia.ordenes_count > 0
                                        ? `Esta garantía está asociada a ${garantia.ordenes_count} órdenes. Al eliminarla, estas órdenes quedarán sin garantía.`
                                        : undefined,
                                  })
                                }
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Eliminar garantía"
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

const ConfigSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {children}
    </div>
  )
}

const Toggle: React.FC<{ enabled: boolean; onChange: (value: boolean) => void }> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`${enabled ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`${enabled ? "translate-x-5" : "translate-x-0"
          } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      >
        <span
          className={`${enabled ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
            } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
        >
          <X className="h-3 w-3 text-gray-400" />
        </span>
        <span
          className={`${enabled ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"
            } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
        >
          <DollarSign className="h-3 w-3 text-blue-600" />
        </span>
      </span>
    </button>
  )
}

export default Configuracion

