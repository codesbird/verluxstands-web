'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import CounterTiles from '@/components/home/counter-tiles'
import { Mail, Phone, MapPin, User, Building, MessageCircle, Upload, Tag, Tent } from 'lucide-react'
import { submitLeadForm } from '@/lib/submission-client'

const initialForm = {
  contactName: '',
  companyName: '',
  email: '',
  phone: '',
  exhibition: '',
  standSize: '',
  message: '',
}

export default function ContactSection() {
  const [formData, setFormData] = useState(initialForm)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      await submitLeadForm({
        type: 'contact',
        sourcePage: window.location.pathname,
        contactName: formData.contactName,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        exhibition: formData.exhibition,
        standSize: formData.standSize,
        message: formData.message,
        file,
      })

      setFormData(initialForm)
      setFile(null)
      setFeedback({
        type: 'success',
        message: 'Your enquiry has been sent successfully. Our team will contact you shortly.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit the contact form.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-muted/10 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CounterTiles />

        <div className="brand-shell grid grid-cols-1 gap-6 rounded-[1.75rem] border border-primary/20 p-8 md:grid-cols-3 sm:p-10">
          <div>
            <h2 className="text-3xl font-semibold">
              Choose Verlux Stands for your <span className="brand-gold-text">next trade show event</span>
            </h2>
            <h3 className="mt-5 text-xl font-semibold text-secondary">Get a custom booth design & quote</h3>
            <div className="mt-5 space-y-3 text-foreground/82">
              {[
                'We will get back to you soon.',
                'Our team is always ready to assist you.',
                'We provide our services globally.',
                'No automated responses, only personal support.',
                'Get a customized quotation for your project.',
              ].map((item) => (
                <p key={item} className="flex items-start gap-2"><span className="mt-1 text-primary">�</span> <span>{item}</span></p>
              ))}
            </div>
            <div className="mt-8 space-y-5 text-sm">
              <div className="flex gap-3">
                <Mail className="mt-1 text-primary" />
                <div>
                  <h6 className="font-semibold text-secondary">Email</h6>
                  <a className="text-foreground/80 hover:text-secondary" href="mailto:info@verluxstands.com">info@verluxstands.com</a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-1 text-primary" />
                <div>
                  <h6 className="font-semibold text-secondary">Phone</h6>
                  <a className="text-foreground/80 hover:text-secondary" href="tel:+91789685248">+91 789685248</a>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-1 text-primary" />
                <div>
                  <h6 className="font-semibold text-secondary">Delhi</h6>
                  <p className="text-foreground/75">Unchi Dankaur, Greater Noida, Gautam Buddha Nagar, Uttar Pradesh - 201110</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="col-span-2 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field icon={<User className="text-primary" />}>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required className="w-full bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none" placeholder="Your name" />
              </Field>
              <Field icon={<Building className="text-primary" />}>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none" placeholder="Your company" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field icon={<Mail className="text-primary" />}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none" placeholder="your.email@company.com" />
              </Field>
              <Field icon={<Phone className="text-primary" />}>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none" placeholder="+39 XXX XXX XXXX" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field icon={<Tag className="text-primary" />}>
                <input type="text" name="exhibition" value={formData.exhibition} onChange={handleChange} className="w-full bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none" placeholder="Trade show name" />
              </Field>
              <Field icon={<Tent className="text-primary" />}>
                <select name="standSize" value={formData.standSize} onChange={handleChange} className="w-full bg-transparent py-3 text-foreground focus:outline-none">
                  <option value="">Select stand size</option>
                  <option value="Small (up to 3x3m)">Small (up to 3x3m)</option>
                  <option value="Medium (3x3m to 6x6m)">Medium (3x3m to 6x6m)</option>
                  <option value="Large (6x6m+)">Large (6x6m+)</option>
                </select>
              </Field>
            </div>

            <Field icon={<MessageCircle className="mt-3 text-primary" />} align="start">
              <textarea name="message" value={formData.message} onChange={handleChange} rows={5} required className="w-full resize-none bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none" placeholder="Tell us about your exhibition stand requirements..." />
            </Field>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-black/10 px-4 py-4 transition-colors hover:border-primary/45 hover:bg-primary/8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                <Upload className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-secondary">Reference file</div>
                <div className="truncate text-xs text-muted-foreground">{file ? file.name : 'Attach your brief, PDF, DOC, or image'}</div>
              </div>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            </label>

            {feedback && (
              <div className={`rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-primary/25 bg-primary/10 text-secondary' : 'border-destructive/40 bg-destructive/10 text-destructive-foreground'}`}>
                {feedback.message}
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-base" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({ children, icon, align = 'center' }: { children: React.ReactNode; icon: React.ReactNode; align?: 'center' | 'start' }) {
  return (
    <div className={`flex gap-2 rounded-2xl border border-primary/20 bg-black/10 px-3 ${align === 'start' ? 'items-start' : 'items-center'}`}>
      {icon}
      <div className="flex-1">{children}</div>
    </div>
  )
}
