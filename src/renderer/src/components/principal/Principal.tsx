import type React from "react"
import { useState } from "react"
import {
  Calendar,
  Car,
  User,
  FileText,
  PenToolIcon as Tool,
  Plus,
  X,
  Search,
  UserPlus,
  CarFront,
  CreditCard,
  Clock,
} from "lucide-react"
import ClienteModal from "./cliente-modal"
import VehiculoModal from "./vehiculo-modal"
import DetalleOrdenModal from "./DetalleOrdenModal"
import ResultadosLateral from "./ResultadosLateral"
import { useSearchVehiculo } from "./hooks/vehiculos/getVehiculo"
import { useSearchClient } from "./hooks/clientes/getCliente"
interface OrdenTrabajo {
  id: number
  fecha: string
  trabajo_realizado: string
  notas?: string
}

export default function Principal () {
  const [isTrabajoModalOpen, setTrabajoModalOpen] = useState(false)
  const [isNotaModalOpen, setNotaModalOpen] = useState(false)
  const [isMecanicoModalOpen, setMecanicoModalOpen] = useState(false)
  const [isClienteModalOpen, setClienteModalOpen] = useState(false)
  const [isVehiculoModalOpen, setVehiculoModalOpen] = useState(false)
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [mecanico, setMecanico] = useState("")
  const [mecanicos, setMecanicos] = useState(["Juan", "Pedro", "Luis", "Carlos"])
  const [filteredMecanicos, setFilteredMecanicos] = useState<string[]>([])
  const [trabajoRealizado, setTrabajoRealizado] = useState("")
  const [nota, setNota] = useState("")
  const [placa, setPlaca] = useState("")
  const [datos, setDatos] = useState({})

  // Estados para la búsqueda de órdenes por placa
  const [resultadosOrdenes, setResultadosOrdenes] = useState<OrdenTrabajo[]>([])
  const [buscandoOrdenes, setBuscandoOrdenes] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null)

  // Estado para el modal de detalle de orden
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenTrabajo | null>(null)
  const [isDetalleModalOpen, setDetalleModalOpen] = useState(false)

  // Estado para garantía
  const [garantiaTiempo, setGarantiaTiempo] = useState("")
  const [garantiaUnidad, setGarantiaUnidad] = useState("dias")

  // Para buscar Vehiculo
  const { searchByPlaca } = useSearchVehiculo(placa)

  const handleMecanicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMecanico(value)
    if (value) {
      setFilteredMecanicos(mecanicos.filter((m) => m.toLowerCase().includes(value.toLowerCase())))
    } else {
      setFilteredMecanicos([])
    }
  }

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaca(e.target.value.toUpperCase())
  }

  const handleBuscarPlaca = async () => {
    if (!placa.trim()) {
      setErrorBusqueda("Por favor ingrese una placa para buscar")
      return
    }

    try {
      const vehiculo = searchByPlaca
      if (vehiculo.data) {
        const cliente = await window.electron.ipcRenderer.invoke('cliente:getById', vehiculo.data.cliente_id) as Cliente
        console.log('Desde el frontend', cliente);

        setDatos({
          vehiculo: vehiculo.data.modelo,
          cliente: cliente.nombre,
          cedula: cliente.cedula_rif
        })
      }
    } catch (error) {
      const err = error as Error
      console.log(err.message);
    }

    setBuscandoOrdenes(true)
    setErrorBusqueda(null)

    try {
      const ordenes = await buscarOrdenesPorPlaca(placa)
      setResultadosOrdenes(ordenes)

      if (ordenes.length === 0) {
        setErrorBusqueda("No se encontraron órdenes para esta placa")
      }
    } catch (err) {
      setErrorBusqueda("Error al buscar. Intente nuevamente.")
      console.error(err)
    } finally {
      setBuscandoOrdenes(false)
    }
  }

  const handleVerDetalleOrden = (orden: OrdenTrabajo) => {
    setOrdenSeleccionada(orden)
    setDetalleModalOpen(true)
  }

  const handleSave = () => {
    console.log("Datos guardados")
  }

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setTrabajoModalOpen(false)
      setNotaModalOpen(false)
      setMecanicoModalOpen(false)
      setClienteModalOpen(false)
      setVehiculoModalOpen(false)
    }
  }

  const handleSaveCliente = (clienteData: { nombre: string; cedula: string; telefono: string }) => {
    console.log("Cliente guardado:", clienteData)
    setClienteModalOpen(false)
    // Aquí se podría agregar lógica para guardar en base de datos
  }

  const handleSaveVehiculo = (vehiculoData: {
    modelo: string
    placa: string
    anio: string
    tipo: string
    clienteId: string
  }) => {
    console.log("Vehículo guardado:", vehiculoData)
    setVehiculoModalOpen(false)
    // Aquí se podría agregar lógica para guardar en base de datos
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-200">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario principal */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-200">
              <div className="flex justify-between items-center mb-8">
                {/* Botones para agregar cliente y vehículo */}
                <div className="flex justify-end space-x-4 mb-6">
                  <button
                    onClick={() => setClienteModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    <UserPlus size={18} className="mr-2" />
                    Agregar Cliente
                  </button>
                  <button
                    onClick={() => setVehiculoModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    <CarFront size={18} className="mr-2" />
                    Agregar Vehículo
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      id="fecha"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="vehiculo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vehículo
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="vehiculo"
                      readOnly
                      value={datos.vehiculo}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="placa" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Placa
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="placa"
                      maxLength={8}
                      value={placa}
                      onChange={handlePlacaChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                    />
                    <button
                      onClick={handleBuscarPlaca}
                      disabled={buscandoOrdenes}
                      className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center"
                    >
                      {buscandoOrdenes ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Search size={18} className="mr-1" />
                          Buscar
                        </>
                      )}
                    </button>
                  </div>
                  {errorBusqueda && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorBusqueda}</p>}
                </div>
                <div className="relative">
                  <label htmlFor="mecanico" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mecánico
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="mecanico"
                      value={mecanico}
                      onChange={handleMecanicoChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => setMecanicoModalOpen(true)}
                      className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {filteredMecanicos.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredMecanicos.map((m, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setMecanico(m)
                            setFilteredMecanicos([])
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label htmlFor="cliente" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cliente
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="cliente"
                      readOnly
                      value={datos.cliente}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="garantia" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Garantía
                  </label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        id="garantia"
                        min="1"
                        value={garantiaTiempo}
                        onChange={(e) => setGarantiaTiempo(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Tiempo"
                      />
                    </div>
                    <select
                      value={garantiaUnidad}
                      onChange={(e) => setGarantiaUnidad(e.target.value)}
                      className="px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="dias">Días</option>
                      <option value="semanas">Semanas</option>
                      <option value="meses">Meses</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="cedula" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cédula
                  </label>
                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      id="cedula"
                      maxLength={12}
                      readOnly
                      value={datos.cedula}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>
                <div
                  className={`col-span-2 sm:col-span-1 p-4 rounded-lg cursor-pointer transition-all duration-200 ${trabajoRealizado
                    ? "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  onClick={() => setTrabajoModalOpen(true)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <Tool size={20} className="mr-2" />
                      Trabajo Realizado
                    </span>
                    <Plus size={20} className="text-blue-500" />
                  </div>
                  {trabajoRealizado && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{trabajoRealizado}</p>
                  )}
                </div>
                <div
                  className={`col-span-2 sm:col-span-1 p-4 rounded-lg cursor-pointer transition-all duration-200 ${nota
                    ? "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  onClick={() => setNotaModalOpen(true)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FileText size={20} className="mr-2" />
                      Nota
                    </span>
                    <Plus size={20} className="text-blue-500" />
                  </div>
                  {nota && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{nota}</p>}
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-8 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-lg font-semibold"
              >
                Guardar
              </button>
            </div>
          </div>

          {/* Panel lateral de resultados */}
          <div className="lg:w-1/3">
            {resultadosOrdenes.length > 0 && (
              <ResultadosLateral resultados={resultadosOrdenes} onVerDetalle={handleVerDetalleOrden} />
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {(isTrabajoModalOpen || isNotaModalOpen || isMecanicoModalOpen || isClienteModalOpen || isVehiculoModalOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          {isTrabajoModalOpen && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Agregar Trabajo Realizado</h3>
                <button
                  onClick={() => setTrabajoModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              <textarea
                value={trabajoRealizado}
                onChange={(e) => setTrabajoRealizado(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 h-40 resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe el trabajo realizado..."
              ></textarea>
              <button
                onClick={() => setTrabajoModalOpen(false)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Guardar
              </button>
            </div>
          )}

          {isNotaModalOpen && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Agregar Nota</h3>
                <button
                  onClick={() => setNotaModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 h-40 resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Escribe una nota..."
              ></textarea>
              <button
                onClick={() => setNotaModalOpen(false)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Guardar
              </button>
            </div>
          )}

          {isMecanicoModalOpen && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Registrar Mecánico</h3>
                <button
                  onClick={() => setMecanicoModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nombre del nuevo mecánico"
              />
              <button
                onClick={() => setMecanicoModalOpen(false)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Guardar
              </button>
            </div>
          )}

          {/* Usar los componentes modales */}
          {isClienteModalOpen && (
            <ClienteModal
              isOpen={isClienteModalOpen}
              onClose={() => setClienteModalOpen(false)}
              onSave={handleSaveCliente}
            />
          )}

          {isVehiculoModalOpen && (
            <VehiculoModal
              isOpen={isVehiculoModalOpen}
              onClose={() => setVehiculoModalOpen(false)}
              onSave={handleSaveVehiculo}
            />
          )}
        </div>
      )}

      {/* Modal de detalle de orden */}
      {ordenSeleccionada && (
        <DetalleOrdenModal
          orden={ordenSeleccionada}
          isOpen={isDetalleModalOpen}
          onClose={() => setDetalleModalOpen(false)}
        />
      )}
    </div>
  )
}

