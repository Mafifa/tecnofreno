"use client"

import { X } from "lucide-react"
import { useState } from "react"

interface MecanicoModalProps {
  onClose: () => void
}

export default function MecanicoModal({ onClose }: MecanicoModalProps) {
  const [nombreMecanico, setNombreMecanico] = useState("")

  const handleSave = () => {
    // Aquí iría la lógica para guardar el mecánico
    console.log("Mecánico guardado:", nombreMecanico)
    onClose()
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Registrar Mecánico</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>
      <input
        type="text"
        value={nombreMecanico}
        onChange={(e) => setNombreMecanico(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Nombre del nuevo mecánico"
      />
      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
      >
        Guardar
      </button>
    </div>
  )
}

