"use client"

import type React from "react"

import { Car, User, CreditCard, Clock, Search, Plus } from "lucide-react"

interface FormFieldsProps {
  datos: any
  placa: string
  onPlacaChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBuscarPlaca: () => void
  buscandoOrdenes: boolean
  errorBusqueda: string | null
  mecanico: string
  onMecanicoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMecanicoModalOpen: () => void
  filteredMecanicos: string[]
  onSelectMecanico: (mecanico: string) => void
  garantiaTiempo: string
  onGarantiaTiempoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  garantiaUnidad: string
  onGarantiaUnidadChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function FormFields({
  datos,
  placa,
  onPlacaChange,
  onBuscarPlaca,
  buscandoOrdenes,
  errorBusqueda,
  mecanico,
  onMecanicoChange,
  onMecanicoModalOpen,
  filteredMecanicos,
  onSelectMecanico,
  garantiaTiempo,
  onGarantiaTiempoChange,
  garantiaUnidad,
  onGarantiaUnidadChange,
}: FormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2 sm:col-span-1">
        <label htmlFor="vehiculo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Vehículo
        </label>
        <div className="relative">
          <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            id="vehiculo"
            readOnly
            value={datos.vehiculo || ""}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-80"
          />
        </div>
      </div>
      <div>
        <label htmlFor="placa" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Placa
        </label>
        <div className="flex">
          <input
            type="text"
            id="placa"
            maxLength={8}
            value={placa}
            onChange={onPlacaChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
          />
          <button
            onClick={onBuscarPlaca}
            disabled={buscandoOrdenes}
            className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center"
          >
            {buscandoOrdenes ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Search size={18} className="mr-1" />
                Buscar
              </>
            )}
          </button>
        </div>
        {errorBusqueda && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorBusqueda}</p>}
      </div>
      <div className="relative">
        <label htmlFor="mecanico" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Mecánico
        </label>
        <div className="flex">
          <input
            type="text"
            id="mecanico"
            value={mecanico}
            onChange={onMecanicoChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={onMecanicoModalOpen}
            className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            <Plus size={20} />
          </button>
        </div>
        {filteredMecanicos.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredMecanicos.map((m, index) => (
              <li
                key={index}
                onClick={() => onSelectMecanico(m)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label htmlFor="cliente" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Cliente
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            id="cliente"
            readOnly
            value={datos.cliente || ""}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-80"
          />
        </div>
      </div>
      <div>
        <label htmlFor="garantia" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Garantía
        </label>
        <div className="flex">
          <div className="relative flex-1">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              id="garantia"
              min="1"
              value={garantiaTiempo}
              onChange={onGarantiaTiempoChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Tiempo"
            />
          </div>
          <select
            value={garantiaUnidad}
            onChange={onGarantiaUnidadChange}
            className="px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="dias">Días</option>
            <option value="semanas">Semanas</option>
            <option value="meses">Meses</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="cedula" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Cédula
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            id="cedula"
            maxLength={12}
            readOnly
            value={datos.cedula || ""}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-80"
          />
        </div>
      </div>
    </div>
  )
}

