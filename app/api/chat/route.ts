import { type NextRequest, NextResponse } from "next/server"
import { Mistral } from "@mistralai/mistralai"

// Initialize the Mistral AI client with your API key
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "",
})

export async function POST(req: NextRequest) {
  try {
    const { messages, platform, videoLength } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const lastUserMessage = messages[messages.length - 1]?.content || ""

    // Update the system prompt to generate more detailed scenes
    const systemPrompt = `You are an AI video creation assistant. 
You help users create videos for ${platform} with a length of ${videoLength} seconds. 
Respond in a helpful, creative way. When the user describes a video idea, generate 3-4 scenes for the video.

Format each scene as a JSON object with the following properties:
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

      return NextResponse.json({
        response: cleanResponse || "I've created some scenes for your video idea!",
        scenes: scenes,
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
