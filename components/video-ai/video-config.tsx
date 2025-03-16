"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Info, Video } from "lucide-react"
import { useId } from "react"

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
  const platformId = useId()
  const lengthId = useId()

  return (
    <Card className="bg-white border-gray-200 mb-6 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-gray-800">Video Configuration</span>
        </CardTitle>
        <CardDescription className="text-gray-500">Set up your video parameters</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor={platformId} className="text-sm font-medium text-gray-700">
              Platform
            </label>
            <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
              <SelectTrigger id={platformId} className="bg-white border-gray-300 text-gray-800 focus:ring-yellow-500">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-800">
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube-shorts">YouTube Shorts</SelectItem>
                <SelectItem value="instagram-reels">Instagram Reels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={lengthId} className="text-sm font-medium text-gray-700">
                Video Length
              </label>
              <span className="text-sm text-yellow-600">{videoLength} seconds</span>
            </div>
            <Slider
              id={lengthId}
              value={[videoLength]}
              min={10}
              max={30}
              step={2}
              onValueChange={(value) => setVideoLength(value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quick Actions</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-300 hover:bg-gray-100"
                onClick={onShowApiQuota}
                type="button"
              >
                <Info className="w-4 h-4 mr-2" />
                API Quota
              </Button>
              {hasScenes && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-gray-800 border-gray-300 hover:bg-gray-100"
                  onClick={toggleSidePanel}
                  type="button"
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

