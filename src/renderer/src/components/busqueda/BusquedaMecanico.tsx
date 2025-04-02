import type React from "react"
import { useState, useEffect } from "react"
import { Search, Calendar, PenToolIcon as Tool, ChevronLeft, ChevronRight } from "lucide-react"

interface ResultadoPaginado {
  ordenes: OrdenTrabajo[]
  hayMas: boolean
}

interface BusquedaMecanicoProps {
  onVerDetalle: (orden: OrdenTrabajo) => void
}

const buscarMecanicos = async (query: string): Promise<Mecanico[]> => {
  const mecanicos = (await window.electron.ipcRenderer.invoke("mecanico:searchByName", query)) as Mecanico[]
  return mecanicos
}

// Modificamos la función para que acepte parámetros de paginación
const buscarOrdenesPorMecanico = async (
  idMecanico: number,
  pagina: number,
  limite: number,
): Promise<ResultadoPaginado> => {
  const resultado = (await window.electron.ipcRenderer.invoke(
    "orden:getByMecanicoId",
    idMecanico,
    pagina,
    limite,
  )) as ResultadoPaginado
  return resultado
}

export default function BusquedaMecanico ({ onVerDetalle }: BusquedaMecanicoProps) {
  const [nombreMecanico, setNombreMecanico] = useState("")
  const [resultados, setResultados] = useState<OrdenTrabajo[]>([])
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
  const [mecanicosFiltrados, setMecanicosFiltrados] = useState<Mecanico[]>([])
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState<Mecanico | null>(null)

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const [hayMasResultados, setHayMasResultados] = useState(false)
  const ITEMS_POR_PAGINA = 3 // Número de resultados por página

  // Cargar lista de mecánicos al montar el componente
  useEffect(() => {
    const cargarMecanicos = async () => {
      try {
        const listaMecanicos = await buscarMecanicos("")
        setMecanicos(listaMecanicos)
      } catch (err) {
        console.error("Error al cargar mecánicos:", err)
      }
    }

    cargarMecanicos()
  }, []) // Agregamos array de dependencias vacío para que solo se ejecute al montar

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setNombreMecanico(valor)

    if (valor.trim()) {
      const filtrados = mecanicos.filter((m) => m.nombre.toLowerCase().includes(valor.toLowerCase()))
      setMecanicosFiltrados(filtrados)
    } else {
      setMecanicosFiltrados([])
    }
  }

  const handleSeleccionarMecanico = (mecanico: Mecanico) => {
    setMecanicoSeleccionado(mecanico)
    setNombreMecanico(mecanico.nombre)
    setMecanicosFiltrados([])
  }

  const handleBuscar = async (pagina = 1) => {
    if (!mecanicoSeleccionado) {
      setError("Por favor seleccione un mecánico para buscar")
      return
    }

    setBuscando(true)
    setError(null)

    try {
      const resultado = await buscarOrdenesPorMecanico(mecanicoSeleccionado.id, pagina, ITEMS_POR_PAGINA)

      // Ordenamos las órdenes por fecha (más recientes primero)
      const ordenesOrdenadas = [...resultado.ordenes].sort((a, b) => {
        return convertirFechaATimestamp(b.fecha) - convertirFechaATimestamp(a.fecha)
      })

      setResultados(ordenesOrdenadas)
      setHayMasResultados(resultado.hayMas)
      setPaginaActual(pagina)

      if (ordenesOrdenadas.length === 0) {
        setError("No se encontraron resultados para este mecánico")
      }
    } catch (err) {
      setError("Error al buscar. Intente nuevamente.")
      console.error(err)
    } finally {
      setBuscando(false)
    }
  }

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

  // Funciones para la paginación
  const irAPaginaAnterior = () => {
    if (paginaActual > 1) {
      handleBuscar(paginaActual - 1)
    }
  }

  const irAPaginaSiguiente = () => {
    if (hayMasResultados) {
      handleBuscar(paginaActual + 1)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Tool className="mr-2" size={20} />
        Búsqueda por Mecánico
      </h3>

      <div className="relative mb-4">
        <div className="flex">
          <input
            type="text"
            value={nombreMecanico}
            onChange={handleInputChange}
            placeholder="Nombre del mecánico"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => handleBuscar(1)} // Reiniciar a la primera página al buscar
            disabled={buscando || !mecanicoSeleccionado}
            className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400"
          >
            {buscando ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>

        {/* Lista de sugerencias */}
        {mecanicosFiltrados.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {mecanicosFiltrados.map((mecanico) => (
              <li
                key={mecanico.id}
                onClick={() => handleSeleccionarMecanico(mecanico)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              >
                {mecanico.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4">{error}</div>
      )}

      {resultados.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Trabajos Realizados</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">Página {paginaActual}</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {resultados.map((orden) => (
                <li
                  key={orden.id}
                  className="py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors duration-150"
                  onClick={() => onVerDetalle(orden)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <Calendar size={14} className="mr-1" />
                        {formatearFecha(orden.fecha)}
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">Orden #{orden.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {truncarTexto(orden.trabajo_realizado)}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Ver
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={irAPaginaAnterior}
              disabled={paginaActual === 1 || buscando}
              className={`flex items-center text-sm font-medium rounded-lg px-3 py-1.5 ${paginaActual === 1 || buscando
                ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Anterior
            </button>

            <button
              onClick={irAPaginaSiguiente}
              disabled={!hayMasResultados || buscando}
              className={`flex items-center text-sm font-medium rounded-lg px-3 py-1.5 ${!hayMasResultados || buscando
                ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
            >
              Siguiente
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

