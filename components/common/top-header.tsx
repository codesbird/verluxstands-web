'use client';

import { Phone, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePopup } from "@/context/popup-context"

export default function TopHeader() {
  const { openBrochurePopup, openQuotePopup } = usePopup()

  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-8lxl mx-auto px-4 sm:px-3 lg:px-10">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="https://verluxstands.com/assets/icons/logo2.png"
                alt="Verlux Stands Logo"
                width={70}
                height={40}
                className="w-40 h-10 object-contain"
                style={{ filter: "invert(6)" }}
              />
            </Link>
            <span className="font-semibold text-muted-foreground hidden md:flex lg:hidden xl:flex font-medium">Exhibition Stand Solutions</span>
          </div>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-lg font-medium">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-lg font-medium">info@verluxstands.com</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="items-center hidden sm:flex gap-3">
            <Button
              variant="outline"
              onClick={openQuotePopup}
              className="border-primary text-primay hover:bg-primary hover:text-primary-foreground"
            >
              Get Free Quote
            </Button>
            <Button
              variant="outline"
              onClick={openBrochurePopup}
              className="border-primary hover:bg-primary/90 text-primary"
            >
              Download Brochure
            </Button>
          </div>
          <Button
            onClick={openBrochurePopup}
            variant="outline" size="sm" className="px-1 h-8 md:hidden sm:hidden lg:hidden flex border-primary text-primary">
            Brochure <Download size={12} />
          </Button>
        </div>
      </div>
    </div >
  );
}
