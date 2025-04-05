import type { Dispatch } from 'react'
import type { Action, State } from './types'
import { toast } from 'sonner'

// Dummy function, replace with actual implementation
const buscarOrdenesPorPlaca = async (placa: string) => {
  const ordenes = await window.electron.ipcRenderer.invoke('orden:getByPlaca', placa)
  return ordenes.ordenes
}

// Action creators
export const actions = {
  // Búsqueda de mecánicos por nombre
  buscarMecanicos: (query: string) => async (dispatch: Dispatch<Action>) => {
    if (!query.trim() || query.length < 2) {
      dispatch({ type: 'SET_FILTERED_MECANICOS', mecanicos: [] })
      return
    }

    dispatch({ type: 'SET_SEARCHING_MECANICOS', buscando: true })

    try {
      // Aquí realizas la petición a tu API/base de datos
      // Ejemplo con Electron IPC (ajusta según tu implementación)
      const mecanicos = await window.electron.ipcRenderer.invoke('mecanico:searchByName', query)

      dispatch({ type: 'SET_FILTERED_MECANICOS', mecanicos: mecanicos || [] })
    } catch (error) {
      console.error('Error al buscar mecánicos:', error)
      dispatch({ type: 'SET_FILTERED_MECANICOS', mecanicos: [] })
    } finally {
      dispatch({ type: 'SET_SEARCHING_MECANICOS', buscando: false })
    }
  },

  // Búsqueda de vehículo y órdenes por placa
  buscarPorPlaca: (placa: string) => async (dispatch: Dispatch<Action>) => {
    if (!placa.trim()) {
      dispatch({ type: 'SET_SEARCH_ERROR', error: 'Por favor ingrese una placa para buscar' })
      return
    }
    try {
      const vehiculo = (await window.electron.ipcRenderer.invoke(
        'vehiculo:getByPlaca',
        placa
      )) as Vehiculo
      console.log('Se ha conseguido el vehiculo', vehiculo)

      if (vehiculo) {
        dispatch({ type: 'SET_SEARCH_ERROR', error: null })
        console.log('ha entrado al if')

        const cliente = (await window.electron.ipcRenderer.invoke(
          'cliente:getById',
          vehiculo.cliente_id
        )) as Cliente

        dispatch({
          type: 'SET_DATOS',
          datos: {
            vehiculo: vehiculo.modelo,
            cliente: cliente.nombre,
            vehiculoId: vehiculo.id, // Guardar ID del vehículo
            clienteId: cliente.id // Guardar ID del cliente
          }
        })
      } else {
        dispatch({ type: 'SET_SEARCH_ERROR', error: 'No se encontró un vehículo con esta placa' })
      }
    } catch (error) {
      const err = error as Error
      console.log(err.message)
      dispatch({
        type: 'SET_SEARCH_ERROR',
        error: 'Error al buscar el vehículo. Intente nuevamente.'
      })
    }

    dispatch({ type: 'SET_SEARCH_STATUS', buscando: true })
    dispatch({ type: 'SET_SEARCH_ERROR', error: null })

    try {
      const ordenes = await buscarOrdenesPorPlaca(placa)
      dispatch({ type: 'SET_SEARCH_RESULTS', resultados: ordenes })

      if (ordenes.length === 0) {
        dispatch({ type: 'SET_SEARCH_ERROR', error: 'No se encontraron órdenes para esta placa' })
      }
    } catch (err) {
      dispatch({ type: 'SET_SEARCH_ERROR', error: 'Error al buscar órdenes. Intente nuevamente.' })
      console.error(err)
      toast.error('Un error a ocurrido')
    } finally {
      dispatch({ type: 'SET_SEARCH_STATUS', buscando: false })
    }
  },

  // Guardar cliente
  guardarCliente:
    (cliente: Omit<Cliente, 'id'>) => async (dispatch: Dispatch<Action>, getState: () => State) => {
      // Verificar si ya está en proceso de guardado
      const state = getState()
      if (state.search.guardandoCliente) {
        console.log('Ya se está guardando un cliente, operación ignorada')
        return
      }

      // Establecer flag de guardado
      dispatch({ type: 'SET_GUARDANDO_CLIENTE', guardando: true })

      try {
        // Validar datos antes de enviar
        if (!cliente.nombre || !cliente.telefono) {
          toast.error('Faltan datos del cliente')
          return
        }

        const result = await window.electron.ipcRenderer.invoke('cliente:create', cliente)

        console.log('Cliente guardado:', result)

        // Cerrar el modal después de guardar
        dispatch({ type: 'TOGGLE_MODAL', modalName: 'cliente', value: false })

        toast.success('Cliente guardado con éxito')
      } catch (error) {
        console.error('Error al guardar cliente:', error)
        toast.error('Error al guardar cliente')
      } finally {
        // Restablecer el flag
        dispatch({ type: 'SET_GUARDANDO_CLIENTE', guardando: false })
      }
    },

  // Guardar vehículo
  guardarVehiculo:
    (vehiculo: Omit<Vehiculo, 'id'>) =>
    async (dispatch: Dispatch<Action>, getState: () => State) => {
      // Verificar si ya está en proceso de guardado
      const state = getState()
      if (state.search.guardandoVehiculo) {
        console.log('Ya se está guardando un vehículo, operación ignorada')
        return
      }

      // Establecer flag de guardado
      dispatch({ type: 'SET_GUARDANDO_VEHICULO', guardando: true })

      try {
        // Aquí iría la lógica para guardar el vehículo en la base de datos
        const result = await window.electron.ipcRenderer.invoke('vehiculo:create', vehiculo)

        // Verificar si la operación fue exitosa

        if (result.error === 'DUPLICATE_PLATE') {
          toast.error(`Ya existe un vehículo con la placa ${vehiculo.placa}`)
          return
        }
        if (result.error === 'CREATION_ERROR') {
          toast.error(`Error al crear vehiculo`)
          return
        }

        console.log('Vehículo guardado:', result.data)

        // Cerrar el modal después de guardar
        dispatch({ type: 'TOGGLE_MODAL', modalName: 'vehiculo', value: false })

        // Mostrar mensaje de éxito
        toast.success('Vehículo guardado con éxito')
      } catch (error) {
        console.error('Error al guardar vehículo:', error)
        toast.error('Error al guardar vehículo')
      } finally {
        // Siempre restablecer el flag de guardado
        dispatch({ type: 'SET_GUARDANDO_VEHICULO', guardando: false })
      }
    },

  // Guardar mecánico
  guardarMecanico:
    (nombre: string) => async (dispatch: Dispatch<Action>, getState: () => State) => {
      // Verificar si ya está en proceso de guardado
      const state = getState()
      if (state.search.guardandoMecanico) {
        console.log('Ya se está guardando un mecánico, operación ignorada')
        return
      }

      try {
        if (!nombre.trim()) {
          return
        }

        // Establecer flag de guardado
        dispatch({ type: 'SET_GUARDANDO_MECANICO', guardando: true })

        // Aquí iría la lógica para guardar el mecánico en la base de datos
        const nuevoMecanico = await window.electron.ipcRenderer.invoke('mecanico:create', nombre)

        // Agregar el mecánico a la lista local
        dispatch({ type: 'ADD_MECANICO', mecanico: nuevoMecanico })

        // Cerrar el modal
        dispatch({ type: 'TOGGLE_MODAL', modalName: 'mecanico', value: false })
        toast.success('Mecanico guardado')

        // Seleccionar el mecánico recién agregado
        dispatch({ type: 'SELECT_MECANICO', mecanico: nuevoMecanico })
      } catch (error) {
        console.error('Error al guardar mecánico:', error)
        toast.error('Error al guardar mecánico')
      } finally {
        dispatch({ type: 'SET_GUARDANDO_MECANICO', guardando: false })
      }
    },

  // Registrar garantía
  registrarGarantia:
    (garantia: Omit<Garantia, 'id'>) =>
    async (dispatch: Dispatch<Action>, getState: () => State) => {
      // Verificar si ya está en proceso de guardado
      const state = getState()
      if (state.search.guardandoGarantia) {
        console.log('Ya se está guardando una garantía, operación ignorada')
        return null
      }

      dispatch({ type: 'SET_GUARDANDO_GARANTIA', guardando: true })
      dispatch({ type: 'SET_SEARCH_ERROR', error: null })

      try {
        // Validar datos de garantía
        if (!garantia.tiempo || garantia.tiempo <= 0) {
          dispatch({ type: 'SET_SEARCH_ERROR', error: 'El tiempo de garantía debe ser mayor a 0' })
          return null
        }

        // Aquí iría la lógica para guardar la garantía en la base de datos
        const nuevaGarantia = await window.electron.ipcRenderer.invoke('garantia:create', garantia)

        // Guardar el ID de la garantía en el estado
        dispatch({ type: 'SET_GARANTIA_ID', id: nuevaGarantia.id })

        console.log('Garantía registrada:', nuevaGarantia)
        return nuevaGarantia.id
      } catch (error) {
        console.error('Error al registrar garantía:', error)
        dispatch({ type: 'SET_SEARCH_ERROR', error: 'Error al registrar la garantía' })
        return null
      } finally {
        dispatch({ type: 'SET_GUARDANDO_GARANTIA', guardando: false })
      }
    },

  // Guardar orden de trabajo
  guardarOrden: () => async (dispatch: Dispatch<Action>, getState: () => State) => {
    // Verificar si ya está en proceso de guardado
    const state = getState()
    if (state.search.guardandoOrden) {
      console.log('Ya se está guardando una orden, operación ignorada')
      return
    }

    dispatch({ type: 'SET_GUARDANDO_ORDEN', guardando: true })
    dispatch({ type: 'SET_SEARCH_ERROR', error: null })

    try {
      const { form } = state

      // Validaciones básicas
      if (!form.mecanicoId) {
        dispatch({ type: 'SET_SEARCH_ERROR', error: 'Debe seleccionar un mecánico' })
        return
      }

      if (!form.placa) {
        dispatch({ type: 'SET_SEARCH_ERROR', error: 'Debe ingresar una placa' })
        return
      }

      if (!form.trabajoRealizado) {
        dispatch({ type: 'SET_SEARCH_ERROR', error: 'Debe ingresar el trabajo realizado' })
        return
      }

      if (!form.datos.vehiculoId) {
        dispatch({
          type: 'SET_SEARCH_ERROR',
          error: 'No se ha encontrado el vehículo. Busque por placa primero.'
        })
        return
      }

      if (!form.datos.clienteId) {
        dispatch({
          type: 'SET_SEARCH_ERROR',
          error: 'No se ha encontrado el cliente. Busque por placa primero.'
        })
        return
      }

      // Registrar garantía primero si se ha especificado un tiempo
      let garantiaId = null
      if (form.garantia.tiempo && Number.parseInt(form.garantia.tiempo) > 0) {
        garantiaId = await actions.registrarGarantia({
          tiempo: Number.parseInt(form.garantia.tiempo),
          unidad: form.garantia.unidad as 'dias' | 'semanas' | 'meses'
        })(dispatch, getState)
      }

      const date = new Date()
      const formatearFecha = (fechaISO: Date) => {
        const fecha = new Date(fechaISO)
        return fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }

      const ordenData: Omit<OrdenTrabajo, 'id'> = {
        fecha: formatearFecha(date),
        vehiculo_id: form.datos.vehiculoId,
        mecanico_id: form.mecanicoId,
        cliente_id: form.datos.clienteId,
        trabajo_realizado: form.trabajoRealizado,
        notas: form.nota || undefined,
        garantia_id: garantiaId
      }

      // Aquí iría la lógica para guardar la orden en la base de datos
      const nuevaOrden = await window.electron.ipcRenderer.invoke('orden:create', ordenData)

      console.log('Orden guardada:', nuevaOrden)

      // Marcar como guardado en el estado
      dispatch({ type: 'SAVE_ORDEN' })

      // Resetear el formulario
      dispatch({ type: 'RESET_FORM' })

      toast.success('Orden guardada con éxito')
    } catch (error) {
      console.error('Error al guardar orden:', error)
      toast.error('Ha ocurrido un error')
      dispatch({
        type: 'SET_SEARCH_ERROR',
        error: 'Error al guardar la orden. Intente nuevamente.'
      })
    } finally {
      dispatch({ type: 'SET_GUARDANDO_ORDEN', guardando: false })
    }
  }
}
