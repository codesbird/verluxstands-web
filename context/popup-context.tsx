"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { X, User, Building2, Mail, Phone, MessageSquare, Paperclip, Send, ChevronDown, Download } from "lucide-react"
import { usePathname } from "next/navigation"
import { submitLeadForm } from "@/lib/submission-client"

const FIRST_SHOW_DELAY_MS = 3 * 1000
const REPEAT_INTERVAL_MS = 3 * 60 * 1000
const STORAGE_KEY = "freeQuoteSubmitted"

const countryCodes = [
  { code: "+91", name: "IN" },
  { code: "+1", name: "US" },
  { code: "+44", name: "GB" },
  { code: "+971", name: "AE" },
  { code: "+49", name: "DE" },
  { code: "+33", name: "FR" },
  { code: "+86", name: "CN" },
  { code: "+65", name: "SG" },
  { code: "+61", name: "AU" },
  { code: "+81", name: "JP" },
]

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

interface PopupContextType {
  openQuotePopup: () => void
  closeQuotePopup: () => void
  openBrochurePopup: () => void
  closeBrochurePopup: () => void
}

const PopupContext = createContext<PopupContextType>({
  openQuotePopup: () => {},
  closeQuotePopup: () => {},
  openBrochurePopup: () => {},
  closeBrochurePopup: () => {},
})

const initialQuoteForm: QuoteFormData = {
  contactName: "",
  companyName: "",
  email: "",
  phone: "",
  countryCode: "+91",
  message: "",
  file: null,
}

const initialBrochureForm: BrochureFormData = {
  contactName: "",
  companyName: "",
  email: "",
  phone: "",
  countryCode: "+91",
}

