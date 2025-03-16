"use client"

import { motion } from "framer-motion"
import { Video, Sparkles, Share2, Clock, Palette, Layers } from "lucide-react"

const features = [
  {
    icon: <Video className="w-10 h-10" />,
    title: "Multi-Platform Support",
    description: "Create videos optimized for TikTok, YouTube Shorts, Instagram Reels, and more.",
  },
  {
    icon: <Sparkles className="w-10 h-10" />,
    title: "AI-Powered Creativity",
    description: "Our advanced AI understands your story and generates engaging video content.",
  },
  {
    icon: <Share2 className="w-10 h-10" />,
    title: "One-Click Sharing",
    description: "Directly publish your videos to your favorite social media platforms.",
  },
  {
    icon: <Clock className="w-10 h-10" />,
    title: "Save Time",
    description: "Create professional-quality videos in minutes instead of hours.",
  },
  {
    icon: <Palette className="w-10 h-10" />,
    title: "Custom Styling",
    description: "Choose from various visual styles or let AI match your brand identity.",
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: "Scene Customization",
    description: "Fine-tune individual scenes to perfect your video story.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Powerful{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Features
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to create stunning videos without any technical skills
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(255,221,64,0.4)", scale: 1.02 }}
            >
              <div className="text-yellow-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

