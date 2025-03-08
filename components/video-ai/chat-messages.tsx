"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Video } from "lucide-react"

type VideoScene = {
  id: number
  description: string
  duration: string
  visualElements: string[]
}

type Message = {
  role: "user" | "assistant"
  content: string
  scenes?: VideoScene[]
}

interface ChatMessagesProps {
  messages: Message[]
  isGenerating: boolean
  onSceneClick: (scenes: VideoScene[]) => void
}

export default function ChatMessages({ messages, isGenerating, onSceneClick }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isGenerating])

  return (
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
                    onClick={() => onSceneClick(message.scenes || [])}
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
  )
}

