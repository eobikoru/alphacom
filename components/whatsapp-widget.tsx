"use client"

import { useState } from "react"
import Image from "next/image"
import { X, MessageCircle } from "lucide-react"

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)

  // WhatsApp number and message (customize these)
  const phoneNumber = "+1234567890" // Replace with actual WhatsApp number
  const defaultMessage = "Hello! I'm interested in your products and would like to chat with a representative."

  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(defaultMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openWhatsApp}
          className="relative group hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-full"
          aria-label="Chat with us on WhatsApp"
        >
          <Image
            src="/images/whatsapp-icon.png"
            alt="WhatsApp Chat"
            width={60}
            height={60}
            className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 rounded-full"
          />

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>

          {/* Tooltip - Updated to use theme-aware colors */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-border shadow-lg">
            Chat with us on WhatsApp
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
          </div>
        </button>
      </div>

      {/* Optional: Chat Preview Modal - Enhanced with better theme integration */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-card dark:bg-black rounded-lg shadow-2xl dark:shadow-black/60 border border-border">
          <div className="flex items-center justify-between p-4 bg-green-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs opacity-90">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <div className="bg-muted rounded-lg p-3 mb-4">
              <p className="text-sm text-muted-foreground">Hi there! 👋 How can we help you today?</p>
            </div>

            <button
              onClick={openWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Start Conversation
            </button>
          </div>
        </div>
      )}
    </>
  )
}
