"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "AIVideoGen has completely transformed my content creation process. I can now create professional-looking videos in minutes instead of hours!",
    stars: 5,
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The AI understands exactly what I need for my marketing campaigns. The quality of videos is outstanding and saves our team so much time.",
    stars: 5,
  },
  {
    name: "Jessica Williams",
    role: "Social Media Influencer",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "I've tried many video creation tools, but nothing comes close to AIVideoGen. It's intuitive, fast, and the results are amazing.",
    stars: 4,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Users Say
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of content creators who love our platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-lg shadow-purple-700/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02, boxShadow: "0 15px 30px -10px rgba(255,221,64,0.3)" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                  <p className="text-yellow-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                  />
                ))}
              </div>
              <p className="text-white/80 italic">&quot;{testimonial.quote}&quot;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

