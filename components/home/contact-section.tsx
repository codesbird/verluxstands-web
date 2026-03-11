'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CounterTiles from "@/components/home/counter-tiles"
import Image from 'next/image';
import { Mail, Phone, MapPin, User, Building, MessageCircle, Upload, Tag, Tent, } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    exhibition: '',
    standSize: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      exhibition: '',
      standSize: '',
      message: '',
    });
    alert('Thank you for your inquiry! We will be in touch shortly.');
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <CounterTiles />

        <div className="mx-auto bg-card grid grid-cols-1 md:grid-cols-3 gap-3 lg-grid-cols-3 rounded-b-lg border border-border p-8 sm:p-12">
          <div>
            <h2 className="text-3xl font-semibold">
              Choose Verlux Stands for your <span className="text-primary">Next Trade Show Event!</span>
            </h2>
            <h3 className="text-xl mt-5 font-semibold">Get a Custom Booth Design & Quote</h3>
            <div className="mt-5">
              {["We will get back to you soon!", "Our team is always ready to assist you!", "We provide our services globally! ", "No automated responses only personal support!", "Get a customized quotation for your project!"].map((item) => (
                <p className="my-3" key={item}><span className="text-primary font-semibold">✓</span> {item}</p>
              ))}
            </div>
            <div className="mt-5">
              <div className="flex gap-3 mt-3">
                <Mail size={25} />
                <div>
                  <h6 className="font-semibold">Email</h6>
                  <p className="text-primary"><a href="mailto:info@verluxstands.com">info@verluxstands.com</a></p>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <Phone size={25} />
                <div>
                  <h6 className="font-semibold">Phone</h6>
                  <p className="text-primary"><a href="tel:+91 789685248">+91 789685248</a></p>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <MapPin size={45} />
                <div>
                  <h6 className="font-semibold">Delhi</h6>
                  <p className="px-2">Unchi Dankaur
                    Greater Noida, Gautam Buddha Nagar,
                    Uttar Pradesh – 201110</p>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="col-span-2 space-y-6 sm:space-y-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="flex px-2 gap-1 items-center bg-primary/10 rounded-lg border border-border bg-background transition-all">
                  <User className="text-primary" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none "
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <div className="flex px-2 gap-1 items-center bg-primary/10 rounded-lg border border-border bg-background transition-all">
                  <Building className="text-primary" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none "
                    placeholder="Your company"
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="flex px-2 gap-1 items-center bg-primary/10 rounded-lg border border-border bg-background transition-all">
                  <Mail className="text-primary" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none "
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>
              <div>
                <div className="flex px-2 gap-1 items-center bg-primary/10 rounded-lg border border-border bg-background transition-all">
                  <Phone className="text-primary" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none "
                    placeholder="+39 XXX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="flex px-2 gap-1 items-center bg-primary/10 rounded-lg border border-border bg-background transition-all">
                  <Tag className="text-primary" />
                  <input
                    type="text"
                    id="exhibition"
                    name="exhibition"
                    value={formData.exhibition}
                    onChange={handleChange}
                    required
                    className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none "
                    placeholder="Trade show name"
                  />
                </div>
              </div>
              <div>
                <div className="flex px-2 gap-1 items-center bg-primary/10 rounded-lg border border-border bg-background transition-all">
                  <Tent className="text-primary" />
                  <select
                    id="standSize"
                    name="standSize"
                    value={formData.standSize}
                    onChange={handleChange}
                    required
                    className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none "
                  >
                    <option value="">Select stand size</option>
                    <option value="small">Small (up to 3x3m)</option>
                    <option value="medium">Medium (3x3m to 6x6m)</option>
                    <option value="large">Large (6x6m+)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <div className="flex px-2 gap-1 items-start rounded-lg border border-border bg-primary/10 transition-all">
                <MessageCircle className="text-primary mt-3" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                  placeholder="Tell us about your exhibition stand requirements..."
                ></textarea>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="flex px-2 gap-1 items-center bg-primary/10 rounded-lg border border-border bg-background transition-all">
                  <Upload className="text-primary" />
                  <input
                    type="file"
                    id="exhibition"
                    name="exhibition"
                    value={formData.exhibition}
                    onChange={handleChange}
                    required
                    className="w-full py-3 text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                    placeholder="Trade show name"
                  />
                </div>
              </div>
              <div>
                <Image
                  src="https://uncaptcha.cs.umd.edu/uncaptcha.gif"
                  alt={`Exhibition stand `}
                  width={200}
                  height={50}
                />
              </div>

            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-white/60 hover:bg-primary/90 py-6 text-base font-semibold"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
