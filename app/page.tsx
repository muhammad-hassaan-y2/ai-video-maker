import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/feature-section"
import HowItWorksSection from "@/components/how-it-section"
import TestimonialsSection from "@/components/testimonials-section"
import PricingSection from "@/components/pricing-section"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <Navbar />

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
      </main>

      <footer className="container mx-auto py-12 px-4 text-center text-white/70">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <p>© 2025 AIVideoGen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

