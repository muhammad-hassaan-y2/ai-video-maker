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
    <Card className="bg-white border-yellow-400/30 shadow-xl shadow-blue-900/10 rounded-xl overflow-hidden h-[60vh]">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-blue-50 border-b border-yellow-200/50">
        <CardTitle className="text-gray-900">Tips & Suggestions</CardTitle>
        <CardDescription className="text-gray-600">Get the most out of your AI video creator</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2 flex items-center text-gray-900">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
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
          <ul className="space-y-2 text-sm text-gray-700">
            {platform === "tiktok" && (
              <>
                <li>• Keep videos between 15-60 seconds for optimal engagement</li>
                <li>• Start with a hook in the first 3 seconds</li>
                <li>• Use trending sounds and effects</li>
              </>
            )}
            {platform === "youtube" && (
              <>
                <li>• Aim for longer videos (3-5 minutes) to increase watch time</li>
                <li>• Optimize titles and descriptions with relevant keywords</li>
                <li>• Use end screens and cards to promote other videos</li>
              </>
            )}
            {platform === "youtube-shorts" && (
              <>
                <li>• Keep videos under 60 seconds</li>
                <li>• Use vertical format (9:16)</li>
                <li>• Add music and text overlays to enhance engagement</li>
              </>
            )}
            {platform === "instagram" && (
              <>
                <li>• Post high-quality photos and videos</li>
                <li>• Use relevant hashtags to increase visibility</li>
                <li>• Engage with your audience through comments and stories</li>
              </>
            )}
            {platform === "instagram-reels" && (
              <>
                <li>• Create engaging and entertaining short videos</li>
                <li>• Use trending audio and effects</li>
                <li>• Collaborate with other creators</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Prompt Suggestions</h3>
          <p className="text-sm text-gray-700 mb-3">Try these prompts to get started:</p>
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
            className="w-full bg-gradient-to-r from-yellow-400 to-blue-600 hover:from-yellow-500 hover:to-blue-700 text-white"
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
