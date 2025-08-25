import React, { createContext, useContext } from 'react'
import toast from 'react-hot-toast'

// Create context
const ToastContext = createContext()

// Provider component
export const ToastProvider = ({ children }) => {
  const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    warning: (message) => toast(message, { icon: '⚠️' }),
    info: (message) => toast(message, { icon: 'ℹ️' }),
    loading: (message) => toast.loading(message),
    dismiss: (toastId) => toast.dismiss(toastId)
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
    </ToastContext.Provider>
  )
}

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastProvider
