"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Info } from "lucide-react"

interface ApiQuotaModalProps {
  isVisible: boolean
  onClose: () => void
}

export default function ApiQuotaModal({ isVisible, onClose }: ApiQuotaModalProps) {
  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold flex items-center text-gray-800">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            API Quota Information
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>You can monitor your Mistral API quota usage in the Mistral AI Platform:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to{" "}
              <a
                href="https://console.mistral.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Mistral AI Console
              </a>
            </li>
            <li>Navigate to the &quot;API Keys&quot; section</li>
            <li>View your usage statistics and remaining quota</li>
          </ol>
          <p>The free tier typically includes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Limited number of tokens per month</li>
            <li>Rate limits on API calls</li>
          </ul>
          <p className="text-yellow-600">
            If you exceed your quota, API calls will return an error until the quota resets or you upgrade your plan.
          </p>
        </div>

        <div className="space-y-4 mt-4 text-gray-700">
          <p>You can also monitor your Serper API quota usage:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to{" "}
              <a
                href="https://serper.dev/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Serper Dashboard
              </a>
            </li>
            <li>Navigate to the &quot;API Usage&quot; section</li>
            <li>View your usage statistics and remaining quota</li>
          </ol>
        </div>
      </motion.div>
    </motion.div>
  )
}

