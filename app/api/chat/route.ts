import { type NextRequest, NextResponse } from "next/server"
import { Mistral } from "@mistralai/mistralai"

// Initialize the Mistral AI client with your API key
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "",
})

// Function to determine if a query might benefit from search
function shouldUseSearch(query: string): boolean {
  const searchTriggers = [
    "latest",
    "trending",
    "current",
    "news",
    "recent",
    "popular",
    "viral",
    "2023",
    "2024",
    "today",
    "this week",
    "this month",
    "this year",
  ]

  return searchTriggers.some((trigger) => query.toLowerCase().includes(trigger))
}

// Function to perform a search
async function performSearch(query: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`Search API returned ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    if (!data.searchResults || data.searchResults.length === 0) {
      return "No relevant search results found."
    }

    // Format search results into a string
    const formattedResults = data.searchResults.map((result: any) => `[${result.title}] ${result.snippet}`).join("\n\n")

    return `Here are some relevant search results:\n\n${formattedResults}`
  } catch (error) {
    console.error("Search error:", error)
    return "Unable to perform search at this time."
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, platform, videoLength } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const lastUserMessage = messages[messages.length - 1]?.content || ""

    // Check if we should use search for this query
    const useSearch = shouldUseSearch(lastUserMessage)
    let searchResults = ""

    if (useSearch) {
      console.log("Performing search for query:", lastUserMessage)
      searchResults = await performSearch(lastUserMessage)
      console.log("Search results:", searchResults)
    }

    // Update the system prompt to generate more detailed scenes and include search results if available
    let systemPrompt = `You are an AI video creation assistant. 
You help users create videos for ${platform} with a length of ${videoLength} seconds. 
Respond in a helpful, creative way. When the user describes a video idea, generate 3-4 scenes for the video.`

    if (useSearch && searchResults) {
      systemPrompt += `\n\nHere is some up-to-date information that might be relevant to the user's request:\n${searchResults}\n\nUse this information to make the video scenes more accurate and current.`
    }

    systemPrompt += `\n\nFormat each scene as a JSON object with the following properties:
- id: A number (1, 2, 3, etc.)
- description: A detailed 2-3 sentence description of what happens in the scene, including camera angles, transitions, and mood
- duration: How long the scene should last (in seconds)
- visualElements: An array of visual elements to include (text overlays, effects, props, etc.)

Wrap the scenes in a JSON array with the key "scenes".

Example scene format:
{
"id": 1,
"description": "Open with a low-angle shot of a person walking confidently toward the camera. The background is slightly blurred with warm lighting creating a golden hour effect. The subject is smiling and dressed in vibrant colors.",
"duration": "5 seconds",
"visualElements": ["Text overlay: 'Your Journey Begins'", "Subtle lens flare", "Smooth tracking shot"]
}`

    console.log("Messages before history creation:", messages)

    // Format messages for Mistral API
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(0, -1).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: lastUserMessage },
    ]

    console.log("Formatted messages for Mistral:", formattedMessages)

    try {
      // Call Mistral API - Adjust model and params as necessary
      const response = await client.chat.complete({
        model: "mistral-small-latest", // or another appropriate model
        messages: formattedMessages, // Send the full conversation history
        stream: false,
        temperature: 0.7, // Adjust this as needed
        maxTokens: 1000, // Adjust this as needed
      })

      const responseText = response.choices?.[0]?.message?.content || ""
      console.log("Raw response from Mistral:", responseText)

      // Try to extract scenes JSON if present
      let scenes = []
      try {
        const jsonMatch =
          typeof responseText === "string" &&
          (responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || responseText.match(/(\{[\s\S]*"scenes"[\s\S]*?\})/))

        if (jsonMatch && jsonMatch[1]) {
          const parsedData = JSON.parse(jsonMatch[1])
          if (parsedData.scenes && Array.isArray(parsedData.scenes)) {
            scenes = parsedData.scenes
            console.log("Successfully extracted scenes:", scenes)
          }
        } else {
          console.log("No JSON match found in response")
        }
      } catch (error) {
        console.error("Error parsing scenes:", error)
      }

      // Clean up the response text to remove any JSON blocks
      const cleanResponse =
        typeof responseText === "string"
          ? responseText
              .replace(/```json[\s\S]*?```/g, "")
              .replace(/\{[\s\S]*"scenes"[\s\S]*?\}/g, "")
              .trim()
          : ""

      // Add a note about search if it was used
      const finalResponse = useSearch
        ? `${cleanResponse || "I've created some scenes for your video idea!"}\n\n(I used search to find the latest information for your request.)`
        : cleanResponse || "I've created some scenes for your video idea!"

      return NextResponse.json({
        response: finalResponse,
        scenes: scenes,
        searchUsed: useSearch,
      })
    } catch (error) {
      console.error("Error calling Mistral API:", error)
      return NextResponse.json(
        {
          error: "Failed to get response from Mistral API",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process your request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

