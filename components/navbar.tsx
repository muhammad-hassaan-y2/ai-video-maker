"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center">
              <span className="text-white font-bold">AV</span>
            </div>
            <span className="text-white font-bold text-xl">AIVideoGen</span>
          </Link>

          <div className="hidden md:flex gap-8 text-white">
            <Link href="/#features" className="hover:text-purple-300 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-purple-300 transition-colors">
              How It Works
            </Link>
            <Link href="/#pricing" className="hover:text-purple-300 transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex gap-4">
            <Link href="/chat">
              <Button variant="outline" className="text-wh border-purple-500 hover:bg-purple-900">
                Try Now
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

