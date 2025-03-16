"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Film, Sparkles, Layers, Wand2, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface VideoGenerationStatusProps {
  progress: number
  currentStep: string
  sceneId: number | null
}

export default function VideoGenerationStatus({ progress, currentStep, sceneId }: VideoGenerationStatusProps) {
  const [progressText, setProgressText] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)

  // Generate random progress text messages for more engaging feedback
  useEffect(() => {
    const messages = [
      "Analyzing scene composition...",
      "Generating visual elements...",
      "Applying cinematic effects...",
      "Optimizing for platform...",
      "Rendering transitions...",
      "Enhancing visual quality...",
      "Synchronizing elements...",
      "Finalizing output...",
    ]

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length)
      setProgressText(messages[randomIndex])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const steps = [
    {
      name: "Analyzing scenes",
      icon: <Layers className="h-4 w-4" />,
      description: "Breaking down your video concept into visual components",
    },
    {
      name: "Generating visuals",
      icon: <Sparkles className="h-4 w-4" />,
      description: "Creating the visual elements for each scene",
    },
    {
      name: "Adding transitions",
      icon: <Wand2 className="h-4 w-4" />,
      description: "Applying smooth transitions between scenes",
    },
    {
      name: "Rendering final video",
      icon: <Upload className="h-4 w-4" />,
      description: "Compiling everything into your final video",
    },
  ]

  return (
    <Card className="bg-white border-yellow-400/30 shadow-xl shadow-blue-900/10 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-blue-50 border-b border-yellow-200/50">
        <CardTitle className="flex items-center text-gray-900">
          <Film className="h-5 w-5 text-yellow-600 mr-2" />
          <span>
            {sceneId ? `Generating Scene ${sceneId} Video` : "Generating Your Video"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Animated progress indicator */}
        <div className="mb-8 relative">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-900">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-3 bg-gray-100"
            indicatorClassName="bg-gradient-to-r from-yellow-400 to-blue-600"
          />

          {/* Animated progress glow */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-blue-600 opacity-30 blur-md"
            initial={{ left: "0%" }}
            animate={{ left: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Current operation text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={progressText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="mt-2 text-xs text-gray-600 italic"
            >
              {progressText}
            </motion.div>
          </AnimatePresence>

          {/* Elapsed time */}
          <div className="mt-1 text-xs text-gray-500">Elapsed time: {formatTime(elapsedTime)}</div>

          {/* Note about video generation */}
          {progress > 50 && progress < 95 && (
            <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md border border-yellow-200">
              Note: Video generation can take 1-2 minutes. Each scene is limited to 5 seconds maximum.
            </div>
          )}
        </div>

        {/* Animated video preview placeholder */}
        <div className="mb-8 relative overflow-hidden rounded-lg aspect-video bg-gray-100 border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-blue-50"></div>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
            ))}
          </div>

          {/* Center loading spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-yellow-200 border-t-yellow-500 border-r-blue-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Status text */}
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <div className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-700">
              {currentStep}
            </div>
          </div>
        </div>

        {/* Steps progress */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepProgress = Math.min(100, Math.max(0, progress - index * 25) * 4)
            const isActive = progress >= index * 25
            const isCompleted = progress >= (index + 1) * 25

            return (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-gradient-to-r from-yellow-400 to-blue-600 text-white"
                      : isActive
                        ? "bg-gray-100 border border-gray-300"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    <span className="text-gray-600">{step.icon}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                      {step.name}
                    </div>
                    {isActive && !isCompleted && (
                      <div className="text-xs text-blue-600">{Math.round(stepProgress)}%</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                  {isActive && !isCompleted && (
                    <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-blue-600"
                        initial={{ width: "0%" }}
                        animate={{ width: `${stepProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>This may take a few minutes. Please don&apos;t close this window.</p>
          {sceneId && <p className="mt-1 text-blue-600">Generating video for Scene {sceneId} only.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
