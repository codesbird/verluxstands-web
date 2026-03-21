'use client';

import Link from 'next/link';
import whatsapp from "@/public/whatsapp.png"
import Image from 'next/image';
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation";


export default function WhatsAppButton() {
  const phoneNumber = '+918920253275'; // Replace with actual WhatsApp number
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
    <div className={`fixed left-4 z-50 ${isOpen ? "-bottom-5" : "bottom-2"}`}>
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
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${whatsappUrl}`}
                alt="WhatsApp QR" className="w-[10rem]" />
              <span className="text-[12px] text-black my-1 mx-auto">+918920253275</span>
            </div>

            <a href={whatsappUrl} target="_blank"
              className="block w-full flex items-center justify-start gap-4 text-center bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded-full transition">
              <img src="/images/send2.gif" className="w-10" style={{filter:"invert(1)"}}/>
              <span>Start Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


