// src/hooks/use-toast.ts

import { useState, useCallback } from "react"
import { toast } from "react-toastify"

export const useToast = () => {
  const [isToastVisible, setIsToastVisible] = useState(false)

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setIsToastVisible(true)

    switch (type) {
      case "success":
        toast.success(message)
        break
      case "error":
        toast.error(message)
        break
      case "info":
        toast.info(message)
        break
      default:
        toast(message)
        break
    }

    setIsToastVisible(false)
  }, [])

  return {
    showToast,
    isToastVisible
  }
}
