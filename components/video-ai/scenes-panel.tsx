"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Clock, X, AlertCircle, Sparkles, Edit, Plus, Trash2, Info, History, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import VideoPlayer from "./video-player"
import VideoGenerationStatus from "./video-generation-status"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import VideoHistory, { type SavedVideo } from "./video-hisotry"
import { Textarea } from "@/components/ui/textarea"

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
  const [generatingSceneId, setGeneratingSceneId] = useState<number | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Preparing scenes")
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null)
  const [editedDescription, setEditedDescription] = useState("")
  const [editedVisualElements, setEditedVisualElements] = useState("")
  const [workingScenes, setWorkingScenes] = useState<VideoScene[]>(scenes)
  const [generationAttempts, setGenerationAttempts] = useState(0)
  const [modelLimitation, setModelLimitation] = useState<string | null>(
    "Note: Each scene is limited to 5 seconds maximum due to AI model constraints.",
  )
  const [showHistory, setShowHistory] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<SavedVideo | null>(null)
  const editFormRef = useRef<HTMLDivElement>(null)

  // Update working scenes when scenes prop changes
  useEffect(() => {
    console.log("ScenesPanel received new scenes:", scenes)
    setWorkingScenes(
      scenes.map((scene) => ({
        ...scene,
        // Ensure duration is 5 seconds or less
        duration: ensureMaxDuration(scene.duration),
      })),
    )
  }, [scenes])

  // Ensure scene duration is 5 seconds or less
  const ensureMaxDuration = (duration: string): string => {
    // Extract the number from the duration string
    const durationMatch = duration.match(/(\d+)/)
    if (!durationMatch) return "5 seconds"

    const durationNumber = Number.parseInt(durationMatch[1], 10)
    if (isNaN(durationNumber) || durationNumber > 5) {
      return "5 seconds"
    }

    return duration
  }

  // Function to handle video generation for a specific scene
  const handleGenerateSceneVideo = async (sceneId: number) => {
    const sceneToGenerate = workingScenes.find((scene) => scene.id === sceneId)
    if (!sceneToGenerate) {
      setError("Scene not found")
      return
    }

    setIsGeneratingVideo(true)
    setGeneratingSceneId(sceneId)
    setError(null)
    setGenerationProgress(0) // Start at 0%
    setCurrentStep(`Preparing scene ${sceneId}`)
    setGenerationAttempts((prev) => prev + 1)

    // Immediately start showing progress animation
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        // Slow down progress as we get closer to 100%
        const increment = prev < 30 ? 1 : prev < 60 ? 0.5 : prev < 90 ? 0.3 : 0.1
        const newProgress = Math.min(95, prev + increment)

        // Update the current step based on progress
        if (prev < 25 && newProgress >= 25) {
          setCurrentStep(`Analyzing scene ${sceneId}`)
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
      console.log("Sending scene to API:", sceneToGenerate)
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenes: [sceneToGenerate] }),
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

      // Save the video to history
      const newVideo: SavedVideo = {
        id: uuidv4(),
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        title: `Scene ${sceneId} Video`,
        description: sceneToGenerate.description,
        duration: data.duration || 5,
        createdAt: new Date(),
        scenes: [sceneToGenerate],
      }

      onSaveVideo(newVideo)

      // Complete the progress and clear the interval
      clearInterval(progressInterval)
      setGenerationProgress(100)
      setCurrentStep("Video ready!")

      // Small delay before showing the video
      setTimeout(() => {
        setIsGeneratingVideo(false)
        setGeneratingSceneId(null)
        toast({
          title: "Scene Video Generated",
          description: `Your video for scene ${sceneId} has been generated successfully!`,
          duration: 3000,
        })
      }, 1000)
    } catch (err) {
      console.error("Error generating video:", err)
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "Failed to generate video")
      setIsGeneratingVideo(false)
      setGeneratingSceneId(null)

      toast({
        title: "Generation Failed",
        description: err instanceof Error ? err.message : "Failed to generate video",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Function to handle video generation for all scenes
  const handleGenerateAllScenesVideo = async () => {
    if (!workingScenes || workingScenes.length === 0) {
      setError("No scenes available to generate video")
      return
    }

    setIsGeneratingVideo(true)
    setGeneratingSceneId(null)
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

      // Save the video to history
      const newVideo: SavedVideo = {
        id: uuidv4(),
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        title: `Complete Video (${workingScenes.length} scenes)`,
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
          description: `Your complete video has been generated successfully!`,
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
    const sceneToEdit = workingScenes.find((scene) => scene.id === sceneId)
    if (!sceneToEdit) return

    setEditingSceneId(sceneId)
    setEditedDescription(sceneToEdit.description)
    setEditedVisualElements(sceneToEdit.visualElements.join(", "))

    // Scroll to the edit form
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSaveEdit = () => {
    if (editingSceneId === null) return

    setWorkingScenes((prev) =>
      prev.map((scene) => {
        if (scene.id === editingSceneId) {
          return {
            ...scene,
            description: editedDescription,
            visualElements: editedVisualElements
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }
        }
        return scene
      }),
    )

    setEditingSceneId(null)
    setEditedDescription("")
    setEditedVisualElements("")

    toast({
      title: "Scene Updated",
      description: "Your scene has been updated successfully.",
      duration: 3000,
    })
  }

  const handleCancelEdit = () => {
    setEditingSceneId(null)
    setEditedDescription("")
    setEditedVisualElements("")
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
    <div>
      {isGeneratingVideo && (
        <motion.div
          key="generating"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <VideoGenerationStatus progress={generationProgress} currentStep={currentStep} sceneId={generatingSceneId} />
        </motion.div>
      )}

      {/* Video history */}
      {showHistory && (
        <VideoHistory videos={savedVideos} onClose={handleCloseHistory} onSelectVideo={handleSelectVideo} />
      )}

      {/* Selected video from history */}
      {currentVideo && (
        <VideoPlayer
          videoUrl={currentVideo.videoUrl}
          thumbnailUrl={currentVideo.thumbnailUrl}
          title={currentVideo.title}
          onClose={onClose}
          onBack={handleBackToScenes}
          onGenerateMore={handleGenerateMore}
        />
      )}

      {/* Generated video */}
      {videoUrl && !currentVideo && (
        <VideoPlayer
          videoUrl={videoUrl}
          thumbnailUrl={thumbnailUrl}
          onClose={onClose}
          onBack={handleBackToScenes}
          onGenerateMore={handleGenerateMore}
        />
      )}

      {/* Scenes panel - always show unless replaced by video player or history */}
      {!showHistory && !currentVideo && !videoUrl && (
        <motion.div
          key="scenes"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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

                  {/* Scene editing form */}
                  {editingSceneId !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 shadow-lg mb-4"
                      ref={editFormRef}
                    >
                      <h3 className="text-lg font-medium mb-3 text-white">Edit Scene {editingSceneId}</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-white/90 mb-1 block">Scene Description</label>
                          <Textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="bg-white/10 border-white/20 text-white resize-none min-h-[100px]"
                            placeholder="Describe what happens in this scene..."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-white/90 mb-1 block">
                            Visual Elements (comma separated)
                          </label>
                          <Textarea
                            value={editedVisualElements}
                            onChange={(e) => setEditedVisualElements(e.target.value)}
                            className="bg-white/10 border-white/20 text-white resize-none"
                            placeholder="Text overlay, lens flare, tracking shot, etc."
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white border-white/20 hover:bg-white/10"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                            onClick={handleSaveEdit}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {workingScenes.map((scene) => (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: scene.id * 0.1 }}
                      whileHover={{ scale: 1.01 }}
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
                        <div className="mb-4">
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

                      <div className="flex flex-col sm:flex-row gap-2 mb-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-sm"
                          onClick={() => handleGenerateSceneVideo(scene.id)}
                          disabled={isGeneratingVideo}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Generate This Scene
                        </Button>
                      </div>

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
                    onClick={handleGenerateAllScenesVideo}
                    disabled={isGeneratingVideo || !workingScenes || workingScenes.length === 0}
                    type="button"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Complete Video
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  )
}

