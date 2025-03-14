import { useState } from "react"
import { User, CreditCard, Phone, X } from "lucide-react"
import { useCliente } from './hooks/clientes/addCliente'

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (cliente: Cliente) => void
}

export default function ClienteModal ({ isOpen, onClose, onSave }: ClienteModalProps) {
  const [nombre, setNombre] = useState("")
  const [cedula, setCedula] = useState("")
  const [telefono, setTelefono] = useState("")
  const [validationError, setValidationError] = useState<string>("")
  const { addCliente, error, isLoading } = useCliente()

  const validateInputs = () => {
    if (!nombre.trim() || !cedula.trim() || !telefono.trim()) {
      return "Todos los campos son obligatorios"
    }

    // Validación de formato de cédula (V/E/J-12345678)
    if (!/^[VEJ]-\d{5,8}$/i.test(cedula)) {
      return "Formato de cédula/RIF inválido (Ej: V-12345678)"
    }

    // Validación de formato de teléfono (0414-1234567)
    if (!/^\d{4}-\d{7}$/.test(telefono)) {
      return "Formato de teléfono inválido (Ej: 0414-1234567)"
    }

    return ""
  }

  const handleSave = async () => {
    const errorMessage = validateInputs()
    if (errorMessage) {
      setValidationError(errorMessage)
      return;
    }

    try {
      const result = await addCliente.mutateAsync({
        nombre,
        cedula_rif: cedula.toUpperCase(),
        telefono
      });

      onSave(result);
      handleClose();
    } catch (err) {
      console.error('Error saving client:', err);
      setValidationError(err.message);  // Show actual error message
    }
  };

  const handleClose = () => {
    setNombre("")
    setCedula("")
    setTelefono("")
    setValidationError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Agregar Cliente</h3>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={24} />
        </button>
      </div>

      {(validationError || error) && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {validationError || error}
        </div>
      )}

      <div className="space-y-4">
        {/* Campos del formulario actualizados */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Nombre completo"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Cédula/RIF
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="V-12345678"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0414-1234567"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </div>
    </div>
  )
}

