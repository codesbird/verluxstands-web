"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Project {
    title: string;
    image: string;
}

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.getAttribute("data-index"));
                    if (entry.isIntersecting) {
                        setVisibleItems((prev) =>
                            prev.includes(index) ? prev : [...prev, index]
                        );
                    }
                });
            },
            { threshold: 0.2 }
        );

        refs.current.forEach((el) => el && observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((project, index) => (
                <div
                    key={index}
                    data-index={index}
                    ref={(el) => (refs.current[index] = el)}
                    className={`group transition-all duration-300 ease-out
                    ${visibleItems.includes(index)
                            ?
                            "scale-100 opacity-100"
                            :
                            "scale-95 opacity-0"
                        }`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                >
                    <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </div>
            ))}
        </div>
    );
}