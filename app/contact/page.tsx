"use client"

import React from "react"

import { useState } from "react"
import TopHeader from '@/components/common/top-header';
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import PageHeader from "@/components/common/page-header"
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react"

import ContactSection from "@/components/home/contact-section"


export default function ContactPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    eventType: "",
    budget: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* <DynamicSchema seo={seo} /> */}
      <TopHeader />
      <Header />
      <PageHeader
        subtitle="Get in Touch"
        title="Let's Create Something Extraordinary"
        backgroundImage="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"
      />

      <section className="py-8 md:py-15">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4 leading-tight">
              Choose Verlux Stands for Your Next Trade Show Event
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get a custom booth design & quote today
            </p>
          </div>
          <ContactSection />
        </div>l
      </section>

      <Footer />
    </main>
  )
}
