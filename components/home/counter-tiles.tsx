"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Globe, FolderKanban, Maximize } from "lucide-react";

export default function CounterTiles() {
  const [counts, setCounts] = useState({
    experience: 0,
    countries: 0,
    projects: 0,
    designs: 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const stats = [
    {
      number: 15,
      suffix: "+",
      label: "YEARS OF EXPERIENCE",
      icon: <Briefcase size={28} />,
      key: "experience",
    },
    {
      number: 14,
      suffix: "+",
      label: "COUNTRIES SERVED",
      icon: <Globe size={28} />,
      key: "countries",
    },
    {
      number: 1000,
      suffix: "+",
      label: "PROJECTS COMPLETED",
      icon: <FolderKanban size={28} />,
      key: "projects",
    },
    {
      number: 2500,
      suffix: "+",
      label: "NO. OF DESIGNS",
      icon: <Maximize size={28} />,
      key: "designs",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animateCounters = () => {
    const duration = 2000;
    const startTime = Date.now();

    const targets = {
      experience: 15,
      countries: 14,
      projects: 1000,
      designs: 2500,
    };

    const update = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);

      setCounts({
        experience: Math.floor(targets.experience * progress),
        countries: Math.floor(targets.countries * progress),
        projects: Math.floor(targets.projects * progress),
        designs: Math.floor(targets.designs * progress),
      });

      if (progress < 1) requestAnimationFrame(update);
    };

    update();
  };

  return (
    <section ref={sectionRef} className="">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-t shadow-lg">
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className={`flex items-center gap-4 px-6 py-6 
              bg-primary/70 text-white 
              ${index !== stats.length - 1 ? "lg:border-r lg:border-white/20" : ""}
              hover:bg-primary/80 transition-all duration-300`}
            >
              {/* Icon */}
              <div className="opacity-90">{stat.icon}</div>

              {/* Text */}
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold leading-none">
                  {counts[stat.key as keyof typeof counts]}
                  <span className="text-xl ml-1">{stat.suffix}</span>
                </div>
                <p className="text-xs tracking-wide mt-1 uppercase text-white/90">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}