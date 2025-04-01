import type { State, Action } from './types'

// Reducer
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.modalName]:
            action.value !== undefined ? action.value : !state.modals[action.modalName]
        }
      }
    case 'UPDATE_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value
        }
      }
    case 'UPDATE_GARANTIA':
      return {
        ...state,
        form: {
          ...state.form,
          garantia: {
            ...state.form.garantia,
            [action.field]: action.value
          }
        }
      }
    case 'SET_DATOS':
      return {
        ...state,
        form: {
          ...state.form,
          datos: {
            ...state.form.datos,
            ...action.datos
          }
        }
      }
    case 'SET_FILTERED_MECANICOS':
      return {
        ...state,
        filteredMecanicos: action.mecanicos
      }
    case 'SELECT_MECANICO':
      return {
        ...state,
        form: {
          ...state.form,
          mecanico: action.mecanico.nombre,
          mecanicoId: action.mecanico.id
        },
        filteredMecanicos: [] // Limpiar resultados al seleccionar
      }
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          resultados: action.resultados
        }
      }
    case 'SET_SEARCH_STATUS':
      return {
        ...state,
        search: {
          ...state.search,
          buscando: action.buscando
        }
      }
    case 'SET_SEARCHING_MECANICOS':
      return {
        ...state,
        search: {
          ...state.search,
          buscandoMecanicos: action.buscando
        }
      }
    case 'SET_GUARDANDO_GARANTIA':
      return {
        ...state,
        search: {
          ...state.search,
          guardandoGarantia: action.guardando
        }
      }
    case 'SET_GUARDANDO_ORDEN':
      return {
        ...state,
        search: {
          ...state.search,
          guardandoOrden: action.guardando
        }
      }
    case 'SET_GARANTIA_ID':
      return {
        ...state,
        form: {
          ...state.form,
          garantia: {
            ...state.form.garantia,
            id: action.id
          }
        }
      }
    case 'SET_SEARCH_ERROR':
      return {
        ...state,
        search: {
          ...state.search,
          error: action.error
        }
      }
    case 'SELECT_ORDEN':
      return {
        ...state,
        ordenSeleccionada: action.orden
      }
    case 'ADD_MECANICO': {
      // Agregar a la lista de nombres para compatibilidad
      const nombreExistente = state.mecanicos.includes(action.mecanico.nombre)
      return {
        ...state,
        mecanicos: nombreExistente ? state.mecanicos : [...state.mecanicos, action.mecanico.nombre]
      }
    }
    case 'SAVE_ORDEN':
      // Aquí solo marcamos que se ha guardado, la lógica real estaría en el action creator
      console.log('Orden guardada:', state.form)
      return state
    case 'RESET_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          mecanico: '',
          mecanicoId: undefined,
          trabajoRealizado: '',
          nota: '',
          placa: '',
          datos: {},
          garantia: {
            tiempo: '',
            unidad: 'dias',
            id: undefined
          }
        }
      }
    default:
      return state
  }
}

// Estado inicial
export const initialState: State = {
  modals: {
    trabajo: false,
    nota: false,
    mecanico: false,
    cliente: false,
    vehiculo: false,
    detalle: false
  },
  form: {
    fecha: new Date().toISOString().split('T')[0],
    mecanico: '',
    trabajoRealizado: '',
    nota: '',
    placa: '',
    datos: {},
    garantia: {
      tiempo: '',
      unidad: 'dias'
    }
  },
  mecanicos: [],
  filteredMecanicos: [],
  search: {
    resultados: [],
    buscando: false,
    error: null,
    buscandoMecanicos: false,
    guardandoGarantia: false,
    guardandoOrden: false
  },
  ordenSeleccionada: null
}
