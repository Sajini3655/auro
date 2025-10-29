"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen w-full m-0 p-0">
      
      
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Aura Clothing Hero"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute text-center z-10 px-4 w-full flex flex-col items-center justify-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wide text-purple-400 animate-fade-in">
            AURA
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-200 animate-slide-up">
            Redefining Dark Streetwear
          </p>
          <Link
            href="/collections/men"
            className="mt-8 px-8 py-3 bg-purple-600 rounded-full text-white font-semibold hover:bg-purple-700 transition transform hover:scale-105"
          >
            Explore Collections
          </Link>
        </div>
        
        <div className="absolute top-10 left-10 w-24 h-24 bg-purple-500 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-500 rounded-full opacity-20 animate-pulse-slow"></div>
      </section>


      <section className="bg-gray-800 text-gray-300 py-24 w-full">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 animate-slide-up">
            Why Choose AURA?
          </h2>
          <p className="mb-4 text-lg sm:text-xl animate-fade-in-delay">
            At AURA, we craft every piece with attention to detail and a passion for dark streetwear.
            Unique designs, quality fabrics, and styles that make you stand out.
          </p>
          <p className="text-lg sm:text-xl animate-fade-in-delay">
            Explore our collections and find your perfect outfit. Fashion that speaks your vibe.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-400 mb-12 animate-slide-up">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            
            <Link
              href="/collections/men"
              className="group block rounded-xl overflow-hidden shadow-2xl bg-gray-800 hover:scale-105 transform transition-all duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src="/images/men1.jpg"
                  alt="Men Collection"
                  fill
                  className="object-cover w-full h-full group-hover:brightness-110 transition"
                />
              </div>
              <div className="p-4 text-white font-semibold text-lg text-center">
                Men
              </div>
            </Link>

            <Link
              href="/collections/women"
              className="group block rounded-xl overflow-hidden shadow-2xl bg-gray-800 hover:scale-105 transform transition-all duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src="/images/women1.jpg"
                  alt="Women Collection"
                  fill
                  className="object-cover w-full h-full group-hover:brightness-110 transition"
                />
              </div>
              <div className="p-4 text-white font-semibold text-lg text-center">
                Women
              </div>
            </Link>

            <Link
              href="/collections/sale"
              className="group block rounded-xl overflow-hidden shadow-2xl bg-gray-800 hover:scale-105 transform transition-all duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src="/images/sale1.jpg"
                  alt="Sale Collection"
                  fill
                  className="object-cover w-full h-full group-hover:brightness-110 transition"
                />
              </div>
              <div className="p-4 text-white font-semibold text-lg text-center">
                Sale
              </div>
            </Link>

          </div>
        </div>
      </section>


      <style jsx>{`
        .animate-fade-in { animation: fadeIn 1.2s ease forwards; }
        .animate-slide-up { animation: slideUp 1s ease forwards; }
        .animate-fade-in-delay { animation: fadeIn 1.2s ease 0.5s forwards; }
        .animate-pulse-slow { animation: pulseSlow 6s ease-in-out infinite; }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
