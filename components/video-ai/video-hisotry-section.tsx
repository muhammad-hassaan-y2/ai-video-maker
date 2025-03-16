"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Clock, Calendar, Film, History } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import VideoPlayer from "./video-player"
import type { SavedVideo } from "./video-hisotry"

// Update the VideoHistorySectionProps interface to include onDeleteVideo
interface VideoHistorySectionProps {
  videos: SavedVideo[]
  onSelectVideo: (video: SavedVideo) => void
  onShowAllHistory: () => void
  onDeleteVideo?: (videoId: string) => void
}

// Update the function signature to include the new prop
export default function VideoHistorySection({
  videos,
  onSelectVideo,
  onShowAllHistory,
  onDeleteVideo,
}: VideoHistorySectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null)

  // Show only the most recent 4 videos
  const recentVideos = videos.slice(0, 4)

  // Add a handler for deleting the selected video
  const handleDeleteSelectedVideo = () => {
    if (selectedVideo && onDeleteVideo) {
      onDeleteVideo(selectedVideo.id)
      setSelectedVideo(null)
    }
  }

  // Update the VideoPlayer component to include onDeleteVideo
  if (selectedVideo) {
    return (
      <VideoPlayer
        videoUrl={selectedVideo.videoUrl}
        thumbnailUrl={selectedVideo.thumbnailUrl}
        title={selectedVideo.title}
        onClose={() => setSelectedVideo(null)}
        onBack={() => setSelectedVideo(null)}
        onGenerateMore={() => {}}
        onDeleteVideo={onDeleteVideo ? handleDeleteSelectedVideo : undefined}
      />
    )
  }

  if (videos.length === 0) {
    return null
  }

  return (
    <Card className="bg-white border-yellow-400/30 shadow-xl shadow-blue-900/10 rounded-xl overflow-hidden mt-6">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-blue-50 border-b border-yellow-200/50">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-gray-900">
              Recent Videos
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
            onClick={onShowAllHistory}
          >
            View All History
          </Button>
        </div>
        <CardDescription className="text-gray-600">Your recently generated videos</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => {
                setSelectedVideo(video)
                onSelectVideo(video)
              }}
            >
              <div className="aspect-video bg-gray-100 relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
                    <Film className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center">
                    <Play className="h-6 w-6 text-blue-800" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm">
                  <h3 className="text-gray-900 font-medium truncate">{video.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}s
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(video.createdAt, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
