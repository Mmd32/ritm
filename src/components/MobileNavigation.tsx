'use client';

import React from 'react';
import { Language } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { Activity, Flame, LineChart, BookOpen, Calculator } from 'lucide-react';

interface MobileNavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  language: Language;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onNavigate,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const items = [
    { id: 'calculator', label: t.nav.calculator, icon: Activity },
    { id: 'zones', label: t.nav.zones, icon: Flame },
    { id: 'history', label: t.nav.history, icon: LineChart },
    { id: 'tools', label: t.nav.tools, icon: Calculator },
    { id: 'academy', label: t.nav.academy, icon: BookOpen },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-2 py-2 flex items-center justify-around"
      style={{
        backgroundColor: 'rgba(11, 15, 20, 0.92)',
        borderColor: 'var(--border)',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-[#C8FF4D]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'font-black' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

