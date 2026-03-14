"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { X, User, Building2, Mail, Phone, MessageSquare, Paperclip, Send, ChevronDown, Download } from "lucide-react"
import { usePathname } from "next/navigation"
/* ── CONFIG ── */
const FIRST_SHOW_DELAY_MS = 3 * 1000
const REPEAT_INTERVAL_MS = 3 * 60 * 1000
const STORAGE_KEY = "freeQuoteSubmitted"

/* ── COUNTRY CODES ── */
const countryCodes = [
    { code: "+91", flag: "🇮🇳", name: "IN" },
    { code: "+1", flag: "🇺🇸", name: "US" },
    { code: "+44", flag: "🇬🇧", name: "GB" },
    { code: "+971", flag: "🇦🇪", name: "AE" },
    { code: "+49", flag: "🇩🇪", name: "DE" },
    { code: "+33", flag: "🇫🇷", name: "FR" },
    { code: "+86", flag: "🇨🇳", name: "CN" },
    { code: "+65", flag: "🇸🇬", name: "SG" },
    { code: "+61", flag: "🇦🇺", name: "AU" },
    { code: "+81", flag: "🇯🇵", name: "JP" },
]

/* ── TYPES ── */
type ActivePopup = "quote" | "brochure" | null

interface QuoteFormData {
    contactName: string
    companyName: string
    email: string
    phone: string
    countryCode: string
    message: string
    file: File | null
}

interface BrochureFormData {
    contactName: string
    companyName: string
    email: string
    phone: string
    countryCode: string
}

/* ── CONTEXT ── */
interface PopupContextType {
    openQuotePopup: () => void
    closeQuotePopup: () => void
    openBrochurePopup: () => void
    closeBrochurePopup: () => void
}

const PopupContext = createContext<PopupContextType>({
    openQuotePopup: () => { },
    closeQuotePopup: () => { },
    openBrochurePopup: () => { },
    closeBrochurePopup: () => { },
})

export function usePopup() {
    return useContext(PopupContext)
}

