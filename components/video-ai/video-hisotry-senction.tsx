"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Clock, Calendar, Film, History } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import VideoPlayer from "./video-player"
import type { SavedVideo } from "./video-hisotry"

interface VideoHistorySectionProps {
  videos: SavedVideo[]
  onSelectVideo: (video: SavedVideo) => void
  onShowAllHistory: () => void
}

export default function VideoHistorySection({ videos, onSelectVideo, onShowAllHistory }: VideoHistorySectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null)

  // Show only the most recent 4 videos
  const recentVideos = videos.slice(0, 4)

  // If a video is selected, show the video player
  if (selectedVideo) {
    return (
      <VideoPlayer
        videoUrl={selectedVideo.videoUrl}
        thumbnailUrl={selectedVideo.thumbnailUrl}
        title={selectedVideo.title}
        onClose={() => setSelectedVideo(null)}
        onBack={() => setSelectedVideo(null)}
        onGenerateMore={() => {}}
      />
    )
  }

  if (videos.length === 0) {
    return null
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden mt-6">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 text-pink-400 mr-2" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
              Recent Videos
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={onShowAllHistory}
          >
            View All History
          </Button>
        </div>
        <CardDescription className="text-purple-200/80">Your recently generated videos</CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recentVideos.map((video) => (
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
              <div className="aspect-video bg-black/40 relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                    <Film className="h-8 w-8 text-white/50" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm">
                  <h3 className="text-white font-medium truncate">{video.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-white/70 mt-1">
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

