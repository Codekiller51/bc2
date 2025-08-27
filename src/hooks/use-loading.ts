import { useState, useCallback } from 'react'

interface LoadingState {
  isLoading: boolean
  message: string
  progress?: number
}

export function useGlobalLoading() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: 'Loading...',
    progress: undefined
  })

  const startGlobalLoading = useCallback((message: string = 'Loading...', progress?: number) => {
    setLoadingState({
      isLoading: true,
      message,
      progress
    })
  }, [])

  const stopGlobalLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false
    }))
  }, [])

  const updateGlobalMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }))
  }, [])

  const updateGlobalProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress
    }))
  }, [])

  return {
    isLoading: loadingState.isLoading,
    message: loadingState.message,
    progress: loadingState.progress,
    startGlobalLoading,
    stopGlobalLoading,
    updateGlobalMessage,
    updateGlobalProgress
  }
}