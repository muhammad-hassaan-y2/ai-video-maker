"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { X, Play, ArrowLeft, ArrowRight, Film, Trash2, Check, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import VideoPlayer from "./video-player"

export type SceneVideo = {
  sceneId: number
  videoUrl: string
  thumbnailUrl?: string | null
  description: string
}

interface SceneVideosPanelProps {
  videos: SceneVideo[]
  onClose: () => void
  onGenerateMore?: () => void
  onDeleteVideo?: (sceneId: number) => void
}

export default function SceneVideosPanel({ videos, onClose, onGenerateMore, onDeleteVideo }: SceneVideosPanelProps) {
  const [selectedVideo, setSelectedVideo] = useState<SceneVideo | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedVideos, setSelectedVideos] = useState<number[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [mergedVideoUrl, setMergedVideoUrl] = useState<string | null>(null)
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const videosPerPage = 4
  const totalPages = Math.ceil(videos.length / videosPerPage)

  const paginatedVideos = videos.slice(currentPage * videosPerPage, (currentPage + 1) * videosPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleDeleteSelectedVideo = () => {
    if (selectedVideo && onDeleteVideo) {
      onDeleteVideo(selectedVideo.sceneId)
      setSelectedVideo(null)
    }
  }

  const toggleVideoSelection = (sceneId: number) => {
    setSelectedVideos((prev) => {
      if (prev.includes(sceneId)) {
        return prev.filter((id) => id !== sceneId)
      } else {
        return [...prev, sceneId]
      }
    })
  }

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    if (isSelectionMode) {
      setSelectedVideos([])
    }
  }

  const handleMergeVideos = async () => {
    if (selectedVideos.length < 2) {
      toast({
        title: "Selection Required",
        description: "Please select at least 2 videos to merge.",
        variant: "destructive",
      })
      return
    }

    setIsMerging(true)

    try {
      // Sort the selected videos by scene ID to maintain order
      const videosToMerge = selectedVideos
        .sort((a, b) => a - b)
        .map((sceneId) => videos.find((v) => v.sceneId === sceneId))
        .filter(Boolean) as SceneVideo[]

      // In a real implementation, you would call an API to merge the videos
      // For this demo, we'll simulate the merging process with a timeout
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate a merged video URL (in a real app, this would come from the API)
      // For demo purposes, we'll just use the URL of the first video
      const mergedUrl = videosToMerge[0].videoUrl
      setMergedVideoUrl(mergedUrl)

      toast({
        title: "Videos Merged Successfully",
        description: `${videosToMerge.length} videos have been merged into one.`,
      })
    } catch (error) {
      toast({
        title: "Merge Failed",
        description: "There was an error merging the videos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMerging(false)
    }
  }

  // If a video is selected, show the video player
  if (selectedVideo !== null) {
    return (
      <VideoPlayer
        videoUrl={selectedVideo.videoUrl}
        thumbnailUrl={selectedVideo.thumbnailUrl}
        title={`Scene ${selectedVideo.sceneId} Video`}
        onClose={onClose}
        onBack={() => setSelectedVideo(null)}
        onGenerateMore={onGenerateMore}
        onDeleteVideo={onDeleteVideo ? () => handleDeleteSelectedVideo() : undefined}
      />
    )
  }

  // If we have a merged video, show it
  if (mergedVideoUrl) {
    return (
      <VideoPlayer
        videoUrl={mergedVideoUrl}
        title="Merged Video"
        onClose={onClose}
        onBack={() => setMergedVideoUrl(null)}
        onGenerateMore={onGenerateMore}
        isMergedVideo={true}
      />
    )
  }

  return (
    <Card className="bg-white border-gray-200 shadow-md rounded-xl overflow-hidden h-[60vh] flex flex-col">
      <CardHeader className="bg-gray-50 border-b border-gray-200 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center">
            <Film className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-gray-800">Your Scene Videos</span>
          </CardTitle>
          <CardDescription className="text-gray-500">
            {videos.length} {videos.length === 1 ? "video" : "videos"} generated
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {videos.length >= 2 && (
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
              onClick={toggleSelectionMode}
            >
              {isSelectionMode ? "Cancel Selection" : "Select to Merge"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedVideos.map((video) => (
            <motion.div
              key={video.sceneId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-lg overflow-hidden group"
            >
              <div
                className="aspect-video bg-gray-100 relative cursor-pointer"
                onClick={() => (isSelectionMode ? toggleVideoSelection(video.sceneId) : setSelectedVideo(video))}
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={`Scene ${video.sceneId}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Scene {video.sceneId}</span>
                  </div>
                )}

                {isSelectionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedVideos.includes(video.sceneId)}
                      onCheckedChange={() => toggleVideoSelection(video.sceneId)}
                      className="h-5 w-5 bg-white border-2 border-yellow-500 data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                )}

                {!isSelectionMode && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center">
                      <Play className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-800 font-medium truncate">Scene {video.sceneId}</h3>
                    {isSelectionMode && selectedVideos.includes(video.sceneId) && (
                      <div className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm truncate">{video.description}</p>
                </div>
              </div>

              {!isSelectionMode && onDeleteVideo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/70 text-red-500 hover:text-red-600 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteVideo(video.sceneId)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="text-xl font-medium mb-2 text-gray-800">No Scene Videos Yet</h3>
              <p className="text-gray-600">Generate your first scene video to see it here.</p>
            </div>
          </div>
        )}
      </CardContent>

      {isSelectionMode && (
        <CardFooter className="border-t border-gray-200 p-4">
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">
                {selectedVideos.length} {selectedVideos.length === 1 ? "video" : "videos"} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={() => setSelectedVideos([])}
              >
                Clear Selection
              </Button>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
              onClick={handleMergeVideos}
              disabled={selectedVideos.length < 2 || isMerging}
            >
              {isMerging ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Merging Videos...
                </>
              ) : (
                <>
                  <Film className="h-4 w-4 mr-2" />
                  Merge Selected Videos
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}

      {totalPages > 1 && (
        <div
          className={`p-4 border-t border-gray-200 flex justify-between items-center ${isSelectionMode ? "border-t-0 pt-0" : ""}`}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <span className="text-gray-600 text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  )
}

