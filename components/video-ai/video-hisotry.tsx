"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { X, Play, Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"

export type SavedVideo = {
  id: string
  videoUrl: string
  thumbnailUrl?: string | null
  title: string
  description?: string
  duration: number
  createdAt: Date
  scenes?: Record<string, unknown>[]
  deleted?: boolean
}

interface VideoHistoryProps {
  videos: SavedVideo[]
  onClose: () => void
  onSelectVideo: (video: SavedVideo) => void
}

export default function VideoHistory({ videos, onClose, onSelectVideo }: VideoHistoryProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const videosPerPage = 6
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

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden h-[60vh] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
            Your Video History
          </CardTitle>
          <CardDescription className="text-purple-200/80">
            {videos.length} {videos.length === 1 ? "video" : "videos"} generated
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4">
        {videos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="text-xl font-medium mb-2">No Videos Yet</h3>
              <p className="text-white/70">Generate your first video to see it here.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => onSelectVideo(video)}
              >
                <div className="aspect-video bg-black/40 relative">
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      width={300}
                      height={200}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                      <span className="text-white/50">No thumbnail</span>
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
        )}
      </CardContent>

      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <span className="text-white/70 text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="text-white border-white/20 hover:bg-white/10"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  )
}