export function usePopup() {
  return useContext(PopupContext)
}

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [activePopup, setActivePopup] = useState<ActivePopup>(null)
  const [closing, setClosing] = useState(false)
  const [shake, setShake] = useState(false)
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)
  const [brochureSubmitted, setBrochureSubmitted] = useState(false)
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)
  const [brochureSubmitting, setBrochureSubmitting] = useState(false)
  const [quoteFeedback, setQuoteFeedback] = useState<string>("")
  const [brochureFeedback, setBrochureFeedback] = useState<string>("")
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>(initialQuoteForm)
  const [brochureForm, setBrochureForm] = useState<BrochureFormData>(initialBrochureForm)
  const [quoteErrors, setQuoteErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({})
  const [brochureErrors, setBrochureErrors] = useState<Partial<Record<keyof BrochureFormData, string>>>({})
  const [quoteDropdownOpen, setQuoteDropdownOpen] = useState(false)
  const [brochureDropdownOpen, setBrochureDropdownOpen] = useState(false)
  const [fileLabel, setFileLabel] = useState("No file chosen")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const quoteDropdownRef = useRef<HTMLDivElement>(null)
  const brochureDropdownRef = useRef<HTMLDivElement>(null)
  const hasShownInitial = useRef(false)

  const clearBodyLock = () => document.body.classList.remove("overflow-hidden")
  const setBodyLock = () => document.body.classList.add("overflow-hidden")

  const closeActive = useCallback((afterClose?: () => void) => {
    setClosing(true)
    setTimeout(() => {
      setActivePopup(null)
      setClosing(false)
      setQuoteDropdownOpen(false)
      setBrochureDropdownOpen(false)
      clearBodyLock()
      afterClose?.()
    }, 350)
  }, [])

  const openQuotePopup = useCallback(() => {
    const alreadySubmitted = sessionStorage.getItem(STORAGE_KEY) === "true"
    if (!alreadySubmitted && activePopup === null) {
      setActivePopup("quote")
      setBodyLock()
    }
  }, [activePopup])

  const closeQuotePopup = useCallback(() => {
    closeActive(() => {
      setQuoteSubmitted(false)
      setQuoteSubmitting(false)
      setQuoteFeedback("")
      setQuoteErrors({})
      setQuoteForm(initialQuoteForm)
      setFileLabel("No file chosen")
    })
  }, [closeActive])

  const openBrochurePopup = useCallback(() => {
    setActivePopup("brochure")
    setBodyLock()
  }, [])

  const closeBrochurePopup = useCallback(() => {
    closeActive(() => {
      setBrochureSubmitted(false)
      setBrochureSubmitting(false)
      setBrochureFeedback("")
      setBrochureErrors({})
      setBrochureForm(initialBrochureForm)
    })
  }, [closeActive])

  useEffect(() => {
    if (pathname.includes("admin")) return
    if (hasShownInitial.current) return
    hasShownInitial.current = true

    const initial = setTimeout(() => {
      const alreadySubmitted = sessionStorage.getItem(STORAGE_KEY) === "true"
      if (!alreadySubmitted) {
        setActivePopup("quote")
        setBodyLock()
      }
    }, FIRST_SHOW_DELAY_MS)

    timerRef.current = setInterval(() => {
      const alreadySubmitted = sessionStorage.getItem(STORAGE_KEY) === "true"
      if (!alreadySubmitted && activePopup === null) {
        setActivePopup("quote")
        setBodyLock()
      }
    }, REPEAT_INTERVAL_MS)

    return () => {
      clearTimeout(initial)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activePopup, pathname])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || activePopup === null) return
      if (activePopup === "quote") closeQuotePopup()
      else closeBrochurePopup()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [activePopup, closeBrochurePopup, closeQuotePopup])

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (quoteDropdownRef.current && !quoteDropdownRef.current.contains(event.target as Node)) {
        setQuoteDropdownOpen(false)
      }
      if (brochureDropdownRef.current && !brochureDropdownRef.current.contains(event.target as Node)) {
        setBrochureDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [])

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  function handleQuoteChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setQuoteForm((current) => ({ ...current, [name]: value }))
    setQuoteErrors((current) => ({ ...current, [name]: "" }))
    setQuoteFeedback("")
  }

  function handleBrochureChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setBrochureForm((current) => ({ ...current, [name]: value }))
    setBrochureErrors((current) => ({ ...current, [name]: "" }))
    setBrochureFeedback("")
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null
    setQuoteForm((current) => ({ ...current, file }))
    setFileLabel(file ? file.name : "No file chosen")
  }

  function validateQuote() {
    const nextErrors: Partial<Record<keyof QuoteFormData, string>> = {}
    if (!quoteForm.contactName.trim()) nextErrors.contactName = "Required"
    if (!quoteForm.companyName.trim()) nextErrors.companyName = "Required"
    if (!quoteForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) nextErrors.email = "Valid email required"
    if (!quoteForm.phone.match(/^\d{7,15}$/)) nextErrors.phone = "Valid phone required"
    if (!quoteForm.message.trim()) nextErrors.message = "Please describe your project"
    setQuoteErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function validateBrochure() {
    const nextErrors: Partial<Record<keyof BrochureFormData, string>> = {}
    if (!brochureForm.contactName.trim()) nextErrors.contactName = "Required"
    if (!brochureForm.companyName.trim()) nextErrors.companyName = "Required"
    if (!brochureForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) nextErrors.email = "Valid email required"
    if (!brochureForm.phone.match(/^\d{7,15}$/)) nextErrors.phone = "Valid phone required"
    setBrochureErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleQuoteSubmit() {
    if (!validateQuote()) {
      triggerShake()
      return
    }

    try {
      setQuoteSubmitting(true)
      setQuoteFeedback("")
      await submitLeadForm({
        type: "quote",
        sourcePage: pathname || "/",
        contactName: quoteForm.contactName,
        companyName: quoteForm.companyName,
        email: quoteForm.email,
        phone: quoteForm.phone,
        countryCode: quoteForm.countryCode,
        message: quoteForm.message,
        file: quoteForm.file,
      })
      sessionStorage.setItem(STORAGE_KEY, "true")
      if (timerRef.current) clearInterval(timerRef.current)
      setQuoteSubmitted(true)
      setTimeout(closeQuotePopup, 2800)
    } catch (error) {
      setQuoteFeedback(error instanceof Error ? error.message : "Failed to submit the quote form.")
      triggerShake()
    } finally {
      setQuoteSubmitting(false)
    }
  }

  async function handleBrochureSubmit() {
    if (!validateBrochure()) {
      triggerShake()
      return
    }

    try {
      setBrochureSubmitting(true)
      setBrochureFeedback("")
      await submitLeadForm({
        type: "brochure",
        sourcePage: pathname || "/",
        contactName: brochureForm.contactName,
        companyName: brochureForm.companyName,
        email: brochureForm.email,
        phone: brochureForm.phone,
        countryCode: brochureForm.countryCode,
      })
      setBrochureSubmitted(true)
      setTimeout(closeBrochurePopup, 2500)
    } catch (error) {
      setBrochureFeedback(error instanceof Error ? error.message : "Failed to submit the brochure form.")
      triggerShake()
    } finally {
      setBrochureSubmitting(false)
    }
  }

  const isVisible = activePopup !== null
  const handleBackdropClick = () => {
    if (activePopup === "quote") closeQuotePopup()
    else closeBrochurePopup()
  }

  return (
    <PopupContext.Provider value={{ openQuotePopup, closeQuotePopup, openBrochurePopup, closeBrochurePopup }}>
      {children}

      {isVisible && (
        <>
          <div
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-50 bg-[rgba(5,5,5,0.78)] backdrop-blur-md transition-all duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-3 md:p-4 lg:p-6 pointer-events-none">
            <div
              className={`brand-panel relative pointer-events-auto w-full overflow-hidden rounded-[1.75rem] border border-primary/25 text-card-foreground shadow-[0_32px_90px_rgba(0,0,0,0.42)] transition-all duration-350 ${activePopup === "quote" ? "max-w-3xl" : "max-w-xl"} ${closing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"} ${shake ? "animate-popup-shake" : ""}`}
            >
              <div className="h-px brand-divider" />

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
                    submitting={quoteSubmitting}
                    feedback={quoteFeedback}
                    form={quoteForm}
                    errors={quoteErrors}
                    fileLabel={fileLabel}
                    dropdownOpen={quoteDropdownOpen}
                    dropdownRef={quoteDropdownRef}
                    setDropdownOpen={setQuoteDropdownOpen}
                    setForm={setQuoteForm}
                    handleChange={handleQuoteChange}
                    handleFile={handleFile}
                    handleSubmit={handleQuoteSubmit}
                  />
                ) : (
                  <BrochureContent
                    submitted={brochureSubmitted}
                    submitting={brochureSubmitting}
                    feedback={brochureFeedback}
                    form={brochureForm}
                    errors={brochureErrors}
                    dropdownOpen={brochureDropdownOpen}
                    dropdownRef={brochureDropdownRef}
                    setDropdownOpen={setBrochureDropdownOpen}
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

function QuoteContent({
  submitted,
  submitting,
  feedback,
  form,
  errors,
  fileLabel,
  dropdownOpen,
  dropdownRef,
  setDropdownOpen,
  setForm,
  handleChange,
  handleFile,
  handleSubmit,
}: any) {
  return (
    <>
      <h2 className="mb-2 text-center font-serif text-4xl font-bold tracking-wide text-secondary">
        Get <span className="brand-gold-text">Free</span> Quote
      </h2>
      <p className="mb-7 text-center text-sm uppercase tracking-[0.24em] text-muted-foreground">
        Exhibition Stands and Booth Design | No Obligation
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
              <input name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            </Field>

            <Field icon={<Building2 size={14} />} error={errors.companyName}>
              <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            </Field>

            <Field icon={<Mail size={14} />} error={errors.email}>
              <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
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
              <textarea name="message" placeholder="Tell us about your exhibition stand requirements..." value={form.message} onChange={handleChange} rows={3} className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
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
              <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            </label>
          </div>

          <div className="col-span-2 mt-2">
            {feedback && <p className="mb-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{feedback}</p>}
            <button onClick={handleSubmit} disabled={submitting} className="brand-button-dark w-full justify-center rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Your information is secure and never shared.</p>
          </div>
        </div>
      )}
    </>
  )
}

function BrochureContent({
  submitted,
  submitting,
  feedback,
  form,
  errors,
  dropdownOpen,
  dropdownRef,
  setDropdownOpen,
  setForm,
  handleChange,
  handleSubmit,
}: any) {
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
          <p className="font-serif text-2xl font-bold text-secondary">Brochure Request Sent</p>
          <p className="max-w-xs text-center text-sm text-muted-foreground">
            Your request has been saved and our team can follow up with the brochure.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Field icon={<User size={14} />} error={errors.contactName}>
              <input name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            </Field>

            <Field icon={<Building2 size={14} />} error={errors.companyName}>
              <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            </Field>
          </div>

          <div className="my-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Field icon={<Mail size={14} />} error={errors.email}>
              <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
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
            {feedback && <p className="mb-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{feedback}</p>}
            <button onClick={handleSubmit} disabled={submitting} className="brand-button-dark w-full justify-center rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-60">
              <Download size={16} /> {submitting ? "Submitting..." : "Download Brochure"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function PhoneField({ form, setForm, errors, handleChange, dropdownOpen, dropdownRef, setDropdownOpen }: any) {
  const [searchCode, setSearchCode] = useState("")

  return (
    <Field icon={null} error={errors.phone}>
      <div className="flex w-full items-center gap-2">
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen((current: boolean) => !current)}
            className="flex items-center gap-1.5 text-xs text-secondary/85 transition-colors hover:text-white"
          >
            <span className="font-medium">{form.countryCode}</span>
            <span className="text-muted-foreground">{countryCodes.find((item) => item.code === form.countryCode)?.name}</span>
            <ChevronDown size={11} />
          </button>
          {dropdownOpen && (
            <div className="brand-panel absolute left-0 top-full z-20 mt-2 max-h-40 min-h-20 w-40 overflow-auto rounded-lg border border-primary/25 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
              <input onChange={(event) => setSearchCode(event.target.value.toLowerCase())} type="search" className="sticky top-0 w-full rounded bg-[#1e1b17] px-2 py-1 text-xs text-foreground outline-none" placeholder="country/code" />
              {countryCodes
                .filter((item) => `${item.code} ${item.name}`.toLowerCase().includes(searchCode))
                .map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setForm((current: any) => ({ ...current, countryCode: item.code }))
                      setDropdownOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground transition-colors hover:bg-primary/10 hover:text-secondary"
                  >
                    <span className="font-medium">{item.code}</span>
                    <span className="text-muted-foreground">{item.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
        <div className="h-4 w-px bg-primary/20" />
        <input name="phone" type="tel" placeholder="Phone No." value={form.phone} onChange={handleChange} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      </div>
    </Field>
  )
}

function Field({ icon, children, error, tall }: { icon: React.ReactNode; children: React.ReactNode; error?: string; tall?: boolean }) {
  const containerClass = tall ? "items-start pt-3 pb-2.5" : "items-center py-2.5"
  const stateClass = error
    ? "border-destructive/60 bg-destructive/10"
    : "border-primary/20 bg-black/15 hover:border-primary/35 focus-within:border-primary/60 focus-within:bg-black/25"

  return (
    <div>
      <div className={`flex w-full gap-2.5 rounded-xl px-3.5 transition-all ${containerClass} ${stateClass}`} style={{ minHeight: tall ? undefined : 48 }}>
        {icon && <span className={`mt-0.5 shrink-0 ${error ? "text-destructive" : "text-primary"}`}>{icon}</span>}
        {children}
      </div>
      {error && <p className="ml-1 mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
