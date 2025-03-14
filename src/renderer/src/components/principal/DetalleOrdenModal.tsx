import type React from "react"

import { useState, useEffect } from "react"
import {
  X,
  Calendar,
  Car,
  User,
  PenToolIcon as Tool,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface OrdenTrabajo {
  id: number
  fecha: string
  trabajo_realizado: string
  notas?: string
}

interface Cliente {
  nombre: string
  cedula_rif: string
  telefono: string
}

interface Vehiculo {
  modelo: string
  placa: string
  anio: string | number
  tipo: string
}

interface Mecanico {
  nombre: string
}

interface Garantia {
  tiempo: number
  unidad: string
}

interface DetalleOrdenModalProps {
  orden: OrdenTrabajo
  isOpen: boolean
  onClose: () => void
}

export default function DetalleOrdenModal ({ orden, isOpen, onClose }: DetalleOrdenModalProps) {
  const [detalleCompleto, setDetalleCompleto] = useState<{
    orden: OrdenTrabajo
    cliente: Cliente
    vehiculo: Vehiculo
    mecanico: Mecanico
    garantia?: Garantia
  } | null>(null)

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarDetalle = async () => {
      setCargando(true)
      setError(null)

      try {
        const detalle = await obtenerDetalleOrden(orden.id)
        setDetalleCompleto(detalle)
      } catch (err) {
        setError("Error al cargar los detalles. Intente nuevamente.")
        console.error(err)
      } finally {
        setCargando(false)
      }
    }

    if (isOpen && orden) {
      cargarDetalle()
    }
  }, [isOpen, orden])

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Función para calcular el estado de la garantía
  const calcularEstadoGarantia = () => {
    if (!detalleCompleto?.garantia) return null

    const fechaServicio = new Date(detalleCompleto.orden.fecha)
    const garantia = detalleCompleto.garantia

    // Calcular fecha de vencimiento
    const fechaVencimiento = new Date(fechaServicio)
    if (garantia.unidad === "días") {
      fechaVencimiento.setDate(fechaVencimiento.getDate() + garantia.tiempo)
    } else if (garantia.unidad === "semanas") {
      fechaVencimiento.setDate(fechaVencimiento.getDate() + garantia.tiempo * 7)
    } else if (garantia.unidad === "meses") {
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + garantia.tiempo)
    }

    const hoy = new Date()
    const vigente = fechaVencimiento > hoy

    // Calcular tiempo restante en formato más amigable
    const formatearTiempoRestante = () => {
      if (!vigente) return ""

      const milisegundosRestantes = fechaVencimiento.getTime() - hoy.getTime()
      const diasTotales = Math.ceil(milisegundosRestantes / (1000 * 60 * 60 * 24))

      // Calcular años, meses y días
      const años = Math.floor(diasTotales / 365)
      const meses = Math.floor((diasTotales % 365) / 30)
      const dias = Math.floor(diasTotales % 30)

      // Construir el string de tiempo restante mostrando solo las unidades necesarias
      const partes = []

      if (años > 0) {
        partes.push(`${años} ${años === 1 ? "año" : "años"}`)
      }

      if (meses > 0) {
        partes.push(`${meses} ${meses === 1 ? "mes" : "meses"}`)
      }

      if (dias > 0 || (años === 0 && meses === 0)) {
        partes.push(`${dias} ${dias === 1 ? "día" : "días"}`)
      }

      return partes.join(" y ")
    }

    return {
      vigente,
      fechaVencimiento,
      tiempoRestanteFormateado: formatearTiempoRestante(),
      diasRestantes: vigente ? Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)) : 0,
    }
  }

  const estadoGarantia = detalleCompleto?.garantia ? calcularEstadoGarantia() : null

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-5xl transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Detalle de Orden #{orden.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">{error}</div>
        ) : detalleCompleto ? (
          <div className="space-y-6">
            {/* Encabezado con información principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {/* Fecha */}
              <div>
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar size={18} className="mr-2" />
                  <span className="font-medium">Fecha de Servicio:</span>
                </div>
                <p className="text-gray-800 dark:text-white ml-7">{formatearFecha(detalleCompleto.orden.fecha)}</p>
              </div>

              {/* Mecánico */}
              <div>
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                  <Tool size={18} className="mr-2" />
                  <span className="font-medium">Mecánico:</span>
                </div>
                <p className="text-gray-800 dark:text-white ml-7">{detalleCompleto.mecanico.nombre}</p>
              </div>

              {/* Garantía */}
              <div>
                {detalleCompleto.garantia ? (
                  <>
                    <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                      <Clock size={18} className="mr-2" />
                      <span className="font-medium">Garantía:</span>
                    </div>
                    <div className="ml-7 flex items-center">
                      <span className="text-gray-800 dark:text-white mr-2">
                        {detalleCompleto.garantia.tiempo} {detalleCompleto.garantia.unidad}
                      </span>
                      {estadoGarantia?.vigente ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm">Vigente ({estadoGarantia.tiempoRestanteFormateado} restantes)</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <XCircle size={16} className="mr-1" />
                          <span className="text-sm">
                            Expirada el {estadoGarantia?.fechaVencimiento.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                      <AlertCircle size={18} className="mr-2" />
                      <span className="font-medium">Garantía:</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 ml-7 italic">Sin garantía</p>
                  </>
                )}
              </div>
            </div>

            {/* Información del cliente y vehículo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cliente */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                  <User size={18} className="mr-2" />
                  <span className="font-medium text-lg">Información del Cliente</span>
                </div>
                <div className="ml-7 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 col-span-1">Nombre:</span>
                    <span className="text-gray-800 dark:text-white font-medium col-span-2">
                      {detalleCompleto.cliente.nombre}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 col-span-1">Cédula/RIF:</span>
                    <span className="text-gray-800 dark:text-white font-medium col-span-2">
                      {detalleCompleto.cliente.cedula_rif}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 col-span-1">Teléfono:</span>
                    <span className="text-gray-800 dark:text-white font-medium col-span-2">
                      {detalleCompleto.cliente.telefono}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehículo */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                  <Car size={18} className="mr-2" />
                  <span className="font-medium text-lg">Información del Vehículo</span>
                </div>
                <div className="ml-7 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 col-span-1">Modelo:</span>
                    <span className="text-gray-800 dark:text-white font-medium col-span-2">
                      {detalleCompleto.vehiculo.modelo}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 col-span-1">Placa:</span>
                    <span className="text-gray-800 dark:text-white font-medium col-span-2">
                      {detalleCompleto.vehiculo.placa}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 col-span-1">Año:</span>
                    <span className="text-gray-800 dark:text-white font-medium col-span-2">
                      {detalleCompleto.vehiculo.anio}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-600 dark:text-gray-400 col-span-1">Tipo:</span>
                    <span className="text-gray-800 dark:text-white font-medium col-span-2">
                      {detalleCompleto.vehiculo.tipo}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trabajo realizado y notas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trabajo Realizado */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                  <Tool size={18} className="mr-2" />
                  <span className="font-medium text-lg">Trabajo Realizado</span>
                </div>
                <p className="text-gray-800 dark:text-white ml-7 whitespace-pre-line">
                  {detalleCompleto.orden.trabajo_realizado}
                </p>
              </div>

              {/* Notas (si existen) */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
                  <FileText size={18} className="mr-2" />
                  <span className="font-medium text-lg">Notas</span>
                </div>
                {detalleCompleto.orden.notas ? (
                  <p className="text-gray-800 dark:text-white ml-7 whitespace-pre-line">
                    {detalleCompleto.orden.notas}
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 ml-7 italic">No hay notas adicionales</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No se encontraron detalles para esta orden.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

