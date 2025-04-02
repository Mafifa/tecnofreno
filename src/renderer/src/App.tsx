import React, { useState } from 'react'
import { Toaster } from 'sonner'
import Principal from './components/principal/Principal';
import Busqueda from './components/busqueda/Busqueda';
import Historial from './components/historial/Historial';
import Analisis from './components/analisis/Analisis';
import Configuracion from './components/Settings/settings';
import { Home, Package, BarChart2, Settings, History } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const modoOscuro = false

  const tabs = [
    { id: 'dashboard', name: 'Principal', icon: Home },
    { id: 'busqueda', name: 'Busqueda', icon: Package },
    { id: 'historial', name: 'Historial', icon: History },
    { id: 'analisis', name: 'Análisis', icon: BarChart2 }
  ]


  return (
    <div className={`flex flex-col h-screen ${modoOscuro ? 'dark' : ''}`}>
      <div className={`flex-1 ${modoOscuro ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Toaster position="top-center" closeButton duration={2500} richColors />
        <nav className={`${modoOscuro ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className={`text-2xl font-bold ${modoOscuro ? 'text-blue-400' : 'text-blue-600'} tracking-tight`}>TECNOFRENO 1.0.3</h1>
              </div>
              <div className="flex items-center space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${activeTab === tab.id
                      ? modoOscuro
                        ? 'bg-blue-900 text-blue-200'
                        : 'bg-blue-50 text-blue-700 shadow-sm'
                      : modoOscuro
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <tab.icon className="mr-2 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className={`ml-2 p-2 rounded-full ${modoOscuro
                    ? 'bg-blue-700 text-white hover:bg-blue-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out`}
                  aria-label="Configuración"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className={`flex-1 overflow-y-auto px-6 sm:p-8 ${modoOscuro ? 'text-white' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Principal />}
            {activeTab === 'analisis' && <Analisis />}
            {activeTab === 'busqueda' && <Busqueda />}
            {activeTab === 'historial' && <Historial />}
          </div>
        </main>
        {isSettingsOpen && (
          <Configuracion
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

      </div>
    </div>
  );
};

export default App;