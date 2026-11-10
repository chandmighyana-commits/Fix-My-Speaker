import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface TopBarProps {
  onRunTest: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onRunTest, activeView, setActiveView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'troubleshooter', label: 'Troubleshooter' },
    { id: 'sound-lab', label: 'Sound Lab' },
    { id: 'services', label: 'Services' },
    { id: 'project-brief', label: 'Site Brief' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 font-mono hover:text-amber-400 transition-colors"
        >
          AUDIOFIX<span className="text-amber-500">.PRO</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                activeView === item.id ? 'text-amber-400' : 'text-neutral-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('contact')}
            className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'contact' ? 'text-amber-400' : 'text-neutral-300'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onRunTest}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-amber-500/20"
          >
            Run Speaker Test
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left py-2 text-xs font-semibold text-neutral-200 hover:text-amber-400"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left py-2 text-xs font-semibold text-neutral-200 hover:text-amber-400"
          >
            Contact
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRunTest();
              }}
              className="w-full py-2.5 text-xs font-bold text-neutral-950 bg-amber-500 rounded-lg"
            >
              Run Speaker Test
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
