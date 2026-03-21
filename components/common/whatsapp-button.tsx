'use client';

import Link from 'next/link';
import whatsapp from "@/public/whatsapp.png"
import Image from 'next/image';
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation";


export default function WhatsAppButton() {
  const phoneNumber = '919999999999'; // Replace with actual WhatsApp number
  const message = 'Hi, I would like to know more about Verlux Stands exhibition solutions.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()


  function toggleChatBox(typee = "b") {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    document.addEventListener("keyup", (key) => {
      if (key.code === 'Escape' && key.key === 'Escape') {
        setIsOpen(false)
      }
    })

    return () => {
      document.removeEventListener('keyup', () => { });
    };
  }, [])

  if (pathname.includes("admin")) return;

  return (
    <div className="fixed bottom-6 left-4 z-50">
      <a onClick={() => toggleChatBox('')} id="contacti_button"
        className={`flex whats-app-btn items-center gap-2 bg-green-600 hover:bg-green-800 text-white p-2 rounded-full shadow-lg transition ${isOpen && "active"}`}>
        <Image
          src="./whatsapp.png"
          alt="Our workshop"
          width={30}
          height={10}
          className="object-contain"
        />
      </a>
      <div id="chatBox" className={`contact-hide ${isOpen && "active"}`}>
        <a role="button" href="mailto:marketing@verluxstands.com" target="_blank"
          className="flex items-center gap-3 my-2 whats-app-btn bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition">
          <Image
            src="./email.png"
            alt="Our workshop"
            width={22}
            height={10}
            className="object-contain"
          />
          <span className="text-[14px]">marketing@verluxstands.com</span>
        </a>

        <a href="https://wa.me/+918920253275" target="_blank"
          className="flex items-center whats-app-btn gap-3 my-2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition">
          <Image
            src="./whatsapp.png"
            alt="Our workshop"
            width={25}
            height={10}
            className="object-contain"
          />
          <span
            className="text-[14px]">+91 8920253275
          </span>
        </a>

        <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white flex items-center justify-between px-2 py-1">
            <div className="flex items-center justify-start gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp"
                className="w-[2.5rem] h-[2.5rem]" />
              <span className="font-semibold">WhatsApp</span>
            </div>
            <a role="button" onClick={() => toggleChatBox('')} title="Close"
              className="text-white hover:text-gray-200 w-8">✕</a>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-700">👋 Hello! Can we help you?</p>
            <div className="flex justify-center flex-col items-center m-0">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/+917303531447"
                alt="WhatsApp QR" className="w-[10rem]" />
              <span className="text-[12px] text-black my-1 mx-auto">+917303531447</span>
            </div>

            <a href="https://wa.me/+917303531447" target="_blank"
              className="block w-full flex items-center justify-start gap-4 text-center bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded-full transition">
              <svg className="animate-fly w-8 h-8 mx-2 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 ease-out"
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              <span>Start Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
