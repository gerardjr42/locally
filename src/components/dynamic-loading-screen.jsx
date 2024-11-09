'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'
import Image from 'next/image'

const friendshipFacts = [
  "People with strong social connections may live up to 15 years longer.",
  "Friendships can reduce the risk of depression by up to 50%.",
  "Having a close friend at work can boost your productivity by 15%.",
  "Socializing regularly can lower your risk of dementia by 26%.",
  "Friends can help reduce stress levels by up to 50%.",
  "People with a best friend at work are 7 times more likely to be engaged in their job.",
  "Laughter with friends can boost your immune system for up to 24 hours.",
  "Strong social ties can increase your chance of surviving a heart attack by 50%.",
  "Friendships can help you recover from illness faster.",
  "People with strong friendships report 55% more happiness in their lives."
]

export function DynamicLoadingScreenComponent() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % friendshipFacts.length)
    }, 5000) // Change fact every 5 seconds

    return () => clearInterval(interval);
  }, [])

  return (
    (<div
      className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0">
        <ParticleBackground />
      </div>
      <div className="z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/images/logo.png"
            alt="Locally Logo"
            width={80}
            height={80}
            className="mx-auto mb-4" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="w-12 h-12 text-teal-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-teal-600 text-center">Finding Compatible Locals...</h2>
          <p className="text-center text-gray-600 text-sm md:text-base">
            Our AI is working hard to find your most compatible matches so you can make a successful Connection!
          </p>
          <p className="text-center text-gray-600 text-sm md:text-base">.Did you know...?</p>
          <div className="h-24 flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFactIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center text-base md:text-lg font-semibold text-teal-700">
                {friendshipFacts[currentFactIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>)
  );
}