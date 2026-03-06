import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-center flex-col gap-0 mb-4">
              <Image
                src="https://verluxstands.com/assets/icons/logo2.png"
                alt="Verlux Stands Logo"
                width={40}
                height={40}
                className="w-30 h-10 object-contain"
              />
              <span className="text-sm font-bold">Private Limited.</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Your trusted exhibition stand builder, offering creative and customized exhibiting solutions globally since 2008.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-secondary transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="mailto:info@verluxstands.com" className="hover:text-secondary transition-colors">
                  info@verluxstands.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm">Global Exhibition Solutions</p>
                  <p className="text-sm">Multiple Locations Worldwide</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-2xl">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Custom Exhibition Stand
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white/90 hover:scale-10 transition-colors">
                  Double Decker Stands
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Outdoor Exhibition Stands
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Country Pavilion Stands
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Sustainable Stands
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-secondary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-secondary transition-colors">
                  Exhibition Stands
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-secondary transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#global" className="hover:text-secondary transition-colors">
                  Our Global Presence
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Locations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Germany
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Spain
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Italy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  France
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Netherlands
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8 sm:pt-10">
          <p className="text-center text-sm text-primary-foreground/70">
            Copyright © {currentYear} Verlux Stands Private Limited | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
