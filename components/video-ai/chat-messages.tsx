"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Video, Search } from "lucide-react"

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
  searchUsed?: boolean
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
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                message.role === "user"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-yellow-200"
                  : "bg-gray-100 text-gray-800 shadow-gray-200"
              }`}
            >
              <div className="flex flex-col">
                <div>{message.content}</div>

                {message.searchUsed && (
                  <div className="mt-2 flex items-center gap-2 bg-blue-100 p-2 rounded-lg">
                    <Search className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">
                      Search was used to find the latest information
                    </span>
                  </div>
                )}

                {message.scenes && message.scenes.length > 0 && (
                  <div
                    className="mt-2 flex items-center gap-2 bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={() => onSceneClick(message.scenes || [])}
                  >
                    <Video className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-800">
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
          <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-gray-100 shadow-md">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-3 h-3 rounded-full bg-yellow-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-3 h-3 rounded-full bg-yellow-600 animate-bounce"
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

