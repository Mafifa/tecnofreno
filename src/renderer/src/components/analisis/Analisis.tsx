import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Wrench, BarChart2, User, PenToolIcon as Tool, TrendingUp } from "lucide-react"
import { obtenerDatosAnalisis } from "./servicios-analisis"

export default function Analisis () {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [datos, setDatos] = useState<any>(null)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<"semana" | "mes" | "año">("mes")
  const [tipoGraficoSeleccionado, setTipoGraficoSeleccionado] = useState<"ordenes" | "vehiculos">("ordenes")

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true)
      setError(null)
      try {
        const resultado = await obtenerDatosAnalisis(periodoSeleccionado)
        setDatos(resultado)
      } catch (err) {
        console.error("Error al cargar datos de análisis:", err)
        setError("Ocurrió un error al cargar los datos de análisis. Intente nuevamente.")
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [periodoSeleccionado])

  // Colores para los gráficos
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

  // Formatear fecha
  const formatoFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    )
  }

  if (!datos) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">No hay datos disponibles para mostrar.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Panel de Análisis</h1>

        {/* Selector de período */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <Calendar className="mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Período de Análisis</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPeriodoSeleccionado("semana")}
              className={`px-4 py-2 rounded-lg ${periodoSeleccionado === "semana"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              Última Semana
            </button>
            <button
              onClick={() => setPeriodoSeleccionado("mes")}
              className={`px-4 py-2 rounded-lg ${periodoSeleccionado === "mes"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              Último Mes
            </button>
            <button
              onClick={() => setPeriodoSeleccionado("año")}
              className={`px-4 py-2 rounded-lg ${periodoSeleccionado === "año"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              Último Año
            </button>
          </div>
        </div>

        {/* Tarjetas de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
                <Wrench className="text-blue-500 dark:text-blue-300" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total de Órdenes</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{datos.kpis.totalOrdenes}</h3>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">En el período seleccionado</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-4">
                <TrendingUp className="text-green-500 dark:text-green-300" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Promedio Diario</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{datos.kpis.promedioDiario}</h3>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Órdenes por día</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mr-4">
                <User className="text-purple-500 dark:text-purple-300" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mecánico Destacado</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {datos.kpis.mecanicoDestacado.nombre}
                </h3>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {datos.kpis.mecanicoDestacado.ordenes} órdenes completadas
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-4">
                <Tool className="text-yellow-500 dark:text-yellow-300" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Garantias activas</p>
                <h3
                  className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-[180px]"
                  title={datos.kpis.trabajoMasFrecuente.trabajo}
                >
                  {datos.kpis.trabajoMasFrecuente.trabajo}
                </h3>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {datos.kpis.trabajoMasFrecuente.cantidad} veces realizado
            </div>
          </div>
        </div>

        {/* Selector de tipo de gráfico */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tipo de Análisis</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTipoGraficoSeleccionado("ordenes")}
              className={`px-4 py-2 rounded-lg ${tipoGraficoSeleccionado === "ordenes"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              Órdenes de Trabajo
            </button>
            <button
              onClick={() => setTipoGraficoSeleccionado("vehiculos")}
              className={`px-4 py-2 rounded-lg ${tipoGraficoSeleccionado === "vehiculos"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              Vehículos
            </button>
          </div>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico principal */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {tipoGraficoSeleccionado === "ordenes" && "Órdenes de Trabajo por Tiempo"}
              {tipoGraficoSeleccionado === "vehiculos" && "Distribución por Tipo de Vehículo"}
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGraficoSeleccionado === "ordenes" && (
                  <LineChart data={datos.ordenesporTiempo} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" tickFormatter={formatoFecha} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => [value, "Órdenes"]}
                      labelFormatter={(label) => formatoFecha(label)}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="cantidad" name="Órdenes" stroke="#0088FE" activeDot={{ r: 8 }} />
                  </LineChart>
                )}

                {tipoGraficoSeleccionado === "vehiculos" && (
                  <PieChart>
                    <Pie
                      data={datos.distribucionVehiculos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="cantidad"
                      nameKey="tipo"
                      label={({ tipo, percent }) => `${tipo}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {datos.distribucionVehiculos.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any, props: any) => [value, props.payload.tipo]} />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico secundario */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {tipoGraficoSeleccionado === "ordenes" && "Órdenes por Mecánico"}
              {tipoGraficoSeleccionado === "vehiculos" && "Distribución por Año de Fabricación"}
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGraficoSeleccionado === "ordenes" && (
                  <BarChart data={datos.ordenesPorMecanico} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ordenes" name="Órdenes Completadas" fill="#0088FE" />
                  </BarChart>
                )}

                {tipoGraficoSeleccionado === "vehiculos" && (
                  <BarChart data={datos.distribucionAnios} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="anio" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cantidad" name="Cantidad de Vehículos" fill="#FF8042" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabla de datos destacados */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {tipoGraficoSeleccionado === "ordenes" && "Clientes Frecuentes"}
            {tipoGraficoSeleccionado === "vehiculos" && "Vehículos con más Servicios"}
          </h3>

          <div className="overflow-x-auto">
            {tipoGraficoSeleccionado === "ordenes" && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datos.clientesFrecuentes}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip formatter={(value: any) => [`${value} órdenes`, "Total de Órdenes"]} />
                    <Legend />
                    <Bar dataKey="ordenes" name="Total de Órdenes" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {tipoGraficoSeleccionado === "vehiculos" && (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Placa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Servicios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Año
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {datos.vehiculosConMasServicios.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.modelo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.placa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.servicios}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.anio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

