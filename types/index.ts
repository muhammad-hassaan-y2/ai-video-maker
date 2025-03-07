export type Platform = "tiktok" | "youtube" | "youtube-shorts" | "instagram" | "instagram-reels"

export type Message = {
  role: "user" | "assistant"
  content: string
  scenes?: VideoScene[]
}

export type VideoScene = {
  id: number
  description: string
  duration: string
  visualElements: string[]
}

