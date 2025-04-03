import { useState } from "react"
import BusquedaPlaca from "./BusquedaPlaca"
import BusquedaMecanico from "./BusquedaMecanico"
import DetalleOrdenModal from "./DetalleOrdenModal"

export default function Busqueda () {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenTrabajo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleVerDetalle = (orden: OrdenTrabajo) => {
    setOrdenSeleccionada(orden)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setOrdenSeleccionada(null)
  }

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-200 -my-4">
      <div className="bg-white dark:bg-gray-800 px-8 py-4 rounded-xl shadow-lg max-w-6xl mx-auto transition-colors duration-200">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Búsqueda de Servicios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BusquedaPlaca onVerDetalle={handleVerDetalle} />
          <BusquedaMecanico onVerDetalle={handleVerDetalle} />
        </div>
      </div>

      {/* Modal de detalle */}
      {isModalOpen && ordenSeleccionada && (
        <DetalleOrdenModal orden={ordenSeleccionada} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  )
}

