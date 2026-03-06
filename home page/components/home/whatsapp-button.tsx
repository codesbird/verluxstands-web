'use client';

import Link from 'next/link';
import whatsapp from "@/public/whatsapp.png"
import Image from 'next/image';


export default function WhatsAppButton() {
  const phoneNumber = '919999999999'; // Replace with actual WhatsApp number
  const message = 'Hi, I would like to know more about Verlux Stands exhibition solutions.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed text-white left-4 bottom-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <Image
        src="/whatsapp.png"
        alt="Whatsapp Message"
        fill
        className="object-cover"
        priority
      />
    </Link>
  );
}
