"use client"

import { usePopup } from "@/context/popup-context"
import Link from "next/link"
import { ReactNode } from "react"

interface QuoteButtonProps {
    name?: string
    type?: "link" | "button"
    iconpos?: "start" | "end"
    link?: string
    className?: string
    click?: () => void
    icon?: ReactNode
}

export default function QuoteButton({
    name = "Add name",
    type = "link",
    link = "/",
    className = "btn-dark",
    click,
    iconpos = "start",
    icon,
}: QuoteButtonProps) {
    const { openQuotePopup } = usePopup()

    const handleClick = click || openQuotePopup

    const content = (
        <>
            {icon && iconpos === "start" && icon}
            <span>{name}</span>
            {icon && iconpos === "end" && icon}
        </>
    )

    const baseClasses = `text-sm lw-40 h-10 flex items-center gap-2 ${className}`

    if (type === "button") {
        return (
            <button onClick={handleClick} className={baseClasses}>
                {content}
            </button>
        )
    }

    return (
        <Link href={link} className={baseClasses}>
            {content}
        </Link>
    )
}