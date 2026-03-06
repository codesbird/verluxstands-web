import React from "react";


const CTAButton = ({ children }) => {
    return (
        <button className="group relative overflow-hidden flex items-center gap-2 
      bg-red-700 text-white font-semibold px-6 py-3 rounded-md 
      shadow-md transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-2xl hover:-translate-y-1">

            {/* Shine Effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
        translate-x-[-100%] group-hover:translate-x-[100%] 
        transition-transform duration-700 ease-out"></span>

            {/* Button Text */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                </span>
            </span>
        </button>
    );
};

const CTASection = () => {
    return (
        <div className="px-6 md:px-10">
            <div
                className="relative h-44 md:h-48 rounded-3xl overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Italy-img.jpg)",
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-black/80"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row w-full items-center justify-center md:justify-around gap-4 h-full px-6">
                        <CTAButton>GET FREE DESIGN</CTAButton>
                        <CTAButton>REQUEST QUOTE</CTAButton>
                        <CTAButton>REQUEST A CALLBACK</CTAButton>
                </div>
            </div>
        </div>
    );
};

export default CTASection;