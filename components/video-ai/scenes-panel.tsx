"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import VideoPlayer from "./video-player";
import VideoGenerationStatus from "./video-generation-status";

type VideoScene = {
  id: number;
  description: string;
  duration: string;
  visualElements: string[];
};

interface ScenesPanelProps {
  scenes: VideoScene[];
  onClose: () => void;
}

export default function ScenesPanel({ scenes, onClose }: ScenesPanelProps) {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Preparing scenes");

  // Function to handle video generation
  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setError(null);
    setGenerationProgress(5);
    setCurrentStep("Preparing scenes");

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to generate video: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success || !data.videoUrl) {
        throw new Error(data.error || "Failed to generate video");
      }

      // Set progress indicators based on steps
      setGenerationProgress(30);
      setCurrentStep("Processing video request");

      // Set the video URL when ready
      setVideoUrl(data.videoUrl);

      // Complete the progress
      setGenerationProgress(100);
      setCurrentStep("Video ready!");

      // Small delay before showing the video
      setTimeout(() => {
        setIsGeneratingVideo(false);
      }, 500);
    } catch (err) {
      console.error("Error generating video:", err);
      setError(err instanceof Error ? err.message : "Failed to generate video");
      setIsGeneratingVideo(false);
    }
  };

  // If we're generating a video, show the generation status
  if (isGeneratingVideo) {
    return <VideoGenerationStatus progress={generationProgress} currentStep={currentStep} />;
  }

  // If we have a video URL, show the video player
  if (videoUrl) {
    return <VideoPlayer videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />;
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-xl overflow-hidden h-[60vh] flex flex-col">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
          Generated Scenes
        </CardTitle>
        <Button onClick={onClose} variant="ghost">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md">
            <AlertCircle className="inline-block mr-2" />
            {error}
          </div>
        )}
        <Button onClick={handleGenerateVideo} disabled={isGeneratingVideo}>
          {isGeneratingVideo ? "Generating..." : "Generate Full Video"}
        </Button>
      </CardContent>
    </Card>
  );
}
