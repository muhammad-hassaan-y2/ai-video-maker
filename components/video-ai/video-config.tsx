"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Info, Video } from "lucide-react"

type Platform = "tiktok" | "youtube" | "youtube-shorts" | "instagram" | "instagram-reels"

interface VideoConfigProps {
  platform: Platform
  setPlatform: (platform: Platform) => void
  videoLength: number
  setVideoLength: (length: number) => void
  onShowApiQuota: () => void
  hasScenes: boolean
  isSidePanelOpen: boolean
  toggleSidePanel: () => void
}

export default function VideoConfig({
  platform,
  setPlatform,
  videoLength,
  setVideoLength,
  onShowApiQuota,
  hasScenes,
  isSidePanelOpen,
  toggleSidePanel,
}: VideoConfigProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 mb-6 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 text-pink-400 mr-2" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
            Video Configuration
          </span>
        </CardTitle>
        <CardDescription className="text-purple-200/80">Set up your video parameters</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
              <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white focus:ring-pink-500">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-purple-900/90 backdrop-blur-md border-white/10 text-white">
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube-shorts">YouTube Shorts</SelectItem>
                <SelectItem value="instagram-reels">Instagram Reels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Video Length</label>
              <span className="text-sm text-purple-400">{videoLength} seconds</span>
            </div>
            <Slider
              value={[videoLength]}
              min={10}
              max={30}
              step={2}
              onValueChange={(value) => setVideoLength(value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Actions</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-blue-950 border-white/20 hover:bg-white/10"
                onClick={onShowApiQuota}
              >
                <Info className="w-4 h-4 mr-2" />
                API Quota
              </Button>
              {hasScenes && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-whte border-white/20 hover:bg-white/10"
                  onClick={toggleSidePanel}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isSidePanelOpen ? "Hide Scenes" : "Show Scenes"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

