"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Clock, X, AlertCircle, Sparkles, Edit, Plus, Trash2, Info, History } from "lucide-react"
import { useState, useEffect } from "react"
import VideoPlayer from "./video-player"
import VideoGenerationStatus from "./video-generation-status"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import VideoHistory, { type SavedVideo } from "./video-hisotry"

type VideoScene = {
  id: number
  description: string
  duration: string
  visualElements: string[]
}

interface ScenesPanelProps {
  scenes: VideoScene[]
  onClose: () => void
  onAddScene?: () => void
  savedVideos?: SavedVideo[]
  onSaveVideo?: (video: SavedVideo) => void
}

export default function ScenesPanel({
  scenes,
  onClose,
  onAddScene,
  savedVideos = [],
  onSaveVideo = () => {},
}: ScenesPanelProps) {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Preparing scenes")
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null)
  const [workingScenes, setWorkingScenes] = useState<VideoScene[]>(scenes)
  const [generationAttempts, setGenerationAttempts] = useState(0)
  const [modelLimitation, setModelLimitation] = useState<string | null>(
    "Note: The current AI model is limited to generating 5-second videos regardless of scene duration.",
  )
  const [showHistory, setShowHistory] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<SavedVideo | null>(null)

  // Update working scenes when scenes prop changes
  useEffect(() => {
    console.log("ScenesPanel received new scenes:", scenes)
    setWorkingScenes(scenes)
  }, [scenes])

  // Function to handle video generation
  const handleGenerateVideo = async () => {
    if (!workingScenes || workingScenes.length === 0) {
      setError("No scenes available to generate video")
      return
    }

    setIsGeneratingVideo(true)
    setError(null)
    setGenerationProgress(0) // Start at 0%
    setCurrentStep("Initializing generation")
    setGenerationAttempts((prev) => prev + 1)

    // Immediately start showing progress animation
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        // Slow down progress as we get closer to 100%
        const increment = prev < 30 ? 1 : prev < 60 ? 0.5 : prev < 90 ? 0.3 : 0.1

        const newProgress = Math.min(95, prev + increment)

        // Update the current step based on progress
        if (prev < 25 && newProgress >= 25) {
          setCurrentStep("Analyzing scenes")
        } else if (prev < 50 && newProgress >= 50) {
          setCurrentStep("Generating visuals")
        } else if (prev < 75 && newProgress >= 75) {
          setCurrentStep("Adding transitions")
        } else if (prev < 90 && newProgress >= 90) {
          setCurrentStep("Finalizing video")
        }

        return newProgress
      })
    }, 300)

    try {
      console.log("Sending scenes to API:", workingScenes)
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenes: workingScenes }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Failed to generate video: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Video generation response:", data)

      if (!data.success) {
        throw new Error(data.error || "Failed to generate video")
      }

      // Set the video URL when ready
      setVideoUrl(data.videoUrl)
      setThumbnailUrl(data.thumbnailUrl || null)

      // Set model limitation if provided
      if (data.modelLimitation) {
        setModelLimitation(data.modelLimitation)
      }

      // Save the video to history
      const newVideo: SavedVideo = {
        id: uuidv4(),
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        title: `Video ${savedVideos.length + 1}`,
        description: workingScenes[0]?.description || "AI Generated Video",
        duration: data.duration || 5,
        createdAt: new Date(),
        scenes: workingScenes,
      }

      onSaveVideo(newVideo)

      // Complete the progress and clear the interval
      clearInterval(progressInterval)
      setGenerationProgress(100)
      setCurrentStep("Video ready!")

      // Small delay before showing the video
      setTimeout(() => {
        setIsGeneratingVideo(false)
        toast({
          title: "Video Generated",
          description: `Your video has been generated successfully! (Note: Limited to 5 seconds)`,
          duration: 3000,
        })
      }, 1000)
    } catch (err) {
      console.error("Error generating video:", err)
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "Failed to generate video")
      setIsGeneratingVideo(false)

      toast({
        title: "Generation Failed",
        description: err instanceof Error ? err.message : "Failed to generate video",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleEditScene = (sceneId: number) => {
    setEditingSceneId(sceneId)
    // In a real app, you would open a modal or form to edit the scene
    toast({
      title: "Edit Scene",
      description: "Scene editing functionality would open here.",
      duration: 3000,
    })
  }

  const handleDeleteScene = (sceneId: number) => {
    setWorkingScenes((prev) => prev.filter((scene) => scene.id !== sceneId))
    toast({
      title: "Scene Deleted",
      description: "The scene has been removed from your storyboard.",
      duration: 3000,
    })
  }

  const handleBackToScenes = () => {
    setVideoUrl(null)
    setCurrentVideo(null)
  }

  const handleGenerateMore = () => {
    if (onAddScene) {
      onAddScene()
    } else {
      toast({
        title: "Generate More",
        description: "You can describe a new video idea in the chat to generate more scenes.",
        duration: 3000,
      })
    }
  }

  const handleShowHistory = () => {
    setShowHistory(true)
  }

  const handleCloseHistory = () => {
    setShowHistory(false)
  }

  const handleSelectVideo = (video: SavedVideo) => {
    setCurrentVideo(video)
    setShowHistory(false)
  }

  // If we're showing the video history
  if (showHistory) {
    return <VideoHistory videos={savedVideos} onClose={handleCloseHistory} onSelectVideo={handleSelectVideo} />
  }

  // If we have a selected video from history
  if (currentVideo) {
    return (
      <VideoPlayer
        videoUrl={currentVideo.videoUrl}
        thumbnailUrl={currentVideo.thumbnailUrl}
        title={currentVideo.title}
        onClose={onClose}
        onBack={handleBackToScenes}
        onGenerateMore={handleGenerateMore}
      />
    )
  }

  // If we have a video URL, show the video player
  if (videoUrl) {
    return (
      <VideoPlayer
        videoUrl={videoUrl}
        thumbnailUrl={thumbnailUrl}
        onClose={onClose}
        onBack={handleBackToScenes}
        onGenerateMore={handleGenerateMore}
      />
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isGeneratingVideo ? (
        <motion.div
          key="generating"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <VideoGenerationStatus progress={generationProgress} currentStep={currentStep} />
        </motion.div>
      ) : (
        <motion.div
          key="scenes"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden h-[60vh] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 text-pink-400 mr-2" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                    Video Storyboard
                  </span>
                </CardTitle>
                <CardDescription className="text-purple-200/80">
                  {workingScenes.length} {workingScenes.length === 1 ? "scene" : "scenes"} ready for generation
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {savedVideos.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={handleShowHistory}
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
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {!workingScenes || workingScenes.length === 0 ? (
              <CardContent className="flex-grow flex items-center justify-center p-4">
                <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                  <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Scenes Available</h3>
                  <p className="text-white/70 mb-4">
                    There are no scenes available to display. Try generating scenes by describing a video idea in the
                    chat.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                    >
                      Return to Chat
                    </Button>
                    {savedVideos.length > 0 && (
                      <Button
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10"
                        onClick={handleShowHistory}
                      >
                        <History className="h-4 w-4 mr-2" />
                        View Video History
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            ) : (
              <>
                <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
                  {/* Model limitation warning */}
                  {modelLimitation && (
                    <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-white text-sm flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                      <span>{modelLimitation}</span>
                    </div>
                  )}

                  {/* Video history button for mobile */}
                  {savedVideos.length > 0 && (
                    <div className="sm:hidden">
                      <Button
                        variant="outline"
                        className="w-full text-white border-white/20 hover:bg-white/10"
                        onClick={handleShowHistory}
                      >
                        <History className="h-4 w-4 mr-2" />
                        View Your Video History ({savedVideos.length})
                      </Button>
                    </div>
                  )}

                  {workingScenes.map((scene) => (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: scene.id * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                          Scene {scene.id}
                        </h3>
                        <div className="flex items-center text-sm bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30">
                          <Clock className="h-3 w-3 mr-1" />
                          {scene.duration}
                        </div>
                      </div>

                      <div className="mb-4 bg-black/20 p-3 rounded-lg border border-white/10">
                        <h4 className="text-sm font-medium mb-1 text-white/90">Description:</h4>
                        <p className="text-sm text-white/80">{scene.description}</p>
                      </div>

                      {scene.visualElements && scene.visualElements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-white/90">Visual Elements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {scene.visualElements.map((element, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10"
                              >
                                {element}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-white/10 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => handleEditScene(scene.id)}
                          type="button"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => handleDeleteScene(scene.id)}
                          type="button"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {onAddScene && (
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-white/30 hover:border-white/50 hover:bg-white/5 h-16"
                      onClick={onAddScene}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Another Scene
                    </Button>
                  )}
                </CardContent>
                <CardFooter className="border-t border-white/10 p-4">
                  {error && (
                    <div className="w-full mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg shadow-purple-700/30 py-6 text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo || !workingScenes || workingScenes.length === 0}
                    type="button"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Video
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

