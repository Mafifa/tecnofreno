import { X } from "lucide-react"
import { useState } from "react"

interface MecanicoModalProps {
  onClose: () => void
  onSave: (nombre: string) => void
}

export default function MecanicoModal ({ onClose, onSave }: MecanicoModalProps) {
  const [nombreMecanico, setNombreMecanico] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!nombreMecanico.trim()) {
      setError("El nombre del mecánico es requerido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      onSave(nombreMecanico)
      // El cierre del modal se maneja en la acción
    } catch (err) {
      setError("Error al guardar el mecánico")
      console.error("Error al guardar mecánico:", err)
    } finally {
      setIsLoading(false)
    }
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

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <input
        type="text"
        value={nombreMecanico}
        onChange={(e) => setNombreMecanico(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Nombre del nuevo mecánico"
      />
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>Guardando...</span>
          </div>
        ) : (
          "Guardar"
        )}
      </button>
    </div>
  )
}

