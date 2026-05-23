import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

// ── Toast store (module-level so any component can trigger it) ──────────────
let _addToast = null
export const toast = {
  success: (msg) => _addToast?.({ type: 'success', msg }),
  error:   (msg) => _addToast?.({ type: 'error',   msg }),
  warning: (msg) => _addToast?.({ type: 'warning', msg }),
  info:    (msg) => _addToast?.({ type: 'info',    msg }),
}

// ── Individual Toast item ────────────────────────────────────────────────────
function ToastItem({ id, type, msg, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 3500)
    return () => clearTimeout(t)
  }, [id, onRemove])

  const icons = {
    success: <CheckCircle size={18} />,
    error:   <XCircle    size={18} />,
    warning: <AlertCircle size={18} />,
    info:    <Info        size={18} />,
  }

  return (
    <div className={`toast-item toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-msg">{msg}</span>
      <button className="toast-close" onClick={() => onRemove(id)}>
        <X size={14} />
      </button>
    </div>
  )
}

// ── Toast container — mount once in App root ─────────────────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type, msg }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, msg }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Register the adder so toast.success() etc. work from anywhere
  useEffect(() => {
    _addToast = addToast
    return () => { _addToast = null }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onRemove={removeToast} />
      ))}
    </div>
  )
}
