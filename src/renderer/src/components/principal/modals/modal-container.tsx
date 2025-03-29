"use client"

import type React from "react"

interface ModalContainerProps {
  isOpen: boolean
  onOutsideClick: (e: React.MouseEvent<HTMLDivElement>) => void
  children: React.ReactNode
}

export default function ModalContainer({ isOpen, onOutsideClick, children }: ModalContainerProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onOutsideClick}
    >
      {children}
    </div>
  )
}

