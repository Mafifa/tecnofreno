"use client"

import { useState, useEffect } from "react"
import { Car, X, Search, User, CreditCard } from "lucide-react"
import { useAddVehiculo } from "./hooks/vehiculos/addVehiculo"
import { useSearchClient } from "./hooks/clientes/getCliente"
import type { tipo } from "src/types/types"

interface VehiculoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehiculo: Vehiculo) => void
}

export default function VehiculoModal ({ isOpen, onClose, onSave }: VehiculoModalProps) {
  const [cedulaBusqueda, setCedulaBusqueda] = useState("")
  const [cedulaPrefix, setCedulaPrefix] = useState("V")
  const [modelo, setModelo] = useState("")
  const [placa, setPlaca] = useState("")
  const [anio, setAnio] = useState("")
  const [tipo, setTipo] = useState<tipo>("Sedan")
  const [loading, setLoading] = useState(false)
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null)
  const { addVehiculo, error: vehiculoError, isLoading: loadingVehiculo } = useAddVehiculo()
  const [cedulaCompleta, setCedulaCompleta] = useState("")
  const { searchByCedula } = useSearchClient(cedulaCompleta)

  const handleBuscarCliente = async () => {
    if (!cedulaBusqueda.trim()) return

    // Concatenate the prefix, hyphen, and cédula number
    const nuevaCedulaCompleta = `${cedulaPrefix}-${cedulaBusqueda}`
    setCedulaCompleta(nuevaCedulaCompleta)
  }

  useEffect(() => {
    const buscarCliente = async () => {
      if (!cedulaCompleta) return

      try {
        setLoading(searchByCedula.isFetching)
        if (searchByCedula.data) {
          setClienteEncontrado(searchByCedula.data)
        }
      } catch (error) {
        console.error("Error buscando cliente:", error)
      }
    }

    buscarCliente()
  }, [cedulaCompleta, searchByCedula])

  const handleSave = async () => {
    if (!clienteEncontrado?.id) return

    try {
      const nuevoVehiculo = await addVehiculo.mutateAsync({
        modelo,
        placa,
        anio: Number.parseInt(anio),
        tipo,
        clienteId: clienteEncontrado.id,
      })

      onSave(nuevoVehiculo)
      handleClose()
    } catch (error) {
      console.error("Error guardando vehículo:", error)
      console.error(vehiculoError)
    }
  }

  const handleClose = () => {
    setCedulaBusqueda("")
    setCedulaPrefix("V") // Reset to default prefix
    setCedulaCompleta("")
    setClienteEncontrado(null)
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
        <label htmlFor="cedulaBusqueda" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Buscar Cliente por Cédula
        </label>
        <div className="flex mb-3">
          <select
            value={cedulaPrefix}
            onChange={(e) => setCedulaPrefix(e.target.value)}
            className="pl-2 pr-2 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="V">V</option>
            <option value="J">J</option>
            <option value="E">E</option>
          </select>
          <div className="flex items-center px-2 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            -
          </div>
          <div className="relative flex-1">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="cedulaBusqueda"
              value={cedulaBusqueda}
              onChange={(e) => setCedulaBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ingrese número de cédula"
            />
          </div>
          <button
            onClick={handleBuscarCliente}
            disabled={loading}
            className="ml-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>

        <div className="relative mb-2">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={clienteEncontrado?.nombre || ""}
            readOnly
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300"
            placeholder="Nombre del cliente"
          />
        </div>
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
              onChange={(e) => setModelo(e.target.value)}
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
            <option value="">Seleccionar tipo</option>
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

