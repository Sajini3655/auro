'use client'

export default function HeroSection() {
  return (
    <section className="hero-bg h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">AURA</h1>
        <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
          Dark. Bold. Fearless. Clothing that defines your presence.
        </p>
        <a href="/products" className="mt-8 inline-block px-8 py-3 bg-[#ff3b8a] text-black font-semibold rounded-lg">
          Explore Collection
        </a>
      </div>
    </section>
  )
}
