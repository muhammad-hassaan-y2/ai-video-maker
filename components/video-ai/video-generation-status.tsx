"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Film } from "lucide-react"
import { motion } from "framer-motion"

interface VideoGenerationStatusProps {
  progress: number
  currentStep: string
}

export default function VideoGenerationStatus({ progress, currentStep }: VideoGenerationStatusProps) {
  const steps = ["Analyzing scenes", "Generating visuals", "Adding transitions", "Rendering final video"]

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
        <CardTitle className="flex items-center">
          <Film className="h-5 w-5 text-pink-400 mr-2" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
            Generating Your Video
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/80">Progress</span>
            <span className="text-sm font-medium text-white">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-white/10"
            indicatorClassName="bg-gradient-to-r from-pink-500 to-violet-500"
          />
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepProgress = Math.min(100, Math.max(0, progress - index * 25) * 4)
            const isActive = progress >= index * 25
            const isCompleted = progress >= (index + 1) * 25

            return (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-gradient-to-r from-pink-500 to-violet-500"
                      : isActive
                        ? "bg-white/20 border border-white/40"
                        : "bg-white/10 border border-white/20"
                  }`}
                >
                  {isCompleted && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isActive ? "text-white" : "text-white/50"}`}>{step}</div>
                  {isActive && !isCompleted && (
                    <div className="w-full bg-white/10 h-1 mt-1 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
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

        <div className="mt-6 text-center text-white/70 text-sm">
          <p>This may take a few minutes. Please don't close this window.</p>
        </div>
      </CardContent>
    </Card>
  )
}

