'use client';

import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function TopHeader() {
  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="https://verluxstands.com/assets/icons/logo2.png"
              alt="Verlux Stands Logo"
              width={70}
              height={40}
              className="w-40 h-10 object-contain"
              style={{filter:"invert(6)"}}
            />
            <span className="text-xs text-muted-foreground hidden sm:inline font-medium">Exhibition Stand Solutions</span>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">info@verluxstands.com</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:inline-flex border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Get Free Quote
            </Button>
            <Button
              variant="default"
              className="hidden sm:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Download Brochure
            </Button>
            <Button variant="outline" size="sm" className="md:hidden border-primary text-primary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
