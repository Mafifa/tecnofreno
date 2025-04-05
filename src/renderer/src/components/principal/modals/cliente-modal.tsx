import type React from "react"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (clienteData: Omit<Cliente, 'id'>) => void
}

export default function ClienteModal ({ isOpen, onClose, onSave }: ClienteModalProps) {
  const [nombre, setNombre] = useState("")
  const [prefijo, setPrefijo] = useState("0414")
  const [numeroTelefono, setNumeroTelefono] = useState("")
  const [telefonoCompleto, setTelefonoCompleto] = useState("")

  // Actualizar el teléfono completo cuando cambian sus partes
  useEffect(() => {
    setTelefonoCompleto(`${prefijo}-${numeroTelefono}`)
  }, [prefijo, numeroTelefono])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      nombre,
      telefono: telefonoCompleto,
    })
    // Limpiar el formulario
    setNombre("")
    setPrefijo("0414")
    setNumeroTelefono("")
  }

  const handleNumeroTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números
    const value = e.target.value.replace(/\D/g, "")
    setNumeroTelefono(value)
  }

  if (!isOpen) return null

  return (
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Agregar Cliente</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Nombre del cliente"
            required
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Teléfono
          </label>
          <div className="flex">
            <select
              value={prefijo}
              onChange={(e) => setPrefijo(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="0414">0414</option>
              <option value="0424">0424</option>
              <option value="0416">0416</option>
              <option value="0426">0426</option>
              <option value="0412">0412</option>
            </select>
            <div className="flex items-center justify-center px-2 border-t border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
              -
            </div>
            <input
              type="text"
              id="telefono"
              value={numeroTelefono}
              onChange={handleNumeroTelefonoChange}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="1234567"
              maxLength={7}
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Número completo: {telefonoCompleto}</p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}

