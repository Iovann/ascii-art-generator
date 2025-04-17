'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Terminal } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/text-to-ascii', label: 'Texte en ASCII' },
  { href: '/image-to-ascii', label: 'Image en ASCII' },
  { href: '/gallery', label: 'Galerie' },
  { href: '/about', label: 'À propos' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = usePathname();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Terminal className="h-8 w-8 mr-2 text-primary" />
              <span className="font-bold text-xl text-primary">ASCII Art Generator</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-md font-semibold text-primary group ${
                  isActive(link.href) ? '' : 'hover:text-primary'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-[3px] w-8 rounded bg-primary transition-all duration-300
                    ${isActive(link.href)
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary hover:font-semibold hover:bg-opacity-10 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only text-primary">Ouvrir le menu</span>
              {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative block px-3 py-2 rounded-md font-semibold text-primary group ${
                  isActive(link.href) ? '' : 'hover:text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-[3px] w-8 rounded bg-primary transition-all duration-300
                    ${isActive(link.href)
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
