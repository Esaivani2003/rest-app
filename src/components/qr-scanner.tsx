"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clipboard, ExternalLink, Loader2, RefreshCw, Scan } from "lucide-react"
import jsQR from "jsqr"

type ScannerState = "idle" | "requesting" | "scanning" | "error" | "success"

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scannerState, setScannerState] = useState<ScannerState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [scannedResult, setScannedResult] = useState<string>("")
  const animationRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  const isURL = (text: string) => {
    try {
      new URL(text)
      return true
    } catch {
      return false
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scannedResult)
      alert("Copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const startScanner = useCallback(async () => {
    try {
      setScannerState("requesting")
      setErrorMessage("")

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setScannerState("error")
        setErrorMessage("Camera access is not supported on this device.")
        return
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setScannerState("scanning")
        scanQRCode()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setScannerState("error")
      setErrorMessage(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera access and try again."
          : "Could not access the camera. Please make sure your device has a camera and try again.",
      )
    }
  }, [])

  const stopScanner = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setScannerState("idle")
  }, [])

  const resetScanner = () => {
    setScannedResult("")
    setScannerState("idle")
  }

  const scanQRCode = useCallback(() => {
    if (scannerState !== "scanning") return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code) {
        setScannedResult(code.data)
        setScannerState("success")
        stopScanner()
        return
      }
    }

    animationRef.current = requestAnimationFrame(scanQRCode)
  }, [scannerState, stopScanner])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          QR Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          {scannerState === "scanning" && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500 animate-scan"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-green-500 rounded-lg"></div>
              </div>
            </div>
          )}

          {scannerState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Scan className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center px-4">Click the button below to start scanning a QR code</p>
            </div>
          )}

          {scannerState === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Loader2 className="h-12 w-12 text-gray-400 mb-4 animate-spin" />
              <p className="text-gray-500 text-center px-4">Requesting camera access...</p>
            </div>
          )}

          {scannerState === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </div>
          )}

          {scannerState === "success" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg w-full max-w-xs break-words">
                <p className="font-medium mb-2">Scanned Result:</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{scannedResult}</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${scannerState !== "scanning" ? "hidden" : ""}`}
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {(scannerState === "idle" || scannerState === "error") && (
          <Button onClick={startScanner} className="w-full">
            <Scan className="mr-2 h-4 w-4" />
            Start Scanning
          </Button>
        )}

        {scannerState === "scanning" && (
          <Button onClick={stopScanner} variant="outline" className="w-full">
            Stop Scanning
          </Button>
        )}

        {scannerState === "success" && (
          <>
            <Button onClick={resetScanner} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan Again
            </Button>

            <Button onClick={copyToClipboard} variant="secondary" className="flex-1">
              <Clipboard className="mr-2 h-4 w-4" />
              Copy
            </Button>

            {isURL(scannedResult) && (
              <Button asChild className="flex-1">
                <a href={scannedResult} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open URL
                </a>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
