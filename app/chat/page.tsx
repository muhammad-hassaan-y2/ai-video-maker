"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Sparkles, ArrowLeft, Video, Clock, Loader2, X, Info, Settings } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"

type Platform = "tiktok" | "youtube" | "youtube-shorts" | "instagram" | "instagram-reels"
type Message = {
  role: "user" | "assistant"
  content: string
  scenes?: VideoScene[]
}
type VideoScene = {
  id: number
  description: string
  duration: string
  visualElements: string[]
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom, messages, isGenerating])

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
      <div className="mt-44">
        <Navbar />
      </div>

      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

      {/* API Quota Info Modal */}
      <AnimatePresence>
        {apiQuotaInfo.isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-400" />
                  API Quota Information
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setApiQuotaInfo({ isVisible: false })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <p>You can monitor your Mistral API quota usage in the Mistral AI Platform:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to{" "}
                    <a
                      href="https://console.mistral.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Mistral AI Console
                    </a>
                  </li>
                  <li>Navigate to the "API Keys" section</li>
                  <li>View your usage statistics and remaining quota</li>
                </ol>
                <p>The free tier typically includes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Limited number of tokens per month</li>
                  <li>Rate limits on API calls</li>
                </ul>
                <p className="text-yellow-300">
                  If you exceed your quota, API calls will return an error until the quota resets or you upgrade your
                  plan.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="container mx-auto py-4 px-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <div className="ml-4 flex items-center">
            <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
            <h1 className="text-xl font-bold">AI Video Creator</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Video Configuration Card - Now at the top */}
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
                    className="flex-1  border-white/20 hover:bg-white/10"
                    onClick={() => setApiQuotaInfo({ isVisible: true })}
                  >
                    <Info className="w-4 h-4 mr-2" />
                    API Quota
                  </Button>
                  {selectedScenes.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-white border-white/20 hover:bg-white/10"
                      onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
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
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-purple-700/20"
                              : "bg-white/20 backdrop-blur-sm border border-white/20 text-white shadow-purple-700/10"
                          }`}
                        >
                          <div className="flex flex-col">
                            <div>{message.content}</div>

                            {message.scenes && message.scenes.length > 0 && (
                              <div
                                className="mt-2 flex items-center gap-2 bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                                onClick={() => handleSceneClick(message.scenes || [])}
                              >
                                <Video className="h-4 w-4 text-pink-300" />
                                <span className="text-sm font-medium text-pink-300">
                                  {message.scenes.length} scenes generated - Click to view
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg shadow-purple-700/10">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-3 h-3 rounded-full bg-pink-400 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/10 p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <div className="flex w-full items-center space-x-3">
                  <Textarea
                    placeholder="Describe your video idea..."
                    className="min-h-12 bg-white/10 backdrop-blur-sm border-white/20 focus-visible:ring-pink-500 placeholder:text-white/50 text-white rounded-xl resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSubmit}
                    className={`bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 rounded-full w-12 h-12 p-0 shadow-lg shadow-purple-700/30 transition-all duration-300 ${isGenerating || !prompt.trim() ? "opacity-50" : "hover:scale-105"}`}
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Side Panel for Scenes - Can be toggled */}
          <AnimatePresence>
            {isSidePanelOpen ? (
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden h-[60vh] flex flex-col">
                  <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Video className="h-5 w-5 text-pink-400 mr-2" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                          Generated Scenes
                        </span>
                      </CardTitle>
                      <CardDescription className="text-purple-200/80">Your video storyboard</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => setIsSidePanelOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
                    {selectedScenes.map((scene) => (
                      <motion.div
                        key={scene.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: scene.id * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                            Scene {scene.id}
                          </h3>
                          <div className="flex items-center text-sm bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30">
                            <Clock className="h-3 w-3 mr-1" />
                            {scene.duration}
                          </div>
                        </div>

                        <div className="mb-4 bg-black/20 p-3 rounded-lg border border-white/10">
                          <h4 className="text-sm font-medium mb-1 text-white/90">Description:</h4>
                          <p className="text-sm text-white/80">{scene.description}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2 text-white/90">Visual Elements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {scene.visualElements.map((element, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10"
                              >
                                {element}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-white/70 hover:text-white hover:bg-white/10"
                          >
                            Edit Scene
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                  <CardFooter className="border-t border-white/10 p-4">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg shadow-purple-700/30 py-6 text-lg font-medium transition-all duration-300 hover:scale-[1.02]">
                      Generate Full Video
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden h-[60vh]">
                  <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
                    <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                      Tips & Suggestions
                    </CardTitle>
                    <CardDescription className="text-purple-200/80">
                      Get the most out of your AI video creator
                    </CardDescription>
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
                          onClick={() =>
                            setPrompt("Create a product showcase video for a new smartphone with sleek transitions")
                          }
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
                          onClick={() =>
                            setPrompt("Create a cooking tutorial for making pasta with step-by-step instructions")
                          }
                        >
                          Cooking tutorial
                        </Button>
                      </div>
                    </div>

                    {selectedScenes.length > 0 && (
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                        onClick={() => setIsSidePanelOpen(true)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        View Generated Scenes
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

