"use client"

import type React from "react"

import { useState } from "react"
import ClienteModal from "./modals/cliente-modal"
import VehiculoModal from "./modals/vehiculo-modal"
import DetalleOrdenModal from "./modals/detalle-orden-modal"
import ResultadosLateral from "./resultados-lateral"
import { useSearchVehiculo } from "./hooks/vehiculos/getVehiculo"
import FormHeader from "./form-header"
import FormFields from "./form-fields"
import TrabajoNotaSection from "./trabajo-nota-section"
import ModalContainer from "./modals/modal-container"
import TrabajoModal from "./modals/trabajo-modal"
import NotaModal from "./modals/nota-modal"
import MecanicoModal from "./modals/mecanico-modal"

interface OrdenTrabajo {
  id: number
  fecha: string
  trabajo_realizado: string
  notas?: string
}

// Dummy function, replace with actual implementation
const buscarOrdenesPorPlaca = async (placa: string): Promise<OrdenTrabajo[]> => {
  return []
}

export default function Principal () {
  // Modal states
  const [isTrabajoModalOpen, setTrabajoModalOpen] = useState(false)
  const [isNotaModalOpen, setNotaModalOpen] = useState(false)
  const [isMecanicoModalOpen, setMecanicoModalOpen] = useState(false)
  const [isClienteModalOpen, setClienteModalOpen] = useState(false)
  const [isVehiculoModalOpen, setVehiculoModalOpen] = useState(false)
  const [isDetalleModalOpen, setDetalleModalOpen] = useState(false)

  // Form data states
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [mecanico, setMecanico] = useState("")
  const [mecanicos, setMecanicos] = useState(["Juan", "Pedro", "Luis", "Carlos"])
  const [filteredMecanicos, setFilteredMecanicos] = useState<string[]>([])
  const [trabajoRealizado, setTrabajoRealizado] = useState("")
  const [nota, setNota] = useState("")
  const [placa, setPlaca] = useState("")
  const [datos, setDatos] = useState<any>({})
  const [garantiaTiempo, setGarantiaTiempo] = useState("")
  const [garantiaUnidad, setGarantiaUnidad] = useState("dias")

  // Search states
  const [resultadosOrdenes, setResultadosOrdenes] = useState<OrdenTrabajo[]>([])
  const [buscandoOrdenes, setBuscandoOrdenes] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null)
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenTrabajo | null>(null)

  // Hooks
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
        setErrorBusqueda(null)

        const cliente = await window.electron.ipcRenderer.invoke("cliente:getById", vehiculo.data.cliente_id)

        setDatos({
          vehiculo: vehiculo.data.modelo,
          cliente: cliente.nombre,
          cedula: cliente.cedula_rif,
        })
      } else {
        setErrorBusqueda("No se encontró un vehículo con esta placa")
      }
    } catch (error) {
      const err = error as Error
      console.log(err.message)
      setErrorBusqueda("Error al buscar el vehículo. Intente nuevamente.")
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
      setErrorBusqueda("Error al buscar órdenes. Intente nuevamente.")
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

  const handleSaveCliente = (clienteData: { nombre: string; cedula: string; telefono: string }) => {
    console.log("Cliente guardado:", clienteData)
    setClienteModalOpen(false)
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-200">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario principal */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-200">
              <FormHeader
                onClienteModalOpen={() => setClienteModalOpen(true)}
                onVehiculoModalOpen={() => setVehiculoModalOpen(true)}
                fecha={fecha}
                onFechaChange={(e) => setFecha(e.target.value)}
              />

              <FormFields
                datos={datos}
                placa={placa}
                onPlacaChange={handlePlacaChange}
                onBuscarPlaca={handleBuscarPlaca}
                buscandoOrdenes={buscandoOrdenes}
                errorBusqueda={errorBusqueda}
                mecanico={mecanico}
                onMecanicoChange={handleMecanicoChange}
                onMecanicoModalOpen={() => setMecanicoModalOpen(true)}
                filteredMecanicos={filteredMecanicos}
                onSelectMecanico={(m) => {
                  setMecanico(m)
                  setFilteredMecanicos([])
                }}
                garantiaTiempo={garantiaTiempo}
                onGarantiaTiempoChange={(e) => setGarantiaTiempo(e.target.value)}
                garantiaUnidad={garantiaUnidad}
                onGarantiaUnidadChange={(e) => setGarantiaUnidad(e.target.value)}
              />

              <TrabajoNotaSection
                trabajoRealizado={trabajoRealizado}
                nota={nota}
                onTrabajoClick={() => setTrabajoModalOpen(true)}
                onNotaClick={() => setNotaModalOpen(true)}
              />

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
      <ModalContainer
        isOpen={
          isTrabajoModalOpen || isNotaModalOpen || isMecanicoModalOpen || isClienteModalOpen || isVehiculoModalOpen
        }
        onOutsideClick={handleOutsideClick}
      >
        {isTrabajoModalOpen && (
          <TrabajoModal
            trabajo={trabajoRealizado}
            onTrabajoChange={(e) => setTrabajoRealizado(e.target.value)}
            onClose={() => setTrabajoModalOpen(false)}
          />
        )}

        {isNotaModalOpen && (
          <NotaModal
            nota={nota}
            onNotaChange={(e) => setNota(e.target.value)}
            onClose={() => setNotaModalOpen(false)}
          />
        )}

        {isMecanicoModalOpen && <MecanicoModal onClose={() => setMecanicoModalOpen(false)} />}

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
      </ModalContainer>

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

