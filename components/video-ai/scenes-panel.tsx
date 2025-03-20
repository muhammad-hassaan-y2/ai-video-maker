"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Clock, X, AlertCircle, Sparkles, Edit, Plus, Trash2, Info, History, Check, Film } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import VideoPlayer from "./video-player"
import VideoGenerationStatus from "./video-generation-status"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import VideoHistory, { type SavedVideo } from "./video-hisotry"
import SceneVideosPanel, { type SceneVideo } from "./scene-videos-panel"
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
  const [thumbnailUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Preparing scenes")
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null)
  const [editedDescription, setEditedDescription] = useState("")
  const [editedVisualElements, setEditedVisualElements] = useState("")
  const [workingScenes, setWorkingScenes] = useState<VideoScene[]>(scenes)
  const [generationAttempts, setGenerationAttempts] = useState(0)
  const [modelLimitation] = useState<string | null>(
    "Note: Each scene is limited to 5 seconds maximum due to AI model constraints.",
  )
  const [showHistory, setShowHistory] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<SavedVideo | null>(null)
  const [sceneVideos, setSceneVideos] = useState<SceneVideo[]>([])
  const [showSceneVideos, setShowSceneVideos] = useState(false)
  const editFormRef = useRef<HTMLDivElement>(null)

  console.log(generationAttempts)

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
    setGenerationAttempts((prev: number) => prev + 1)

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

      // Add the generated video to the scene videos array
      const newSceneVideo: SceneVideo = {
        sceneId: sceneId,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        description: sceneToGenerate.description,
      }

      setSceneVideos((prev) => {
        // Replace if already exists, otherwise add
        const exists = prev.some((v) => v.sceneId === sceneId)
        if (exists) {
          return prev.map((v) => (v.sceneId === sceneId ? newSceneVideo : v))
        } else {
          return [...prev, newSceneVideo]
        }
      })

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

        // Show the scene videos panel if we have more than one scene video
        if (sceneVideos.length > 0) {
          setShowSceneVideos(true)
        }

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

    // Also remove any generated videos for this scene
    setSceneVideos((prev) => prev.filter((video) => video.sceneId !== sceneId))

    toast({
      title: "Scene Deleted",
      description: "The scene has been removed from your storyboard.",
      duration: 3000,
    })
  }

  const handleBackToScenes = () => {
    setVideoUrl(null)
    setCurrentVideo(null)
    setShowSceneVideos(false)
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

  const handleShowSceneVideos = () => {
    if (sceneVideos.length > 0) {
      setShowSceneVideos(true)
    } else {
      toast({
        title: "No Scene Videos",
        description: "Generate at least one scene video first.",
        duration: 3000,
      })
    }
  }

  // If we're showing the video history
  if (showHistory) {
    return <VideoHistory videos={savedVideos} onClose={handleCloseHistory} onSelectVideo={handleSelectVideo} />
  }

  // If we're showing the scene videos panel
  if (showSceneVideos) {
    return (
      <SceneVideosPanel
        videos={sceneVideos}
        onClose={onClose}
        onGenerateMore={handleGenerateMore}
        onDeleteVideo={handleDeleteScene}
      />
    )
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

      {/* Scenes panel - always show unless replaced by video player or history */}
      {!showHistory && !currentVideo && !videoUrl && (
        <motion.div
          key="scenes"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border-gray-200 shadow-md rounded-xl overflow-hidden h-[60vh] flex flex-col">
            <CardHeader className="bg-gray-50 border-b border-gray-200 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-gray-800">Video Storyboard</span>
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {workingScenes.length} {workingScenes.length === 1 ? "scene" : "scenes"} ready for generation
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {sceneVideos.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={handleShowSceneVideos}
                    title="View Scene Videos"
                  >
                    <Film className="h-4 w-4" />
                  </Button>
                )}
                {savedVideos.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={handleShowHistory}
                    title="View Video History"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={onClose}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {!workingScenes || workingScenes.length === 0 ? (
              <CardContent className="flex-grow flex items-center justify-center p-4">
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2 text-gray-800">No Scenes Available</h3>
                  <p className="text-gray-600 mb-4">
                    There are no scenes available to display. Try generating scenes by describing a video idea in the
                    chat.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
                    >
                      Return to Chat
                    </Button>
                    {savedVideos.length > 0 && (
                      <Button
                        variant="outline"
                        className="text-gray-800 border-gray-300 hover:bg-gray-100"
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
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-800 text-sm flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                      <span>{modelLimitation}</span>
                    </div>
                  )}

                  {/* Scene videos button */}
                  {sceneVideos.length > 0 && (
                    <Button
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
                      onClick={handleShowSceneVideos}
                    >
                      <Film className="h-4 w-4 mr-2" />
                      View Generated Scene Videos ({sceneVideos.length})
                    </Button>
                  )}

                  {/* Video history button for mobile */}
                  {savedVideos.length > 0 && (
                    <div className="sm:hidden">
                      <Button
                        variant="outline"
                        className="w-full text-gray-800 border-gray-300 hover:bg-gray-100"
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
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-md mb-4"
                      ref={editFormRef}
                    >
                      <h3 className="text-lg font-medium mb-3 text-gray-800">Edit Scene {editingSceneId}</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Scene Description</label>
                          <Textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="bg-white border-gray-300 text-gray-800 resize-none min-h-[100px]"
                            placeholder="Describe what happens in this scene..."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Visual Elements (comma separated)
                          </label>
                          <Textarea
                            value={editedVisualElements}
                            onChange={(e) => setEditedVisualElements(e.target.value)}
                            className="bg-white border-gray-300 text-gray-800 resize-none"
                            placeholder="Text overlay, lens flare, tracking shot, etc."
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-800 border-gray-300 hover:bg-gray-100"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
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
                      className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg text-gray-800">Scene {scene.id}</h3>
                        <div className="flex items-center text-sm bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                          <Clock className="h-3 w-3 mr-1 text-yellow-600" />
                          <span className="text-yellow-700">{scene.duration}</span>
                        </div>
                      </div>

                      <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium mb-1 text-gray-700">Description:</h4>
                        <p className="text-sm text-gray-600">{scene.description}</p>
                      </div>

                      {scene.visualElements && scene.visualElements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2 text-gray-700">Visual Elements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {scene.visualElements.map((element, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200 text-gray-700"
                              >
                                {element}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 mb-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-sm"
                          onClick={() => handleGenerateSceneVideo(scene.id)}
                          disabled={isGeneratingVideo}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Generate This Scene
                        </Button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                          onClick={() => handleEditScene(scene.id)}
                          type="button"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
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
                      className="w-full border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 h-16"
                      onClick={onAddScene}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Another Scene
                    </Button>
                  )}
                </CardContent>
                <CardFooter className="border-t border-gray-200 p-4">
                  {error && (
                    <div className="w-full mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-gray-800 text-sm flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* View Scene Videos button instead of Generate Complete Video */}
                  {sceneVideos.length > 0 ? (
                    <Button
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white shadow-md py-6 text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                      onClick={handleShowSceneVideos}
                      type="button"
                    >
                      <Film className="h-5 w-5 mr-2" />
                      View All Generated Scene Videos ({sceneVideos.length})
                    </Button>
                  ) : (
                    <div className="w-full p-4 text-center text-gray-600">
                      Generate individual scene videos using the &quot;Generate This Scene&quot; buttons above
                    </div>
                  )}
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  )
}

