"use client"

import { motion } from "framer-motion"
import { MessageSquare, Lightbulb, Film, Upload } from "lucide-react"

const steps = [
  {
    icon: <MessageSquare className="w-12 h-12" />,
    title: "Describe Your Video",
    description: "Tell our AI what kind of video you want to create, including platform, length, and story.",
  },
  {
    icon: <Lightbulb className="w-12 h-12" />,
    title: "AI Generates Scenes",
    description: "Our advanced AI analyzes your input and creates a storyboard with optimized scenes.",
  },
  {
    icon: <Film className="w-12 h-12" />,
    title: "Review & Customize",
    description: "Preview your video, make adjustments to scenes, add music, and fine-tune details.",
  },
  {
    icon: <Upload className="w-12 h-12" />,
    title: "Export & Share",
    description: "Download your finished video or share it directly to your social media platforms.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/20 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Works</span>
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create amazing videos in just a few simple steps
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex-1 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
            >
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20 shadow-lg shadow-purple-700/20 hover:scale-110 transition-transform duration-300">
                <div className="text-pink-400">{step.icon}</div>
              </div>
              <div className="relative mb-8 md:mb-0 md:h-1 md:w-full">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-pink-500 to-violet-500"></div>
                )}
                <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 top-0 w-1 h-8 bg-gradient-to-b from-pink-500 to-violet-500"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

