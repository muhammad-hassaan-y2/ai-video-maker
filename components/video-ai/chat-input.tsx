"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { useId } from "react"

interface ChatInputProps {
  prompt: string
  setPrompt: (prompt: string) => void
  handleSubmit: () => void
  isGenerating: boolean
}

export default function ChatInput({ prompt, setPrompt, handleSubmit, isGenerating }: ChatInputProps) {
  const textareaId = useId()

  return (
    <div className="flex w-full items-center space-x-4">
      <Textarea
        id={textareaId}
        placeholder="Describe your video idea..."
        className="min-h-12 bg-white border-gray-300 focus-visible:ring-yellow-500 placeholder:text-gray-400 text-gray-800 rounded-xl resize-none"
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
        className={`bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-full w-12 h-12 p-0 shadow-md transition-all duration-300 ${isGenerating || !prompt.trim() ? "opacity-50" : "hover:scale-105"}`}
        disabled={isGenerating || !prompt.trim()}
        type="button"
      >
        {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </Button>
    </div>
  )
}

