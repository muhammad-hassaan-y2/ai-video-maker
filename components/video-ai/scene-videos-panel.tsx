"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { X, Play, ArrowLeft, ArrowRight, Film, Trash2 } from "lucide-react"
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
  onGenerateMore: () => void
  onDeleteVideo?: (sceneId: number) => void
}

export default function SceneVideosPanel({ videos, onClose, onGenerateMore, onDeleteVideo }: SceneVideosPanelProps) {
  const [selectedVideo, setSelectedVideo] = useState<SceneVideo | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
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
        onDeleteVideo={onDeleteVideo ? handleDeleteSelectedVideo : undefined}
      />
    )
  }

  return (
    <Card className="bg-white border-yellow-400/30 shadow-xl shadow-blue-900/10 rounded-xl overflow-hidden h-[60vh] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-blue-50 border-b border-yellow-200/50 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center text-gray-900">
            <Film className="h-5 w-5 text-yellow-600 mr-2" />
            <span>Your Scene Videos</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            {videos.length} {videos.length === 1 ? "video" : "videos"} generated
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
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
              <div className="aspect-video bg-gray-100 relative cursor-pointer" onClick={() => setSelectedVideo(video)}>
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={`Scene ${video.sceneId}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
                    <span className="text-gray-400">Scene {video.sceneId}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center">
                    <Play className="h-6 w-6 text-blue-800" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm">
                  <h3 className="text-gray-900 font-medium truncate">Scene {video.sceneId}</h3>
                  <p className="text-gray-600 text-sm truncate">{video.description}</p>
                </div>
              </div>

              {onDeleteVideo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/70 text-red-600 hover:text-red-700 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h3 className="text-xl font-medium mb-2 text-gray-900">No Scene Videos Yet</h3>
              <p className="text-gray-600">Generate your first scene video to see it here.</p>
            </div>
          </div>
        )}
      </CardContent>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
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

