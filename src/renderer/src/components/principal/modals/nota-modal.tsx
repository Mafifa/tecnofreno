import type React from "react"
import { X } from "lucide-react"

interface NotaModalProps {
  nota: string
  onNotaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClose: () => void
}

export default function NotaModal ({ nota, onNotaChange, onClose }: NotaModalProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Agregar Nota</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>
      <textarea
        value={nota}
        onChange={onNotaChange}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 h-40 resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Escribe una nota..."
      ></textarea>
      <button
        onClick={onClose}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
      >
        Guardar
      </button>
    </div>
  )
}

