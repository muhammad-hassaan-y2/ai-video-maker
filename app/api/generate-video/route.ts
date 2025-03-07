import { type NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

// Define the type for a video scene
type VideoScene = {
  id: number;
  description: string;
  duration: string;
  visualElements: string[];
};

export async function POST(req: NextRequest) {
  try {
    // Load request data
    const { scenes } = await req.json();

    // Validate input
    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json(
        { error: "No valid scenes provided" },
        { status: 400 }
      );
    }

    // Ensure API Key is set
    const apiKey = process.env.FAL_API_KEY;
    if (!apiKey) {
      console.error("❌ API Key is missing");
      return NextResponse.json(
        { error: "API Key is not set. Please check your .env.local file." },
        { status: 500 }
      );
    }

    // Initialize fal.ai client
    fal.config({ credentials: apiKey });

    // Format scenes for API request
    const formattedScenes = scenes.map((scene: VideoScene) => ({
      description: scene.description,
      duration_seconds: parseInt(scene.duration.replace(/\D/g, ""), 10) || 5,
      visual_elements: scene.visualElements.join(", "),
    }));

    // Prepare the combined prompt
    const combinedPrompt = formattedScenes
      .map(
        (scene) =>
          `Scene (${scene.duration_seconds}s): ${scene.description} ${
            scene.visual_elements ? `Including: ${scene.visual_elements}` : ""
          }`
      )
      .join("\n\n");

    console.log("🚀 Sending request to fal-ai/hunyuan-video...");

    // Use the hunyuan-video model with correct input structure
    const result = await fal.subscribe("fal-ai/hunyuan-video", {
      input: {
        prompt: combinedPrompt,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("✅ Successful response from fal.ai API:", result);

    // Extract the video URL correctly
    let videoUrl = null;

    // Type assertion to access properties dynamically
    const data = result.data as any;

    if (data.video?.url) {
      videoUrl = data.video.url;
    } else if (data.output?.video) {
      videoUrl = data.output.video;
    } else if (data.url) {
      videoUrl = data.url;
    }

    if (!videoUrl) {
      console.error("❌ No video URL found in response data:", data);
      return NextResponse.json(
        { error: "No video URL in response", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
      message: "Video generated successfully using hunyuan-video model",
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Failed to process your request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
