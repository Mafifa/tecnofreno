import { Calendar, Wrench, Clock } from "lucide-react"
import { Car } from "lucide-react"

interface OrdenTrabajo {
  id: number
  fecha: string
  trabajo_realizado: string
}

interface ResultadosLateralProps {
  resultados: OrdenTrabajo[]
  onVerDetalle: (orden: OrdenTrabajo) => void
}

export default function ResultadosLateral ({ resultados, onVerDetalle }: ResultadosLateralProps) {
  // Función para formatear la fecha
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Función para truncar texto largo
  const truncarTexto = (texto: string, longitud = 50) => {
    return texto.length > longitud ? texto.substring(0, longitud) + "..." : texto
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg sticky top-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Wrench className="mr-2" size={20} />
        Historial de Servicios
      </h3>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {resultados.length > 0 ? (
          <ul className="space-y-3">
            {resultados.map((orden) => (
              <li
                key={orden.id}
                onClick={() => onVerDetalle(orden)}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
              >
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatearFecha(orden.fecha)}</span>
                  <Clock size={14} className="ml-3 mr-1" />
                  <span>
                    {new Date(orden.fecha).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="font-medium text-gray-800 dark:text-white">Orden #{orden.id}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {truncarTexto(orden.trabajo_realizado, 100)}
                </p>
                <div className="mt-2 text-right">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Ver detalles
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <Car className="mx-auto text-gray-400 dark:text-gray-600 mb-3" size={40} />
            <p className="text-gray-500 dark:text-gray-400">
              Busque una placa para ver el historial de servicios del vehículo
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Los resultados aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  )
}

