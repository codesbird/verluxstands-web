"use client"

import { useState, useEffect } from "react"
import { getEventContent } from "@/lib/server/events"
import { Globe } from "lucide-react"
import { CTAButton } from "@/components/common/quick-actions"

// ─── Block Renderers ──────────────────────────────────────────────────────────

function RenderHeading({ block }: { block: any }) {
    const baseClass = "font-bold leading-tight"
    const styles: Record<string, string> = {
        h2: `text-3xl md:text-4xl ${baseClass} text-primary border-l-4 border-primary pl-4`,
        h3: `text-2xl md:text-3xl ${baseClass} text-primary`,
        h4: `text-xl md:text-2xl ${baseClass} text-primary/80`,
    }
    const align: Record<string, string> = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }

    const Tag = block.level as keyof JSX.IntrinsicElements
    return (
        <Tag className={`${styles[block.level] ?? styles.h2} ${align[block.align] ?? "text-left"}`}>
            {block.text}
        </Tag>
    )
}

function RenderText({ block }: { block: any }) {
    return (
        <div
            className="event-rich-text prose-invert max-w-none text-gray-700 leading-relaxed text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: block.html }}
        />
    )
}

function RenderImage({ block }: { block: any }) {
    if (!block.url) return null
    const widthClass: Record<string, string> = {
        full: "w-full",
        wide: "w-full md:w-[85%] mx-auto",
        medium: "w-full md:w-[60%] mx-auto",
    }
    return (
        <figure className={widthClass[block.width] ?? "w-full"}>
            <div className="overflow-hidden rounded-lg border border-white/10 shadow-2xl">
                <img
                    src={block.url}
                    alt={block.alt || block.caption || ""}
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                />
            </div>
            {block.caption && (
                <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
                    {block.caption}
                </figcaption>
            )}
        </figure>
    )
}

