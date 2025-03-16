"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Video } from "lucide-react"
import { useId } from "react"

type Platform = "tiktok" | "youtube" | "youtube-shorts" | "instagram" | "instagram-reels"

interface TipsPanelProps {
  platform: Platform
  setPrompt: (prompt: string) => void
  hasScenes: boolean
  onShowScenes: () => void
}

export default function TipsPanel({ platform, setPrompt, hasScenes, onShowScenes }: TipsPanelProps) {
  const buttonId1 = useId()
  const buttonId2 = useId()
  const buttonId3 = useId()

  return (
    <Card className="bg-white border-gray-200 shadow-md rounded-xl overflow-hidden h-[60vh]">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-gray-800">Tips & Suggestions</CardTitle>
        <CardDescription className="text-gray-500">Get the most out of your AI video creator</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2 flex items-center text-gray-800">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Platform Tips:{" "}
            {platform === "tiktok"
              ? "TikTok"
              : platform === "youtube"
                ? "YouTube"
                : platform === "youtube-shorts"
                  ? "YouTube Shorts"
                  : platform === "instagram"
                    ? "Instagram"
                    : "Instagram Reels"}
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {platform === "tiktok" && (
              <>
                <li>• Keep videos between 15-60 seconds for optimal engagement</li>
                <li>• Start with a hook in the first 3 seconds</li>
                <li>• Use trending sounds and effects</li>
              </>
            )}
            {platform === "youtube" && (
              <>
                <li>• Include a compelling thumbnail scene</li>
                <li>• Structure with clear intro, body, and conclusion</li>
                <li>• Add calls to action for engagement</li>
              </>
            )}
            {platform === "youtube-shorts" && (
              <>
                <li>• Keep videos under 60 seconds</li>
                <li>• Use vertical format (9:16 aspect ratio)</li>
                <li>• Create curiosity in the first few seconds</li>
              </>
            )}
            {platform === "instagram" && (
              <>
                <li>• Use high-quality visuals and aesthetics</li>
                <li>• Include relevant hashtags in your description</li>
                <li>• Consider carousel posts for storytelling</li>
              </>
            )}
            {platform === "instagram-reels" && (
              <>
                <li>• Keep videos between 15-30 seconds</li>
                <li>• Use trending audio and effects</li>
                <li>• Create quick, engaging transitions</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Prompt Suggestions</h3>
          <p className="text-sm text-gray-600 mb-3">Try these prompts to get started:</p>
          <div className="space-y-2">
            <Button
              id={buttonId1}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left text-gray-700 border-gray-300 hover:bg-gray-100"
              onClick={() => setPrompt("Create a product showcase video for a new smartphone with sleek transitions")}
              type="button"
            >
              Product showcase video
            </Button>
            <Button
              id={buttonId2}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left text-gray-700 border-gray-300 hover:bg-gray-100"
              onClick={() => setPrompt("Make a travel montage video of a beach vacation with upbeat vibes")}
              type="button"
            >
              Travel montage video
            </Button>
            <Button
              id={buttonId3}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left text-gray-700 border-gray-300 hover:bg-gray-100"
              onClick={() => setPrompt("Create a cooking tutorial for making pasta with step-by-step instructions")}
              type="button"
            >
              Cooking tutorial
            </Button>
          </div>
        </div>

        {hasScenes && (
          <Button
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
            onClick={onShowScenes}
            type="button"
          >
            <Video className="w-4 h-4 mr-2" />
            View Generated Scenes
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

