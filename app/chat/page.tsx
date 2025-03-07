"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { Message, VideoScene, Platform } from "@/types"
import Navbar from "@/components/navbar"
import ApiQuotaModal from "@/components/video-ai/api-quota-model"
import VideoConfig from "@/components/video-ai/video-config"
import ChatMessages from "@/components/video-ai/chat-messages"
import ChatInput from "@/components/video-ai/chat-input"
import ScenesPanel from "@/components/video-ai/scenes-panel"
import TipsPanel from "@/components/video-ai/tips-panel"

export default function ChatPage() {
  const [platform, setPlatform] = useState<Platform>("tiktok")
  const [videoLength, setVideoLength] = useState<number>(30)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI video creation assistant. Tell me about the video you want to create, and I'll help you bring it to life. What kind of story or content would you like to create today?",
    },
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedScenes, setSelectedScenes] = useState<VideoScene[]>([])
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [apiQuotaInfo, setApiQuotaInfo] = useState({ isVisible: false })

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return

    // Check if user is asking to show scenes
    const showSceneRequest =
      prompt.toLowerCase().includes("show scene") ||
      prompt.toLowerCase().includes("show me the scene") ||
      prompt.toLowerCase().includes("view scene")

    // Add user message
    const userMessage = { role: "user" as const, content: prompt }
    setMessages((prev) => [...prev, userMessage])
    setPrompt("")
    setIsGenerating(true)

    // If user is asking to show scenes and we have scenes, just show them
    if (showSceneRequest && selectedScenes.length > 0) {
      setIsGenerating(false)
      setIsSidePanelOpen(true)
      return
    }

    try {
      // Send request to our API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          platform,
          videoLength,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from API")
      }

      const data = await response.json()

      // Add AI response with scenes if available
      const aiResponse = {
        role: "assistant" as const,
        content: data.response,
        scenes: data.scenes && data.scenes.length > 0 ? data.scenes : undefined,
      }

      setMessages((prev) => [...prev, aiResponse])

      // If scenes were generated, open the side panel
      if (data.scenes && data.scenes.length > 0) {
        setSelectedScenes(data.scenes)
        setIsSidePanelOpen(true)
      }
    } catch (error) {
      console.error("Error:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSceneClick = (scenes: VideoScene[]) => {
    setSelectedScenes(scenes)
    setIsSidePanelOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <div className="mt-72">
        <Navbar />
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

      {/* API Quota Info Modal */}
      <AnimatePresence>
        <ApiQuotaModal isVisible={apiQuotaInfo.isVisible} onClose={() => setApiQuotaInfo({ isVisible: false })} />
      </AnimatePresence>

      <main className="container mx-auto px-4 py-6">
        {/* Video Configuration Card */}
        <VideoConfig
          platform={platform}
          setPlatform={setPlatform}
          videoLength={videoLength}
          setVideoLength={setVideoLength}
          onShowApiQuota={() => setApiQuotaInfo({ isVisible: true })}
          hasScenes={selectedScenes.length > 0}
          isSidePanelOpen={isSidePanelOpen}
          toggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        />

        {/* Main Content Area - Chat and Scenes side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area - Always visible */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 h-[60vh] flex flex-col shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center mr-3 shadow-lg shadow-purple-500/30 animate-pulse">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                      Chat with Mistral AI
                    </span>
                    <CardDescription className="text-purple-200/80 mt-1">
                      Describe your video idea and I'll help you create it
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4">
                <ChatMessages messages={messages} isGenerating={isGenerating} onSceneClick={handleSceneClick} />
              </CardContent>
              <CardFooter className="border-t border-white/10 p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <ChatInput
                  prompt={prompt}
                  setPrompt={setPrompt}
                  handleSubmit={handleSubmit}
                  isGenerating={isGenerating}
                />
              </CardFooter>
            </Card>
          </div>

          {/* Side Panel - Either Scenes or Tips */}
          <AnimatePresence mode="wait">
            {isSidePanelOpen ? (
              <motion.div
                key="scenes"
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <ScenesPanel scenes={selectedScenes} onClose={() => setIsSidePanelOpen(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="tips"
                className="lg:col-span-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TipsPanel
                  platform={platform}
                  setPrompt={setPrompt}
                  hasScenes={selectedScenes.length > 0}
                  onShowScenes={() => setIsSidePanelOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