/* ── PROVIDER ── */
export function PopupProvider({ children }: { children: React.ReactNode }) {
    const [activePopup, setActivePopup] = useState<ActivePopup>(null)
    const [closing, setClosing] = useState(false)
    const [quoteSubmitted, setQuoteSubmitted] = useState(false)
    const [brochureSubmitted, setBrochureSubmitted] = useState(false)
    const [shake, setShake] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [fileLabel, setFileLabel] = useState("No file chosen")
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const pathaname = usePathname()


    const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
        contactName: "", companyName: "", email: "",
        phone: "", countryCode: "+91", message: "", file: null,
    })
    const [quoteErrors, setQuoteErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({})

    const [brochureForm, setBrochureForm] = useState<BrochureFormData>({
        contactName: "", companyName: "", email: "", phone: "", countryCode: "+91",
    })
    const [brochureErrors, setBrochureErrors] = useState<Partial<Record<keyof BrochureFormData, string>>>({})

    /* ── Open / Close ── */
    const closeActive = useCallback((afterClose?: () => void) => {
        setClosing(true)
        setTimeout(() => {
            setActivePopup(null)
            setClosing(false)
            setDropdownOpen(false)
            afterClose?.()
        }, 350)
        document.body.classList.remove('overflow-hidden');
    }, [])

    const openQuotePopup = useCallback(() => {
        const alreadySubmitted = sessionStorage.getItem(STORAGE_KEY) === "true"
        if (!alreadySubmitted && activePopup === null) setActivePopup("quote")
        document.body.classList.add('overflow-hidden');

    }, [activePopup])

    const closeQuotePopup = useCallback(() => {
        closeActive(() => {
            setQuoteSubmitted(false)
            setQuoteForm({ contactName: "", companyName: "", email: "", phone: "", countryCode: "+91", message: "", file: null })
            setQuoteErrors({})
            setFileLabel("No file chosen")
            document.body.classList.remove('overflow-hidden');
        })
    }, [closeActive])

    const openBrochurePopup = useCallback(() => {
        setActivePopup("brochure")
        document.body.classList.add('overflow-hidden');

    }, [])

    const closeBrochurePopup = useCallback(() => {
        closeActive(() => {
            setBrochureSubmitted(false)
            setBrochureForm({ contactName: "", companyName: "", email: "", phone: "", countryCode: "+91" })
            setBrochureErrors({})
            document.body.classList.remove('overflow-hidden');
        })
    }, [closeActive])

    /* ── Auto-show quote ── */
    const hasShownInitial = useRef(false)

    useEffect(() => {
        if (pathaname.includes("admin")) return
        if (hasShownInitial.current) return
        hasShownInitial.current = true

        const initial = setTimeout(() => {
            const alreadySubmitted = sessionStorage.getItem(STORAGE_KEY) === "true"
            if (!alreadySubmitted) setActivePopup("quote")
            document.body.classList.add('overflow-hidden');

        }, FIRST_SHOW_DELAY_MS)

        timerRef.current = setInterval(() => {
            const alreadySubmitted = sessionStorage.getItem(STORAGE_KEY) === "true"
            if (!alreadySubmitted && activePopup === null) setActivePopup("quote")
            document.body.classList.add('overflow-hidden');

        }, REPEAT_INTERVAL_MS)

        return () => {
            clearTimeout(initial)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, []) // ← empty dependency array, runs once only

    /* ── Escape key ── */
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && activePopup !== null) {
                activePopup === "quote" ? closeQuotePopup() : closeBrochurePopup()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [activePopup, closeQuotePopup, closeBrochurePopup])

    /* ── Outside dropdown click ── */
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    /* ── Quote form handlers ── */
    function handleQuoteChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setQuoteForm(f => ({ ...f, [name]: value }))
        setQuoteErrors(er => ({ ...er, [name]: "" }))
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null
        setQuoteForm(f => ({ ...f, file }))
        setFileLabel(file ? file.name : "No file chosen")
    }

    function validateQuote(): boolean {
        const newErrors: Partial<Record<keyof QuoteFormData, string>> = {}
        if (!quoteForm.contactName.trim()) newErrors.contactName = "Required"
        if (!quoteForm.companyName.trim()) newErrors.companyName = "Required"
        if (!quoteForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email required"
        if (!quoteForm.phone.match(/^\d{7,15}$/)) newErrors.phone = "Valid phone required"
        if (!quoteForm.message.trim()) newErrors.message = "Please describe your project"
        setQuoteErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleQuoteSubmit() {
        if (!validateQuote()) {
            setShake(true); setTimeout(() => setShake(false), 600); return
        }
        console.log("Quote submitted:", quoteForm)
        sessionStorage.setItem(STORAGE_KEY, "true")
        if (timerRef.current) clearInterval(timerRef.current)
        setQuoteSubmitted(true)
        setTimeout(closeQuotePopup, 2800)
    }

    /* ── Brochure form handlers ── */
    function handleBrochureChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setBrochureForm(f => ({ ...f, [name]: value }))
        setBrochureErrors(er => ({ ...er, [name]: "" }))
    }

    function validateBrochure(): boolean {
        const newErrors: Partial<Record<keyof BrochureFormData, string>> = {}
        if (!brochureForm.contactName.trim()) newErrors.contactName = "Required"
        if (!brochureForm.companyName.trim()) newErrors.companyName = "Required"
        if (!brochureForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email required"
        if (!brochureForm.phone.match(/^\d{7,15}$/)) newErrors.phone = "Valid phone required"
        setBrochureErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleBrochureSubmit() {
        if (!validateBrochure()) {
            setShake(true); setTimeout(() => setShake(false), 600); return
        }
        console.log("Brochure requested:", brochureForm)
        // TODO: trigger download
        // window.open("/brochure.pdf", "_blank")
        setBrochureSubmitted(true)
        setTimeout(closeBrochurePopup, 2500)
    }

    const isVisible = activePopup !== null
    const handleBackdropClick = () => activePopup === "quote" ? closeQuotePopup() : closeBrochurePopup()

    return (
        <PopupContext.Provider value={{ openQuotePopup, closeQuotePopup, openBrochurePopup, closeBrochurePopup }}>
            {children}

            {isVisible && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={handleBackdropClick}
                        className={`fixed inset-0 z-50 bg-[rgba(5,5,5,0.78)] backdrop-blur-md transition-all duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
                    />

                    {/* Panel */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 lg:p-6 pointer-events-none">
                        <div
                            className={`
                                brand-panel relative pointer-events-auto overflow-hidden rounded-[1.75rem] border border-primary/25 text-card-foreground shadow-[0_32px_90px_rgba(0,0,0,0.42)]
                                transition-all duration-350 w-full
                                ${activePopup === "quote" ? "max-w-3xl" : "max-w-xl"}
                                ${closing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}
                                ${shake ? "animate-popup-shake" : ""}
                            `}
                        >
                            {/* Top accent */}
                            <div className="h-px brand-divider" />

                            {/* Close */}
                            <button
                                onClick={handleBackdropClick}
                                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-background/70 text-muted-foreground transition-all hover:border-primary/60 hover:text-secondary"
                            >
                                <X size={16} />
                            </button>

                            <div className="px-4 pb-8 pt-7 md:px-8">
                                {activePopup === "quote" ? (
                                    <QuoteContent
                                        submitted={quoteSubmitted}
                                        form={quoteForm}
                                        errors={quoteErrors}
                                        fileLabel={fileLabel}
                                        dropdownOpen={dropdownOpen}
                                        dropdownRef={dropdownRef}
                                        setDropdownOpen={setDropdownOpen}
                                        setForm={setQuoteForm}
                                        handleChange={handleQuoteChange}
                                        handleFile={handleFile}
                                        handleSubmit={handleQuoteSubmit}
                                    />
                                ) : (
                                    <BrochureContent
                                        submitted={brochureSubmitted}
                                        form={brochureForm}
                                        errors={brochureErrors}
                                        dropdownOpen={dropdownOpen}
                                        dropdownRef={dropdownRef}
                                        setDropdownOpen={setDropdownOpen}
                                        setForm={setBrochureForm}
                                        handleChange={handleBrochureChange}
                                        handleSubmit={handleBrochureSubmit}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @keyframes popup-shake {
                            0%,100% { transform: translateX(0) }
                            15%,45%,75% { transform: translateX(-6px) }
                            30%,60%,90% { transform: translateX(6px) }
                        }
                        .animate-popup-shake { animation: popup-shake 0.55s ease-in-out; }
                    `}</style>
                </>
            )}
        </PopupContext.Provider>
    )
}

/* ── QUOTE CONTENT ── */
function QuoteContent({ submitted, form, errors, fileLabel, dropdownOpen, dropdownRef, setDropdownOpen, setForm, handleChange, handleFile, handleSubmit }: any) {
    return (
        <>
            <h2 className="mb-2 text-center font-serif text-4xl font-bold tracking-wide text-secondary">
                Get <span className="brand-gold-text">Free</span> Quote
            </h2>
            <p className="mb-7 text-center text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Exhibition Stands & Booth Design | No Obligation
            </p>

            {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                        <Send size={28} className="text-primary" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-secondary">Quote Request Sent</p>
                    <p className="max-w-xs text-center text-sm text-muted-foreground">
                        Our team will get back to you within 24 hours with a tailored proposal.
                    </p>
                </div>
            ) : (
                <div>
                    <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Field icon={<User size={14} />} error={errors.contactName}>
                            <input
                                name="contactName"
                                placeholder="Contact Name"
                                value={form.contactName}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                        </Field>

                        <Field icon={<Building2 size={14} />} error={errors.companyName}>
                            <input
                                name="companyName"
                                placeholder="Company Name"
                                value={form.companyName}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                        </Field>

                        <Field icon={<Mail size={14} />} error={errors.email}>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                        </Field>

                        <PhoneField
                            form={form}
                            setForm={setForm}
                            errors={errors}
                            handleChange={handleChange}
                            dropdownOpen={dropdownOpen}
                            dropdownRef={dropdownRef}
                            setDropdownOpen={setDropdownOpen}
                        />
                    </div>

                    <div className="col-span-2">
                        <Field icon={<MessageSquare size={14} />} error={errors.message} tall>
                            <textarea
                                name="message"
                                placeholder="Tell us about your exhibition stand requirements..."
                                value={form.message}
                                onChange={handleChange}
                                rows={3}
                                className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                        </Field>
                    </div>

                    <div className="col-span-2 my-4">
                        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-primary/25 bg-black/15 px-4 py-3 transition-colors hover:border-primary/45 hover:bg-primary/8">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                                <Paperclip size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary/80">Attach brief / reference</p>
                                <p className="truncate text-xs text-muted-foreground">{fileLabel}</p>
                            </div>
                            <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </label>
                    </div>

                    <div className="col-span-2 mt-2">
                        <button onClick={handleSubmit} className="brand-button-dark w-full justify-center rounded-xl text-sm">
                            Submit Request
                        </button>
                        <p className="mt-3 text-center text-xs text-muted-foreground">Your information is secure and never shared.</p>
                    </div>
                </div>
            )}
        </>
    )
}

/* ── BROCHURE CONTENT ── */
function BrochureContent({ submitted, form, errors, dropdownOpen, dropdownRef, setDropdownOpen, setForm, handleChange, handleSubmit }: any) {
    return (
        <>
            <h2 className="mb-2 text-center font-serif text-4xl font-bold tracking-wide text-secondary">
                <span className="brand-gold-text">Download</span> Brochure
            </h2>
            <p className="mb-7 text-center text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Premium stand design portfolio and service overview
            </p>

            {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                        <Download size={28} className="text-primary" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-secondary">Downloading</p>
                    <p className="max-w-xs text-center text-sm text-muted-foreground">
                        Your brochure is ready. Check your downloads folder.
                    </p>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <Field icon={<User size={14} />} error={errors.contactName}>
                            <input
                                name="contactName"
                                placeholder="Contact Name"
                                value={form.contactName}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                        </Field>

                        <Field icon={<Building2 size={14} />} error={errors.companyName}>
                            <input
                                name="companyName"
                                placeholder="Company Name"
                                value={form.companyName}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                        </Field>
                    </div>

                    <div className="my-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <Field icon={<Mail size={14} />} error={errors.email}>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                        </Field>

                        <PhoneField
                            form={form}
                            setForm={setForm}
                            errors={errors}
                            handleChange={handleChange}
                            dropdownOpen={dropdownOpen}
                            dropdownRef={dropdownRef}
                            setDropdownOpen={setDropdownOpen}
                        />
                    </div>

                    <div className="col-span-2 mt-2">
                        <button onClick={handleSubmit} className="brand-button-dark w-full justify-center rounded-xl text-sm">
                            <Download size={16} /> Download Brochure
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

/* ── PHONE FIELD ── */
function PhoneField({ form, setForm, errors, handleChange, dropdownOpen, dropdownRef, setDropdownOpen }: any) {
    const [searchCode, setSearchCode] = useState("")
    return (
        <Field icon={null} error={errors.phone}>
            <div className="flex w-full items-center gap-2">
                <div ref={dropdownRef} className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((d: boolean) => !d)}
                        className="flex items-center gap-1.5 text-xs text-secondary/85 transition-colors hover:text-white"
                    >
                        <span>{countryCodes.find(c => c.code === form.countryCode)?.flag}</span>
                        <span className="font-medium">{form.countryCode}</span>
                        <ChevronDown size={11} />
                    </button>
                    {dropdownOpen && (
                        <div className="brand-panel absolute left-0 top-full z-20 mt-2 max-h-40 min-h-20 w-32 overflow-auto rounded-lg border border-primary/25 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                            <input onChange={(e) => setSearchCode(e.target.value.toLowerCase())} type="search" className="rounded w-full bg-[#1e1b17] border border-1-primary text-xs pl-1 sticky top-0" placeholder="country/code" />

                            {countryCodes.filter((c) => (c.code + c.flag + c.name).toLowerCase().includes(searchCode)).map(c => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => { setForm((f: any) => ({ ...f, countryCode: c.code })); setDropdownOpen(false) }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground transition-colors hover:bg-primary/10 hover:text-secondary"
                                >
                                    <span>{c.flag}</span>
                                    <span className="font-medium">{c.code}</span>
                                    <span className="text-muted-foreground">{c.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="h-4 w-px bg-primary/20" />
                <input
                    name="phone"
                    type="tel"
                    placeholder="Phone No."
                    value={form.phone}
                    onChange={handleChange}
                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
            </div>
        </Field>
    )
}

/* ── FIELD ── */
function Field({ icon, children, error, tall }: {
    icon: React.ReactNode
    children: React.ReactNode
    error?: string
    tall?: boolean
}) {
    const containerClass = tall ? 'items-start pt-3 pb-2.5' : 'items-center py-2.5'
    const stateClass = error
        ? 'border-destructive/60 bg-destructive/10'
        : 'border-primary/20 bg-black/15 hover:border-primary/35 focus-within:border-primary/60 focus-within:bg-black/25'

    return (
        <div>
            <div className={`flex w-full gap-2.5 rounded-xl px-3.5 transition-all ${containerClass} ${stateClass}`} style={{ minHeight: tall ? undefined : 48 }}>
                {icon && <span className={`mt-0.5 shrink-0 ${error ? 'text-destructive' : 'text-primary'}`}>{icon}</span>}
                {children}
            </div>
            {error && <p className="ml-1 mt-1 text-xs text-destructive">{error}</p>}
        </div>
    )
}


