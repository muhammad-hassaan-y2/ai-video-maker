"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  prompt: string
  setPrompt: (prompt: string) => void
  handleSubmit: () => void
  isGenerating: boolean
}

export default function ChatInput({ prompt, setPrompt, handleSubmit, isGenerating }: ChatInputProps) {
  return (
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
  )
}

