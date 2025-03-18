"use client"

import { useState, useRef, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, History, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface UserProfileProps {
  onShowScenesHistory: () => void
}

export default function UserProfile({ onShowScenesHistory }: UserProfileProps) {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const handleScenesHistory = () => {
    setIsDropdownOpen(false)
    onShowScenesHistory()
  }

  if (status === "loading") {
    return <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse"></div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex gap-2">
        <Link href="/login">
          <Button variant="outline" className="text-white border-purple-500 hover:bg-purple-900">
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-white/10 rounded-full p-1 pr-3"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Avatar className="h-8 w-8 border border-white/20">
          <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
            {session?.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hidden sm:inline-block">{session?.user?.name}</span>
        <ChevronDown className="h-4 w-4 text-white/70" />
      </Button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-md bg-white/10 backdrop-blur-md border border-white/20 shadow-lg z-50"
          >
            <div className="p-2">
              <div className="p-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                <p className="text-xs text-white/70 truncate">{session?.user?.email}</p>
              </div>
              <div className="mt-2 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={handleScenesHistory}
                >
                  <History className="mr-2 h-4 w-4" />
                  Scenes History
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={handleSignOut}
                >

                  
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

