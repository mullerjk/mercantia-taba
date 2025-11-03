"use client"

import { Dock, DockIcon } from "../../components/magicui/dock"
import { Marquee } from "../../components/magicui/marquee"
import BlurFade from "../../components/magicui/blur-fade"
import { FlickeringGrid } from "../../components/magicui/flickering-grid"
import { FileText, Settings, Home, User, Mail } from "lucide-react"

export default function MagicUIDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 space-y-12">
      {/* Dock Demo */}
      <div className="flex justify-center">
        <Dock className="mt-8">
          <DockIcon>
            <Home className="h-5 w-5" />
          </DockIcon>
          <DockIcon>
            <User className="h-5 w-5" />
          </DockIcon>
          <DockIcon>
            <Mail className="h-5 w-5" />
          </DockIcon>
          <DockIcon>
            <FileText className="h-5 w-5" />
          </DockIcon>
          <DockIcon>
            <Settings className="h-5 w-5" />
          </DockIcon>
        </Dock>
      </div>

      {/* Marquee Demo */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">MagicUI Components Working!</h2>
        <BlurFade delay={0.25}>
          <div className="text-white text-lg">
            <Marquee className="py-4">
              <p className="text-xl font-semibold mr-8">🚀 MagicUI + Next.js + TypeScript</p>
              <p className="text-xl font-semibold mr-8">✨ Beautiful animations</p>
              <p className="text-xl font-semibold mr-8">🎨 Modern UI components</p>
              <p className="text-xl font-semibold mr-8">⚡ Performance optimized</p>
            </Marquee>
          </div>
        </BlurFade>
      </div>

      {/* Flickering Grid Demo */}
      <div className="relative">
        <div className="absolute inset-0">
          <FlickeringGrid
            className="z-0 flex justify-center items-center w-full h-full"
            squareSize={4}
            gridGap={12}
            color="#60A5FA"
            maxOpacity={0.5}
            flickerChance={0.1}
          />
        </div>
        <div className="relative z-10 text-center text-white py-20">
          <BlurFade delay={0.5}>
            <h3 className="text-4xl font-bold mb-4">Flickering Grid Effect</h3>
            <p className="text-xl opacity-80">Powered by MagicUI</p>
          </BlurFade>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <BlurFade delay={0.75}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
            ✅ MagicUI Integration Complete!
          </div>
        </BlurFade>
      </div>
    </div>
  )
}
