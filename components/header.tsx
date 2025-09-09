"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Star, Users } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/runspire-complete-logo.png"
            alt="Runspire"
            width={80}
            height={30}
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/about" icon={<Users className="h-5 w-5" />} label="About Me" />
          <NavLink href="/custom-coaching" icon={<Users className="h-5 w-5" />} label="Coaching" />
          <NavLink href="/testimonials" icon={<Star className="h-5 w-5" />} label="Success Stories" />
          <NavLink href="/info" icon={<BookOpen className="h-5 w-5" />} label="Learn" />
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggleMenu} className="md:hidden">
            {/* Mobile menu button */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg z-50">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  About Me
                </Link>
                <Link
                  href="/custom-coaching"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  Coaching
                </Link>
                <Link
                  href="/testimonials"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  Success Stories
                </Link>
                <Link
                  href="/info"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  Learn
                </Link>
                <Link
                  href="/start"
                  className="block px-3 py-2 text-base font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
          <Link href="/start">
            <Button className="duolingo-button bg-run-green border-green-700">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-run-dark hover:bg-gray-100 font-bold transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
