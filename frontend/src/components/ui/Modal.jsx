import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ isOpen, onClose, children, ariaLabel, className = '', ...props }) {
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement

    const panel = panelRef.current
    if (panel) {
      const focusable = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const target = focusable.length > 0 ? focusable[0] : panel
      target.focus()
    }

    document.body.style.overflow = 'hidden'

    return () => {
      const prev = previousFocusRef.current
      if (prev && prev !== document.body && prev.focus) {
        prev.focus()
      }
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className={`fixed inset-0 bg-overlay/40 flex items-center justify-center p-4 z-50 animate-fade-in ${className}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      {...props}
    >
      <div
        ref={panelRef}
        className="bg-surface border border-border rounded-dialog shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
