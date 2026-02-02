"use client"

import { useContext, createContext, useEffect, useState } from "react"

type SidebarContextType = {
    isOpen: boolean,
    isMobile: boolean,
    toggleSidebar: () => void
}

const SidebarToggleContext = createContext<SidebarContextType>({
    isOpen: true,
    isMobile: false,
    toggleSidebar: () => { },
})

export function SidebarToggleProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const isMobile = window.innerWidth < 868
        setIsOpen(isMobile)   // mobile = false, desktop = true
        setIsOpen(!isOpen)   // mobile = false, desktop = true
    }, [])

    const toggleSidebar = () => {
        setIsOpen(prev => !prev)
    }

    return (
        <SidebarToggleContext.Provider value={{ isOpen, isMobile, toggleSidebar }}>
            {children}
        </SidebarToggleContext.Provider>
    )
}

export default function useSidebarToggle() {
    return useContext(SidebarToggleContext)
}
