import { useState, useEffect } from "react"
import { Car, X, User } from "lucide-react"
import type { tipo } from "src/types/types"
import { useSearchClient } from "../hooks/clientes/getCliente"
import { toast } from "sonner"

interface VehiculoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehiculo: Omit<Vehiculo, 'id'>) => void
  loadingVehiculo: boolean
}

export default function VehiculoModal ({ isOpen, onClose, onSave, loadingVehiculo }: VehiculoModalProps) {
  const [nombreBusqueda, setNombreBusqueda] = useState("")
  const [modelo, setModelo] = useState("")
  const [placa, setPlaca] = useState("")
  const [anio, setAnio] = useState("")
  const [tipo, setTipo] = useState<tipo>("Sedan")
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null)
  const [clientesSugeridos, setClientesSugeridos] = useState<Cliente[]>([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const { data, search, loading: isLoading } = useSearchClient()

  useEffect(() => {
    if (data?.length) {
      setClientesSugeridos(data)
      setMostrarSugerencias(true)
    }
  }, [data])

  useEffect(() => {
    if (nombreBusqueda.length < 3) {
      setClientesSugeridos([])
      setMostrarSugerencias(false)
      return
    }

    const timer = setTimeout(() => {
      search(nombreBusqueda)
    }, 300)

    return () => clearTimeout(timer)
  }, [nombreBusqueda])

  const handleSelectCliente = (cliente: Cliente) => {
    setClienteEncontrado(cliente)
    setNombreBusqueda(cliente.nombre)
    setMostrarSugerencias(false)
  }

  const handleSave = async () => {
    if (!clienteEncontrado?.id) {
      toast.error('Error al encontrar cliente')
      return
    }

    const nuevoVehiculo = {
      modelo,
      placa,
      anio: anio,
      tipo,
      cliente_id: clienteEncontrado.id
    }
    onSave(nuevoVehiculo)
    handleClose()

  }

  const handleClose = () => {
    setNombreBusqueda("")
    setClienteEncontrado(null)
    setClientesSugeridos([])
    setMostrarSugerencias(false)
    setModelo("")
    setPlaca("")
    setAnio("")
    setTipo("Sedan")
    onClose()
  }

  if (!isOpen) return null
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Agregar Vehículo</h3>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="nombreBusqueda" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Buscar Cliente por Nombre
        </label>
        <div className="relative mb-3">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            id="nombreBusqueda"
            value={nombreBusqueda}
            onChange={(e) => setNombreBusqueda(e.target.value.toUpperCase())}
            onFocus={() => nombreBusqueda.length >= 3 && setMostrarSugerencias(true)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Ingrese nombre del cliente (mínimo 3 caracteres)"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Lista de sugerencias - Rediseñada para ser más compacta y vertical */}
          {mostrarSugerencias && clientesSugeridos.length > 0 && (
            <div className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
              {clientesSugeridos.map((cliente) => (
                <div
                  key={cliente.id}
                  onClick={() => handleSelectCliente(cliente)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                >
                  <div className="text-gray-900 dark:text-white font-medium">{cliente.nombre}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {clienteEncontrado && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 mt-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente seleccionado:</span>
              <button
                onClick={() => {
                  setClienteEncontrado(null)
                  setNombreBusqueda("")
                }}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Cambiar
              </button>
            </div>
            <div className="mt-1 text-gray-900 dark:text-white font-medium">{clienteEncontrado.nombre}</div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

      <div className={`space-y-4 ${!clienteEncontrado ? "opacity-60 pointer-events-none" : ""}`}>
        <div>
          <label htmlFor="modeloVehiculo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Modelo
          </label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="modeloVehiculo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Marca y modelo"
            />
          </div>
        </div>
        <div>
          <label htmlFor="placaVehiculo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Placa
          </label>
          <input
            type="text"
            id="placaVehiculo"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            disabled={!clienteEncontrado}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
            placeholder="Número de placa"
          />
        </div>
        <div>
          <label htmlFor="anioVehiculo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Año
          </label>
          <input
            type="number"
            id="anioVehiculo"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            disabled={!clienteEncontrado}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Año del vehículo"
          />
        </div>
        <div>
          <label htmlFor="tipoVehiculo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo
          </label>
          <select
            id="tipoVehiculo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as tipo)}
            disabled={!clienteEncontrado}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Camioneta">Camioneta</option>
            <option value="Sedan">Sedan</option>
            <option value="Autobus">Autobus</option>
            <option value="Camion">Camion</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!clienteEncontrado || loadingVehiculo}
        className="w-full mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {loadingVehiculo ? "Guardando..." : "Guardar Vehículo"}
      </button>
    </div>
  )
}

