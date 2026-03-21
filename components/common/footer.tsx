import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

const services = [
  'Custom Exhibition Stand',
  'Double Decker Stands',
  'Outdoor Exhibition Stands',
  'Country Pavilion Stands',
  'Sustainable Stands',
]

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Trade Shows', href: '/trade-shows' },
  { label: 'Contact Us', href: '/contact' },
]

const locations = ['Germany', 'Spain', 'France', 'Italy', 'Dubai']

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="px-3 pb-8 pt-16 sm:px-6 lg:px-10">
      <div className="brand-shell mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <div className="font-serif text-4xl font-bold tracking-[0.18em] text-secondary">VERLUX</div>
            <div className="mt-2 text-xs uppercase tracking-[0.45em] text-secondary/60">Stands</div>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
              Your trusted exhibition stand builder, delivering elegant design systems, tailored fabrication, and global execution with a premium Verlux finish.
            </p>
            <div className="mt-6 space-y-3 text-sm text-secondary/80">
              <a href="tel:+918920253275" className="flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-primary" />
                +91 8920253275
              </a>
              <a href="tel:+917303531447" className="flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-primary" />
                +91 7303531447
              </a>
              <a href="mailto:marketing@verluxstands.com" className="flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-primary" />
                marketing@verluxstands.com
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>No. 1, Manikam Market, Unchi Dankaur, Greater Noida, Gautam Buddha Nagar, Uttar Pradesh - 201110</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl text-secondary">Services</h4>
            <div className="mt-5 space-y-3 text-sm text-white/72">
              {services.map((service) => (
                <div key={service}>{service}</div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl text-secondary">Quick Links</h4>
            <div className="mt-5 space-y-3 text-sm text-white/72">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="block transition-colors hover:text-secondary">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl text-secondary">Locations</h4>
            <div className="mt-5 space-y-3 text-sm text-white/72">
              {locations.map((location) => (
                <div key={location}>{location}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 h-px brand-divider" />
        <p className="mt-6 text-center text-sm text-white/55">Copyright {currentYear} Verlux Stands. All rights reserved.</p>
      </div>
    </footer>
  )
}