function RenderVideo({ block }: { block: any }) {
    const getEmbedUrl = (url: string) => {
        const yt = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        if (yt) return `https://www.youtube.com/embed/${yt[1]}`
        const vm = url?.match(/vimeo\.com\/(\d+)/)
        if (vm) return `https://player.vimeo.com/video/${vm[1]}`
        return null
    }
    const embed = getEmbedUrl(block.url)
    if (!embed) return null

    return (
        <figure className="w-full">
            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                style={{ aspectRatio: "16/9" }}>
                {/* Red corner accent */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-10" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-10" />
                <iframe
                    src={embed}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title={block.caption || "Event video"}
                />
            </div>
            {block.caption && (
                <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
                    {block.caption}
                </figcaption>
            )}
        </figure>
    )
}

function RenderQuote({ block }: { block: any }) {
    return (
        <blockquote className="relative pl-6 border-l-4 border-primary bg-white/[0.03] shadow-sm rounded-r-xl py-6 pr-6">
            {/* Decorative quote mark */}
            <span className="absolute top-3 right-5 text-6xl text-primary/90 font-serif leading-none select-none">
                &rdquo;
            </span>
            <p className="text-lg md:text-xl text-primary italic leading-relaxed mb-4">
                &ldquo;{block.text}&rdquo;
            </p>
            {block.author && (
                <footer className="flex items-center gap-3">
                    <div className="w-6 h-px bg-primary" />
                    <div>
                        <span className="text-black/70 font-semibold text-sm">{block.author}</span>
                        {block.role && (
                            <span className="text-gray-700 text-sm"> · {block.role}</span>
                        )}
                    </div>
                </footer>
            )}
        </blockquote>
    )
}

function RenderStats({ block }: { block: any }) {
    return (
        <div
            className="grid gap-px bg-primary/30 rounded-xl overflow-hidden border border-primary/20"
            style={{ gridTemplateColumns: `repeat(${Math.min(block.items.length, 4)}, 1fr)` }}
        >
            {block.items.map((item: any, i: number) => (
                <div
                    key={i}
                    className="bg-[#0d0d0d] px-6 py-8 text-center group hover:bg-primary/10 transition-colors duration-300"
                >
                    <div className="text-3xl md:text-4xl font-extrabold text-primary leading-none mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                        {item.value}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    )
}

function RenderColumns({ block }: { block: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
                className="event-rich-text prose-invert text-gray-300 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: block.left }}
            />
            <div
                className="event-rich-text prose-invert text-gray-300 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: block.right }}
            />
        </div>
    )
}

const CTABackground = ({ children }) => {
    return (
        <div className="px-6 md:px-10 py-8">
            <div
                className="relative h-52 md:h-48 rounded-3xl overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Italy-img.jpg)",
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-black/80"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row w-full items-center justify-center md:justify-around gap-4 h-full px-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

function RenderCTA({ block }: { block: any }) {
    const alignClass: Record<string, string> = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
    }

    const variants: Record<string, string> = {
        primary: "bg-primary text-white hover:bg-red-700 shadow-lg shadow-primary/30",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
        outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white",
    }

    return (
        <CTAButton>Get Free Quote</CTAButton>
    )
}

function RenderDivider() {
    return (
        <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <div className="w-2 h-2 rotate-45 bg-primary shrink-0" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>
    )
}

function RenderList({ block }: { block: any }) {
    const Tag = block.ordered ? "ol" : "ul"
    return (
        <Tag className={`space-y-2 text-gray-300 text-base leading-relaxed ${block.ordered ? "list-decimal pl-5" : "list-none pl-0"}`}>
            {block.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                    {!block.ordered && (
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                    <span>{item}</span>
                </li>
            ))}
        </Tag>
    )
}

// ─── Block Router ─────────────────────────────────────────────────────────────
function RenderBlock({ block }: { block: any }) {

    switch (block.type) {
        case "heading": return <RenderHeading block={block} />
        case "text": return <RenderText block={block} />
        case "image": return <RenderImage block={block} />
        case "video": return <RenderVideo block={block} />
        case "quote": return <RenderQuote block={block} />
        case "stats": return <RenderStats block={block} />
        case "columns": return <RenderColumns block={block} />
        case "cta": return <RenderCTA block={block} />
        case "divider": return <RenderDivider />
        case "list": return <RenderList block={block} />
        default: return null
    }
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function ContentSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-2/3 bg-white/5 rounded" />
            <div className="space-y-3">
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-3/4 bg-white/5 rounded" />
            </div>
            <div className="h-48 w-full bg-white/5 rounded-xl" />
            <div className="space-y-3">
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-5/6 bg-white/5 rounded" />
            </div>
            <div className="grid grid-cols-4 gap-px">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-white/5 rounded" />
                ))}
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TradeShowDetailsSection({ slug }: { slug: string }) {
    const [blocks, setBlocks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return
        setLoading(true)

        getEventContent(slug)
            .then((res) => {
                if (res.success) setBlocks(res.blocks ?? [])
                else console.warn("Could not load content:", res.message)
            })
            .catch((err) => console.error("Failed to fetch event content:", err))
            .finally(() => setLoading(false))
    }, [slug])

    if (loading) return <ContentSkeleton />

    if (!blocks.length) return null

    return (
        <>
            {/* Prose styles for rich text blocks */}
            <style>{`
                .event-rich-text p  { margin-bottom: 1em; }
                .event-rich-text h2 { font-size: 1.5rem; font-weight: 700; color: @A21E22; margin: 1.25em 0 .5em; }
                .event-rich-text h3 { font-size: 1.25rem; font-weight: 600; color: #A21E22; margin: 1em 0 .4em; }
                .event-rich-text ul { list-style: disc; padding-left: 1.4em; margin-bottom: 1em; }
                .event-rich-text ol { list-style: decimal; padding-left: 1.4em; margin-bottom: 1em; }
                .event-rich-text li { margin-bottom: .35em; }
                .event-rich-text a  { color: #cc2222; text-decoration: underline; }
                .event-rich-text strong { color: #424242; font-weight: 700; }
                .event-rich-text em { font-style: italic; color: #464646; }
            `}</style>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3 p-3 px-1 md:px-6 grid-cols-1">
                <div className="lg:col-span-2 p-3 order-2">
                    <div className="flex flex-col gap-10">
                        {blocks.filter((block) => block.type !== "video").map((block) => (
                            <div key={block.id} >
                                <RenderBlock block={block} />
                            </div>
                        ))}
                        {/* <Portfolio /> */}

                    </div>
                </div>

                <div className="flex flex-col gap-3 order-1 md:order-3">
                    {blocks.filter((block) => block.type === "video").map((block) => (

                        <div key={block.id}>
                            <RenderBlock block={block} />
                        </div>
                    ))}
                    <div className="p-3 ">
                        <div className="py-3 px-3 bg-primary rounded-lg">
                            <h3 className="text-white text-lg uppercase font-black" >Exhibition Info</h3>
                        </div>
                        <div className="mt-4 pl-2">
                            {[
                                {
                                    "icon": "",
                                    "heading": "Exhibition",
                                    "content": "Tube Düsseldorf 2026"
                                },
                                {
                                    "icon": "",
                                    "heading": "Exhibition",
                                    "content": "Tube Düsseldorf 2026"
                                },
                                {
                                    "icon": "",
                                    "heading": "Exhibition",
                                    "content": "Tube Düsseldorf 2026"
                                },
                                {
                                    "icon": "",
                                    "heading": "Exhibition",
                                    "content": "Tube Düsseldorf 2026"
                                },
                                {
                                    "icon": "",
                                    "heading": "Date",
                                    "content": "13th Apr to 17th Apr 2026"
                                },
                            ].map((item, index) => (
                                <div className="flex flex-wrap gap-2" key={item.content + index}>
                                    <div><Globe className="text-primary" size={20} /></div>
                                    <div className="text-black/90 font-semibold  text-lg">{item.heading}:-</div>
                                    <div className="text-[17px]">{item.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div >
        </>
    )
}