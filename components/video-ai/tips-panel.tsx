"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Video } from "lucide-react"

type Platform = "tiktok" | "youtube" | "youtube-shorts" | "instagram" | "instagram-reels"

interface TipsPanelProps {
  platform: Platform
  setPrompt: (prompt: string) => void
  hasScenes: boolean
  onShowScenes: () => void
}

export default function TipsPanel({ platform, setPrompt, hasScenes, onShowScenes }: TipsPanelProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden h-[60vh]">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
          Tips & Suggestions
        </CardTitle>
        <CardDescription className="text-purple-200/80">Get the most out of your AI video creator</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
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
          <ul className="space-y-2 text-sm text-white/80">
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

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="text-lg font-medium mb-2">Prompt Suggestions</h3>
          <p className="text-sm text-white/80 mb-3">Try these prompts to get started:</p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-left text-white/80 border-white/10 hover:bg-white/10"
              onClick={() => setPrompt("Create a product showcase video for a new smartphone with sleek transitions")}
            >
              Product showcase video
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-left text-white/80 border-white/10 hover:bg-white/10"
              onClick={() => setPrompt("Make a travel montage video of a beach vacation with upbeat vibes")}
            >
              Travel montage video
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-left text-white/80 border-white/10 hover:bg-white/10"
              onClick={() => setPrompt("Create a cooking tutorial for making pasta with step-by-step instructions")}
            >
              Cooking tutorial
            </Button>
          </div>
        </div>

        {hasScenes && (
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
            onClick={onShowScenes}
          >
            <Video className="w-4 h-4 mr-2" />
            View Generated Scenes
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

