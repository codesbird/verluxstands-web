'use client';

import Image from 'next/image';

export default function GeomapNetwork() {
  const locations = [
    { name: 'Delhi/NCR', color: '#A02D38' },
    { name: 'Mumbai', color: '#A02D38' },
    { name: 'Bengaluru', color: '#A02D38' },
    { name: 'Kolkata', color: '#A02D38' },
    { name: 'Chennai', color: '#A02D38' },
    { name: 'Hyderabad', color: '#A02D38' },
    { name: 'Ahmedabad', color: '#A02D38' },
  ];

  return (
    <section className="bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Major Exhibiting Cities
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Major destination cities host world-class exhibitions that attract international audiences and deliver strong ROI for exhibitors.
          </p>
        </div>

        {/* World Map with Locations */}
        <div className="relative w-full mb-16 sm:mb-20">
          {/* Map Background */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg overflow-hidden">
            {/* Map SVG Background - Simplified */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 600"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Simple world map representation */}
              <g className="opacity-30 fill-blue-400">
                {/* Europe */}
                <path d="M 400 200 L 500 180 L 520 240 L 480 260 L 400 200" />
                {/* North America */}
                <path d="M 100 150 L 150 140 L 160 220 L 120 230 L 100 150" />
                {/* South America */}
                <path d="M 180 280 L 210 270 L 220 380 L 190 390 L 180 280" />
                {/* Africa */}
                <path d="M 450 280 L 550 260 L 560 400 L 480 420 L 450 280" />
                {/* Asia */}
                <path d="M 550 150 L 750 140 L 800 280 L 620 300 L 550 150" />
              </g>
            </svg>

            {/* Location Pins - Red Badges */}
            <div className="absolute inset-0">
              {/* Delhi/NCR */}
              <div className="absolute top-[25%] left-[38%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#A02D38] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 whitespace-nowrap">
                    DELHI/NCR
                  </div>
                  <div className="w-4 h-4 bg-[#A02D38] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>

              {/* Mumbai */}
              <div className="absolute top-[28%] left-[42%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#A02D38] text-white text-xs font-bold px-2 py-1 rounded-full mb-2 whitespace-nowrap">
                    MUMBAI
                  </div>
                  <div className="w-4 h-4 bg-[#A02D38] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>

              {/* Bengaluru */}
              <div className="absolute top-[35%] left-[30%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#A02D38] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 whitespace-nowrap">
                    BENGALURU
                  </div>
                  <div className="w-4 h-4 bg-[#A02D38] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>

              {/* Kolkata */}
              <div className="absolute top-[32%] left-[35%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#A02D38] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 whitespace-nowrap">
                    KOLKATA
                  </div>
                  <div className="w-4 h-4 bg-[#A02D38] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>

              {/* Chennai */}
              <div className="absolute top-[28%] left-[44%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#A02D38] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 whitespace-nowrap">
                    CHENNAI
                  </div>
                  <div className="w-4 h-4 bg-[#A02D38] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>

              {/* Hyderabad */}
              <div className="absolute top-[38%] left-[42%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#A02D38] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 whitespace-nowrap">
                    HYDERABAD
                  </div>
                  <div className="w-4 h-4 bg-[#A02D38] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>

              {/* Ahmedabad */}
              <div className="absolute top-[40%] left-[28%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#A02D38] text-white text-xs font-bold px-2 py-1 rounded-full mb-2 whitespace-nowrap">
                    AHMEDABAD
                  </div>
                  <div className="w-4 h-4 bg-[#A02D38] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>

              {/* Additional points for visual interest */}
              <div className="absolute top-[45%] left-[55%] w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-lg opacity-60" />
              <div className="absolute top-[50%] left-[60%] w-2 h-2 bg-blue-400 rounded-full border border-white opacity-50" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
