"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-pulse-slow")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

  return (
    <section className="container mx-auto py-20 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Create{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Amazing Videos
            </span>{" "}
            with AI
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Transform your ideas into stunning videos for TikTok, YouTube, Instagram, and more with our AI-powered video
            generation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-lg py-6 px-8 shadow-lg shadow-yellow-700/30 transition-all duration-300 hover:scale-105">
                Create Your First Video
              </Button>
            </Link>
            <Button variant="outline" className="text-gray-800 border-yellow-500 hover:bg-yellow-900/20 text-lg py-6 px-8">
              Watch Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          ref={videoRef}
        >
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-yellow-400/50 shadow-[0_0_40px_rgba(255,221,64,0.5)] backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-blue-500/10 z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shadow-yellow-700/30 hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                <div>
                  <p className="text-white font-medium">AI-Generated Travel Video</p>
                  <p className="text-white/70 text-sm">Created in just 2 minutes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-70 animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  )
}

