import type React from "react"
import { Calendar, UserPlus, CarFront } from "lucide-react"

interface FormHeaderProps {
  onClienteModalOpen: () => void
  onVehiculoModalOpen: () => void
  fecha: string
  onFechaChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormHeader ({ onClienteModalOpen, onVehiculoModalOpen, fecha, onFechaChange }: FormHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* Botones para agregar cliente y vehículo */}
      <div className="flex justify-end space-x-4 mb-6">
        <button
          onClick={onClienteModalOpen}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          <UserPlus size={18} className="mr-2" />
          Agregar Cliente
        </button>
        <button
          onClick={onVehiculoModalOpen}
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
            onChange={onFechaChange}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  )
}

