"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void
  title?: string;
  message: string | undefined | null;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-background w-full max-w-md p-5 rounded-xl shadow-lg">

        {/* Title */}
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-400">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-[#222] hover:bg-[#333]"
          >
            {cancelText}
          </button>

          <button
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className={`px-4 py-2 text-sm rounded text-white ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}