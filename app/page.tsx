// Deterministic QR code pattern to avoid flickering on re-renders
const QR_PATTERN = [
  1,0,1,1,0,1,0,1,
  0,1,0,0,1,0,1,0,
  1,0,1,0,1,1,0,1,
  1,1,0,1,0,0,1,0,
  0,1,1,0,1,1,0,1,
  1,0,0,1,0,1,1,0,
  0,1,1,0,1,0,0,1,
  1,0,1,1,0,1,1,0,
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Digital Card, Simplified
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Dynamic QR codes and mobile-first digital card pages for payments, contacts, and links.
            </p>
            <p className="text-base md:text-lg text-gray-500">
              Share your information instantly. No app required. Works anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="button" 
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Get started with Novatok ClickCard"
              >
                Get Started
              </button>
              <button 
                type="button" 
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
                aria-label="Learn more about Novatok ClickCard"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm">
              {/* Card Mock - Mobile Width */}
              <div className="relative">
                {/* Phone/Card Frame */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 aspect-[9/16] flex flex-col justify-between">
                  {/* Card Header */}
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto backdrop-blur-sm"></div>
                    <h3 className="text-white font-bold text-xl">John Doe</h3>
                    <p className="text-white/80 text-sm">Product Designer</p>
                  </div>

                  {/* Card Content - QR Code Placeholder */}
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                      {/* QR Code Pattern Simulation */}
                      <div className="grid grid-cols-8 gap-1 p-4">
                        {QR_PATTERN.map((val, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 ${
                              val ? 'bg-gray-800' : 'bg-white'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-500">
                      Scan to connect
                    </p>
                  </div>

                  {/* Card Footer - Action Icons */}
                  <div className="flex justify-around">
                    <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm"></div>
                    <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm"></div>
                    <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm"></div>
                  </div>
                </div>

                {/* Floating accent element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
