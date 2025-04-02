import type React from "react"
import { useReducer, useCallback, useState } from "react"
import ClienteModal from "./modals/cliente-modal"
import VehiculoModal from "./modals/vehiculo-modal"
import DetalleOrdenModal from "./modals/detalle-orden-modal"
import ResultadosLateral from "./resultados-lateral"
import { useSearchVehiculo } from "./hooks/vehiculos/getVehiculo"
import FormHeader from "./form-header"
import FormFields from "./form-fields"
import TrabajoNotaSection from "./trabajo-nota-section"
import ModalContainer from "./modals/modal-container"
import TrabajoModal from "./modals/trabajo-modal"
import NotaModal from "./modals/nota-modal"
import MecanicoModal from "./modals/mecanico-modal"

// Importar el estado y las acciones
import { reducer, initialState } from "./state/reducer"
import { actions } from "./state/actions"


export default function Principal () {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isBuscando, setIsBuscando] = useState(false)

  // Hooks
  const { searchByPlaca, isSearching } = useSearchVehiculo()

  // Handlers con action creators
  const handleMecanicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "UPDATE_FORM", field: "mecanico", value: e.target.value })
  }

  const handleSearchMecanicos = useCallback((query: string) => {
    actions.buscarMecanicos(query)(dispatch)
  }, [])

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "UPDATE_FORM", field: "placa", value: e.target.value.toUpperCase() })
  }

  // Usar action creators para lógica compleja
  const handleBuscarPlaca = useCallback(async () => {
    if (!state.form.placa || state.form.placa.trim() === "") {
      dispatch({
        type: "SET_SEARCH_ERROR",
        error: "Por favor ingrese una placa para buscar",
      })
      return
    }

    setIsBuscando(true)
    dispatch({ type: "SET_SEARCH_ERROR", error: null })

    try {
      await actions.buscarPorPlaca(state.form.placa)(dispatch)
    } catch (error) {
      console.error("Error al buscar por placa:", error)
      dispatch({
        type: "SET_SEARCH_ERROR",
        error: "Error al buscar el vehículo. Intente nuevamente.",
      })
    } finally {
      setIsBuscando(false)
    }
  }, [state.form.placa, searchByPlaca])

  const handleVerDetalleOrden = (orden: OrdenTrabajo) => {
    dispatch({ type: "SELECT_ORDEN", orden })
    dispatch({ type: "TOGGLE_MODAL", modalName: "detalle", value: true })
  }

  const handleSave = useCallback(async () => {
    await actions.guardarOrden()(dispatch, () => state)
  }, [state])

  const handleSaveCliente = useCallback(async (clienteData: Omit<Cliente, 'id'>) => {
    await actions.guardarCliente(clienteData)(dispatch)
  }, [])

  const handleSaveVehiculo = useCallback(async (vehiculoData: Omit<Vehiculo, 'id'>) => {
    await actions.guardarVehiculo(vehiculoData)(dispatch)
  }, [])

  const handleSaveMecanico = useCallback(async (nombre: string) => {
    await actions.guardarMecanico(nombre)(dispatch)
  }, [])

  const handleSelectMecanico = useCallback((mecanico: Mecanico) => {
    dispatch({ type: "SELECT_MECANICO", mecanico })
  }, [])

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // Cerrar todos los modales
      Object.keys(state.modals).forEach((modalName) => {
        dispatch({
          type: "TOGGLE_MODAL",
          modalName: modalName as keyof typeof state.modals,
          value: false,
        })
      })
    }
  }

  // Verificar si algún modal está abierto
  const isAnyModalOpen = Object.values(state.modals).some((isOpen) => isOpen)

  // Verificar si se está guardando (garantía u orden)
  const isGuardando = state.search.guardandoGarantia || state.search.guardandoOrden

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-200">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario principal */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-200">
              <FormHeader
                onClienteModalOpen={() => dispatch({ type: "TOGGLE_MODAL", modalName: "cliente", value: true })}
                onVehiculoModalOpen={() => dispatch({ type: "TOGGLE_MODAL", modalName: "vehiculo", value: true })}
                fecha={state.form.fecha}
                onFechaChange={(e) => dispatch({ type: "UPDATE_FORM", field: "fecha", value: e.target.value })}
              />

              <FormFields
                datos={state.form.datos}
                placa={state.form.placa}
                onPlacaChange={handlePlacaChange}
                onBuscarPlaca={handleBuscarPlaca}
                buscandoOrdenes={isBuscando || isSearching || state.search.buscando}
                errorBusqueda={state.search.error}
                mecanico={state.form.mecanico}
                onMecanicoChange={handleMecanicoChange}
                onMecanicoModalOpen={() => dispatch({ type: "TOGGLE_MODAL", modalName: "mecanico", value: true })}
                filteredMecanicos={state.filteredMecanicos}
                onSelectMecanico={handleSelectMecanico}
                garantiaTiempo={state.form.garantia.tiempo}
                onGarantiaTiempoChange={(e) =>
                  dispatch({ type: "UPDATE_GARANTIA", field: "tiempo", value: e.target.value })
                }
                garantiaUnidad={state.form.garantia.unidad}
                onGarantiaUnidadChange={(e) =>
                  dispatch({ type: "UPDATE_GARANTIA", field: "unidad", value: e.target.value })
                }
                onSearchMecanicos={handleSearchMecanicos}
                buscandoMecanicos={state.search.buscandoMecanicos}
              />

              <TrabajoNotaSection
                trabajoRealizado={state.form.trabajoRealizado}
                nota={state.form.nota}
                onTrabajoClick={() => dispatch({ type: "TOGGLE_MODAL", modalName: "trabajo", value: true })}
                onNotaClick={() => dispatch({ type: "TOGGLE_MODAL", modalName: "nota", value: true })}
              />

              <button
                onClick={handleSave}
                disabled={isGuardando}
                className="mt-8 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-lg font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isGuardando ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>{state.search.guardandoGarantia ? "Registrando garantía..." : "Guardando orden..."}</span>
                  </div>
                ) : (
                  "Guardar"
                )}
              </button>

              {/* Información de depuración (opcional, puedes quitar esto en producción) */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs">
                  <details>
                    <summary className="cursor-pointer font-medium">Datos para depuración</summary>
                    <pre className="mt-2 overflow-auto max-h-40">
                      {JSON.stringify(
                        {
                          fecha: state.form.fecha,
                          mecanico: state.form.mecanico,
                          mecanicoId: state.form.mecanicoId,
                          vehiculoId: state.form.datos.vehiculoId,
                          clienteId: state.form.datos.clienteId,
                          garantia: state.form.garantia,
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>

          {/* Panel lateral de resultados */}
          <div className="lg:w-1/3">
            {state.search.resultados.length > 0 && (
              <ResultadosLateral resultados={state.search.resultados} onVerDetalle={handleVerDetalleOrden} />
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalContainer isOpen={isAnyModalOpen} onOutsideClick={handleOutsideClick}>
        {state.modals.trabajo && (
          <TrabajoModal
            trabajo={state.form.trabajoRealizado}
            onTrabajoChange={(e) => dispatch({ type: "UPDATE_FORM", field: "trabajoRealizado", value: e.target.value })}
            onClose={() => dispatch({ type: "TOGGLE_MODAL", modalName: "trabajo", value: false })}
          />
        )}

        {state.modals.nota && (
          <NotaModal
            nota={state.form.nota}
            onNotaChange={(e) => dispatch({ type: "UPDATE_FORM", field: "nota", value: e.target.value })}
            onClose={() => dispatch({ type: "TOGGLE_MODAL", modalName: "nota", value: false })}
          />
        )}

        {state.modals.mecanico && (
          <MecanicoModal
            onClose={() => dispatch({ type: "TOGGLE_MODAL", modalName: "mecanico", value: false })}
            onSave={handleSaveMecanico}
          />
        )}

        {state.modals.cliente && (
          <ClienteModal
            isOpen={state.modals.cliente}
            onClose={() => dispatch({ type: "TOGGLE_MODAL", modalName: "cliente", value: false })}
            onSave={handleSaveCliente}
          />
        )}

        {state.modals.vehiculo && (
          <VehiculoModal
            isOpen={state.modals.vehiculo}
            onClose={() => dispatch({ type: "TOGGLE_MODAL", modalName: "vehiculo", value: false })}
            onSave={handleSaveVehiculo}
          />
        )}
      </ModalContainer>

      {/* Modal de detalle de orden */}
      {state.ordenSeleccionada && (
        <DetalleOrdenModal
          orden={state.ordenSeleccionada}
          isOpen={state.modals.detalle}
          onClose={() => dispatch({ type: "TOGGLE_MODAL", modalName: "detalle", value: false })}
        />
      )}
    </div>
  )
}

