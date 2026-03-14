'use client'

import React from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
  message: string | undefined | null
  confirmText?: string
  cancelText?: string
  confirmButtonClass?: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'brand-button-dark text-sm',
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-md">
      <div className="brand-panel w-full max-w-md rounded-[1.5rem] border border-primary/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
        <h2 className="font-serif text-2xl font-bold text-secondary">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="brand-button-light text-sm">
            {cancelText}
          </button>

          <button
            onClick={() => {
              onConfirm?.()
              onClose?.()
            }}
            className={confirmButtonClass}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
