import { useState, useEffect } from "react"
import { Calendar, Wrench } from "lucide-react"
import { Car } from "lucide-react"

interface ResultadosLateralProps {
  resultados: OrdenTrabajo[]
  onVerDetalle: (orden: OrdenTrabajo) => void
}

export default function ResultadosLateral ({ resultados, onVerDetalle }: ResultadosLateralProps) {
  const [ordenesOrdenadas, setOrdenesOrdenadas] = useState<OrdenTrabajo[]>([])

  // Ordenar resultados por ID (de mayor a menor)
  useEffect(() => {
    if (resultados.length > 0) {
      const ordenadas = [...resultados].sort((a, b) => {
        return b.id - a.id // Orden descendente por ID
      })
      setOrdenesOrdenadas(ordenadas)
    } else {
      setOrdenesOrdenadas([])
    }
  }, [resultados])

  // Función para convertir fecha en formato DD/MM/YYYY, HH:MM a timestamp
  const convertirFechaATimestamp = (fechaStr: string): number => {
    if (/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}$/.test(fechaStr)) {
      // Formato DD/MM/YYYY, HH:MM
      const [datePart, timePart] = fechaStr.split(", ")
      const [day, month, year] = datePart.split("/").map(Number)
      const [hours, minutes] = timePart.split(":").map(Number)
      return new Date(year, month - 1, day, hours, minutes).getTime()
    } else {
      // Intentar parsear como fecha ISO
      return new Date(fechaStr).getTime()
    }
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaISO: string | Date | undefined) => {
    // Si es un objeto Date, convertirlo directamente
    if (fechaISO instanceof Date) {
      return fechaISO.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: fechaISO.getHours() !== 0 || fechaISO.getMinutes() !== 0 ? "2-digit" : undefined,
        minute: fechaISO.getHours() !== 0 || fechaISO.getMinutes() !== 0 ? "2-digit" : undefined,
        hour12: false,
      })
    }

    // Si la fecha ya está en formato DD/MM/YYYY, HH:MM, devolverla tal cual
    if (typeof fechaISO === "string" && /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}$/.test(fechaISO)) {
      return fechaISO
    }

    // Si no, formatear desde ISO
    const fecha = new Date(fechaISO as string)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: fecha.getHours() !== 0 || fecha.getMinutes() !== 0 ? "2-digit" : undefined,
      minute: fecha.getHours() !== 0 || fecha.getMinutes() !== 0 ? "2-digit" : undefined,
      hour12: false,
    })
  }

  // Función para truncar texto largo
  const truncarTexto = (texto: string, longitud = 50) => {
    return texto.length > longitud ? texto.substring(0, longitud) + "..." : texto
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <Wrench className="mr-2" size={20} />
          Historial de Servicios
        </h3>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {ordenesOrdenadas.length > 0 ? (
          <>
            <ul className="space-y-3">
              {ordenesOrdenadas.map((orden) => (
                <li
                  key={orden.id}
                  onClick={() => onVerDetalle(orden)}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                >
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatearFecha(orden.fecha)}</span>
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
          </>
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

