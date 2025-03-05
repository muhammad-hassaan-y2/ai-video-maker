"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface ChatWindowProps {
  messages: any[];
  setMessages: (value: any) => void;
  isGenerating: boolean;
  handleSubmit: () => void;
  prompt: string;
  setPrompt: (value: string) => void;
}

export default function ChatWindow({
  messages,
  setMessages,
  isGenerating,
  handleSubmit,
  prompt,
  setPrompt,
}: ChatWindowProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 flex flex-col shadow-xl rounded-xl overflow-hidden h-[60vh]">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
        <CardTitle>Chat with Mistral AI</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg bg-white/20 text-white`}>
              {message.content}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t border-white/10 p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your video..." />
        <Button onClick={handleSubmit} disabled={isGenerating || !prompt.trim()}>
          {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
