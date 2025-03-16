"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for beginners",
    features: [
      "5 videos per month",
      "720p video quality",
      "Basic editing tools",
      "Standard templates",
      "Email support",
    ],
    popular: false,
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    description: "For serious content creators",
    features: [
      "30 videos per month",
      "1080p video quality",
      "Advanced editing tools",
      "Premium templates",
      "Priority support",
      "Custom branding",
    ],
    popular: true,
    buttonText: "Get Pro",
  },
  {
    name: "Business",
    price: "$79",
    description: "For teams and businesses",
    features: [
      "Unlimited videos",
      "4K video quality",
      "All editing features",
      "Custom templates",
      "Dedicated support",
      "Team collaboration",
      "API access",
    ],
    popular: false,
    buttonText: "Contact Sales",
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-950 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Simple{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Pricing
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-950 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the plan that works best for you
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-xl overflow-hidden ${
                plan.popular
                  ? "border-2 border-pink-400/50 relative bg-white/15 backdrop-blur-sm shadow-xl shadow-purple-700/20"
                  : "border border-white/20 bg-white/10 backdrop-blur-sm shadow-lg shadow-purple-700/10"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02, boxShadow: "0 15px 30px -10px rgba(168,85,247,0.3)" }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-center py-1.5 text-sm font-medium shadow-md">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-950 mb-2">{plan.name}</h3>
                <p className="text-gray-950 mb-6">{plan.description}</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-gray-950">{plan.price}</span>
                  <span className="text-white/70 ml-1 mb-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-950">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-6 transition-all duration-300 hover:scale-[1.02] ${
                    plan.popular
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-lg shadow-yellow-700/30"
                      : "bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-md shadow-yellow-700/20 text-gray-950"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

