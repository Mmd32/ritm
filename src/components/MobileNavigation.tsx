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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t border-[var(--border)] bg-[var(--surface)]/90 px-2 py-2 flex items-center justify-around transition-colors">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[var(--accent)] font-bold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
