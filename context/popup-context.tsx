"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { X, User, Building2, Mail, Phone, MessageSquare, Paperclip, Send, ChevronDown, Download } from "lucide-react"

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
                        className={`fixed inset-0 z-50 transition-all duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
                        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
                    />

                    {/* Panel */}
                    <div className="fixed z-50 inset-0 flex items-center justify-center p-2 md:p-4 lg:p-4 pointer-events-none">
                        <div
                            className={`
                                relative pointer-events-auto rounded-2xl overflow-hidden
                                transition-all duration-350 w-full
                                ${activePopup === "quote" ? "max-w-3xl" : "max-w-xl"}
                                ${closing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}
                                ${shake ? "animate-popup-shake" : ""}
                            `}
                            style={{
                                background: "#fff",
                                boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)",
                            }}
                        >
                            {/* Top accent */}
                            <div style={{ height: 5, background: "linear-gradient(90deg,#8B0000,#C0392B,#8B0000)" }} />

                            {/* Close */}
                            <button
                                onClick={handleBackdropClick}
                                className="absolute top-5 right-4 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all z-10"
                            >
                                <X size={15} />
                            </button>

                            <div className="px-2 md:px-8 pt-6 pb-7">
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
            <h2 className="text-center text-2xl font-black tracking-tight mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                Get <span style={{ color: "#B91C1C" }}>Free</span>{" "}
                <span className="text-gray-900">Quote</span>
            </h2>
            <p className="text-center text-gray-400 text-xs mb-6 tracking-wide">Exhibition Stands & Booth Design — No Obligation</p>

            {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "#FEE2E2" }}>
                        <Send size={28} style={{ color: "#B91C1C" }} />
                    </div>
                    <p className="text-xl font-bold text-gray-800">Quote Request Sent!</p>
                    <p className="text-gray-400 text-sm text-center max-w-xs">
                        Our team will get back to you within 24 hours with a tailored proposal.
                    </p>
                </div>
            ) : (
                <div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-3">
                        <Field icon={<User size={14} />} error={errors.contactName}>
                            <input name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                        </Field>

                        <Field icon={<Building2 size={14} />} error={errors.companyName}>
                            <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                        </Field>

                        <Field icon={<Mail size={14} />} error={errors.email}>
                            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                        </Field>

                        <PhoneField form={form} setForm={setForm} errors={errors} handleChange={handleChange}
                            dropdownOpen={dropdownOpen} dropdownRef={dropdownRef} setDropdownOpen={setDropdownOpen} />
                    </div>
                    <div className="col-span-2">
                        <Field icon={<MessageSquare size={14} />} error={errors.message} tall>
                            <textarea name="message" placeholder="Tell us about your exhibition stand requirements..."
                                value={form.message} onChange={handleChange} rows={3}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 resize-none" />
                        </Field>
                    </div>

                    <div className="col-span-2 my-3">
                        <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-dashed border-gray-200 px-4 py-3 hover:border-red-300 hover:bg-red-50/50 transition-all group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                                <Paperclip size={14} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Attach brief / reference</p>
                                <p className="text-xs text-gray-400 truncate">{fileLabel}</p>
                            </div>
                            <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </label>
                    </div>

                    <div className="col-span-2 mt-1">
                        <button onClick={handleSubmit}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all active:scale-[0.98] hover:shadow-lg"
                            style={{ background: "linear-gradient(135deg, #991B1B 0%, #B91C1C 50%, #DC2626 100%)", boxShadow: "0 4px 20px rgba(185,28,28,0.35)" }}>
                            Submit Request
                        </button>
                        <p className="text-center text-gray-400 text-xs mt-2">🔒 Your information is secure and never shared</p>
                    </div>
                </div>
            )
            }
        </>
    )
}

/* ── BROCHURE CONTENT ── */
function BrochureContent({ submitted, form, errors, dropdownOpen, dropdownRef, setDropdownOpen, setForm, handleChange, handleSubmit }: any) {
    return (
        <>
            <h2 className="text-center text-2xl font-black tracking-tight mb-6" style={{ fontFamily: "'Georgia', serif" }}>
                <span style={{ color: "#B91C1C" }}>Download</span>{" "}
                <span className="text-gray-900">Brochure</span>
            </h2>

            {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "#FEE2E2" }}>
                        <Download size={28} style={{ color: "#B91C1C" }} />
                    </div>
                    <p className="text-xl font-bold text-gray-800">Downloading...</p>
                    <p className="text-gray-400 text-sm text-center max-w-xs">
                        Your brochure is ready. Check your downloads folder.
                    </p>
                </div>
            ) : (
                <div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <Field icon={<User size={14} />} error={errors.contactName}>
                            <input name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                        </Field>

                        <Field icon={<Building2 size={14} />} error={errors.companyName}>
                            <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 my-3">

                        <Field icon={<Mail size={14} />} error={errors.email}>
                            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                        </Field>

                        <PhoneField form={form} setForm={setForm} errors={errors} handleChange={handleChange}
                            dropdownOpen={dropdownOpen} dropdownRef={dropdownRef} setDropdownOpen={setDropdownOpen} />
                    </div>

                    <div className="col-span-2 mt-1">
                        <button onClick={handleSubmit}
                            className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all active:scale-[0.98] hover:shadow-lg flex items-center justify-center gap-2"
                            style={{ background: "linear-gradient(135deg, #991B1B 0%, #B91C1C 50%, #DC2626 100%)", boxShadow: "0 4px 20px rgba(185,28,28,0.35)" }}>
                            <Download size={16} /> Download Brochure
                        </button>
                    </div>
                </div >

            )
            }
        </>
    )
}

/* ── PHONE FIELD ── */
function PhoneField({ form, setForm, errors, handleChange, dropdownOpen, dropdownRef, setDropdownOpen }: any) {
    return (
        <Field icon={null} error={errors.phone}>
            <div className="flex items-center gap-1 w-full">
                <div ref={dropdownRef} className="relative shrink-0">
                    <button type="button" onClick={() => setDropdownOpen((d: boolean) => !d)}
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                        <span>{countryCodes.find(c => c.code === form.countryCode)?.flag}</span>
                        <span className="font-medium">{form.countryCode}</span>
                        <ChevronDown size={11} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-auto max-h-40 w-36">
                            {countryCodes.map(c => (
                                <button key={c.code} type="button"
                                    onClick={() => { setForm((f: any) => ({ ...f, countryCode: c.code })); setDropdownOpen(false) }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-50 text-gray-700 transition-colors">
                                    <span>{c.flag}</span>
                                    <span className="font-medium">{c.code}</span>
                                    <span className="text-gray-400">{c.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <input name="phone" type="tel" placeholder="Phone No." value={form.phone} onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0" />
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
    return (
        <div>
            <div
                className={`flex w-full items-${tall ? "start" : "center"} gap-2.5 px-3.5 ${tall ? "pt-3 pb-2" : "py-0"} rounded-xl border transition-all ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300 focus-within:border-red-400 focus-within:bg-white"}`}
                style={{ minHeight: tall ? undefined : 44 }}
            >
                {icon && <span className={`shrink-0 mt-0.5 ${error ? "text-red-400" : "text-gray-400"}`}>{icon}</span>}
                {children}
            </div>
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    )
}