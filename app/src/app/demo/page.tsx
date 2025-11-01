"use client";

import BlurFade from "@/components/magicui/blur-fade";
import DockDemo from "@/components/magicui/dock-demo";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center py-20">
          <BlurFade delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              MagicUI Components Demo
            </h1>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
              Showcasing the dock component with magnification effects
            </p>
          </BlurFade>
        </section>

        {/* Dock Demo Section */}
        <section className="space-y-6">
          <BlurFade delay={0.3}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Dock Component</h2>
              <p className="text-muted-foreground">
                Hover over the icons to see the magnification effect
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex justify-center">
              <DockDemo />
            </div>
          </BlurFade>
        </section>

        {/* Blur Fade Demo */}
        <section className="space-y-6">
          <BlurFade delay={0.5}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Blur Fade Animation</h2>
              <p className="text-muted-foreground">
                Smooth entrance animation with blur effect
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.6}>
            <div className="p-8 bg-primary/5 rounded-lg text-center border">
              <p className="text-lg">This content appears with a smooth blur fade effect</p>
            </div>
          </BlurFade>
        </section>
      </div>
    </div>
  );
}
