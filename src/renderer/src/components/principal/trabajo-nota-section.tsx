"use client"

import { PenToolIcon as Tool, FileText, Plus } from "lucide-react"

interface TrabajoNotaSectionProps {
  trabajoRealizado: string
  nota: string
  onTrabajoClick: () => void
  onNotaClick: () => void
}

export default function TrabajoNotaSection({
  trabajoRealizado,
  nota,
  onTrabajoClick,
  onNotaClick,
}: TrabajoNotaSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <div
        className={`col-span-2 sm:col-span-1 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
          trabajoRealizado
            ? "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        onClick={onTrabajoClick}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Tool size={20} className="mr-2" />
            Trabajo Realizado
          </span>
          <Plus size={20} className="text-blue-500" />
        </div>
        {trabajoRealizado && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{trabajoRealizado}</p>
        )}
      </div>
      <div
        className={`col-span-2 sm:col-span-1 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
          nota
            ? "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        onClick={onNotaClick}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <FileText size={20} className="mr-2" />
            Nota
          </span>
          <Plus size={20} className="text-blue-500" />
        </div>
        {nota && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{nota}</p>}
      </div>
    </div>
  )
}

