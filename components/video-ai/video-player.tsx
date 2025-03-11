"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Download,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Save,
  ArrowLeft,
  History,
  Trash2,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

interface VideoPlayerProps {
  videoUrl: string
  thumbnailUrl?: string | null
  title?: string
  onClose: () => void
  onBack?: () => void
  onGenerateMore?: () => void
  onShowHistory?: () => void
  onDeleteVideo?: () => void
}

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl = null,
  title = "Generated Video",
  onClose,
  onBack,
  onGenerateMore,
  onShowHistory,
  onDeleteVideo,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoading(false)
      setDuration(video.duration)
      // Auto-play when loaded
      video.play().catch((err) => console.error("Auto-play failed:", err))
    }

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
    }
  }, [videoUrl])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = "generated-video.mp4"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Video Downloaded",
      description: "Your video has been downloaded successfully.",
      duration: 3000,
    })
  }

  const handleSaveVideo = async () => {
    setIsSaving(true)

    // Simulate saving to account/project
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Video Saved",
        description: "Your video has been saved to your projects.",
        duration: 3000,
      })
    }, 1500)
  }

  const handleDeleteVideo = () => {
    if (onDeleteVideo) {
      onDeleteVideo()
      toast({
        title: "Video Deleted",
        description: "The video has been removed from your history.",
        duration: 3000,
      })
    }
  }

  // Create a placeholder background with CSS instead of using an image
  const placeholderStyle = {
    background: "linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-pink-400 mr-2" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">{title}</span>
          </CardTitle>
          <CardDescription className="text-purple-200/80">
            {duration > 0 ? `${Math.round(duration)} seconds video` : "Loading video..."}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {onShowHistory && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
              onClick={onShowHistory}
              title="View Video History"
            >
              <History className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div ref={containerRef} className="relative aspect-video rounded-lg overflow-hidden bg-black/40 mb-4">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 border-r-pink-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white/80" />
                  </div>
                </div>
                <p className="mt-4 text-white/80 text-sm">Loading your video...</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            style={thumbnailUrl ? {} : placeholderStyle}
            poster={thumbnailUrl || undefined}
            playsInline
            loop
          >
            {/* Fallback content if video can't be displayed */}
            <div style={placeholderStyle}>Video loading...</div>
          </video>

          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 transition-opacity duration-300 opacity-100 hover:opacity-100">
            <div className="w-full h-1 bg-white/20 rounded-full mb-2 cursor-pointer" onClick={handleProgressClick}>
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                <span className="text-xs text-white/80">
                  {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} /
                  {duration ? formatTime(duration) : "0:00"}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          <Button
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
            onClick={handleSaveVideo}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>

          {onDeleteVideo && (
            <Button
              variant="outline"
              className="text-red-400 border-red-400/20 hover:bg-red-500/10 hover:text-red-300"
              onClick={handleDeleteVideo}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/10 p-4 flex justify-between">
        {onBack && (
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {onGenerateMore && (
          <Button
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 ml-auto"
            onClick={onGenerateMore}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate More
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

