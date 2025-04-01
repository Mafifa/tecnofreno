import { useState } from 'react'
type SearchState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useSearchClient() {
  const [state, setState] = useState<SearchState<Cliente[]>>({
    data: null,
    loading: false,
    error: null
  })

  const search = async (term: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await window.electron.ipcRenderer.invoke('cliente:findByName', term)

      setState({
        data: Array.isArray(data) ? data : [data], // Normaliza la respuesta
        loading: false,
        error: null
      })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as Error
      })
    }
  }

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    search
  }
}
