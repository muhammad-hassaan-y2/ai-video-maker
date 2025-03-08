import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"

// Define the type for a video scene
type VideoScene = {
  id: number
  description: string
  duration: string
  visualElements: string[]
}

export async function POST(req: NextRequest) {
  try {
    // Load request data
    const { scenes } = await req.json()

    // Validate input
    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json({ error: "No valid scenes provided" }, { status: 400 })
    }

    // Ensure API Key is set
    const apiKey = process.env.FAL_API_KEY
    if (!apiKey) {
      console.error("❌ API Key is missing")
      return NextResponse.json({ error: "API Key is not set. Please check your .env.local file." }, { status: 500 })
    }

    // Initialize fal.ai client
    fal.config({ credentials: apiKey })

    // For now, we'll generate a video for the first scene
    // In a production app, you could generate multiple videos (one per scene) and use a video stitching service
    const scene = scenes[0]
    const sceneDescription = scene.description
    const visualElements = scene.visualElements ? scene.visualElements.join(", ") : ""

    // Create a detailed prompt combining the scene description and visual elements
    const prompt = `${sceneDescription} ${visualElements ? `Including: ${visualElements}` : ""}`

    console.log("🚀 Sending request to fal-ai/veo2...")
    console.log("Prompt:", prompt)

    // Use the veo2 model as requested
    const result = await fal.subscribe("fal-ai/veo2", {
      input: {
        prompt: prompt,
        negative_prompt: "poor quality, blurry, distorted, text, watermark",
        guidance_scale: 12.0,
        seed: Math.floor(Math.random() * 10000000),
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log)
        }
      },
    })

    console.log("✅ Successful response from fal.ai API:", result)

    // Extract the video URL correctly
    let videoUrl = null
    let thumbnailUrl = null

    // Type assertion to access properties dynamically
    const data = result.data as any

    // Handle different response formats
    if (data.video?.url) {
      videoUrl = data.video.url
      thumbnailUrl = data.thumbnail?.url || null
    } else if (data.output?.video) {
      videoUrl = data.output.video
      thumbnailUrl = data.output.thumbnail || null
    } else if (data.url) {
      videoUrl = data.url
    } else if (data.images && data.images.length > 0) {
      videoUrl = data.images[0]
    } else if (data.video) {
      // Direct video URL
      videoUrl = data.video
    }

    if (!videoUrl) {
      console.error("❌ No video URL found in response data:", data)
      return NextResponse.json({ error: "No video URL in response", details: data }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
      thumbnailUrl: thumbnailUrl,
      duration: 5, // Fixed duration of 5 seconds for veo2 model
      message: "Video generated successfully using veo2 model",
      modelLimitation:
        "The veo2 model is currently limited to generating 5-second videos regardless of requested duration.",
    })
  } catch (error) {
    console.error("❌ Unexpected error:", error)

    // Provide more detailed error information
    let errorMessage = "Failed to process your request"
    const errorDetails = error instanceof Error ? error.message : String(error)

    // Check for specific error types
    if (errorDetails.includes("404") || errorDetails.includes("Not Found")) {
      errorMessage = "The AI model endpoint was not found. Please check if the model is available."
    } else if (errorDetails.includes("401") || errorDetails.includes("Unauthorized")) {
      errorMessage = "API key is invalid or expired. Please check your API key."
    } else if (errorDetails.includes("429") || errorDetails.includes("Too Many Requests")) {
      errorMessage = "Rate limit exceeded. Please try again later."
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}

