import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Activity, ShieldCheck, Award, MessageSquareQuote } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Routine Hub',
      icon: Activity,
    },
    {
      id: 'analysis',
      label: 'AI Skin Log',
      icon: Sparkles,
    },
    {
      id: 'science',
      label: 'Science Lab',
      icon: ShieldCheck,
    },
    {
      id: 'routine',
      label: 'Milestones',
      icon: Award,
    },
    {
      id: 'reviews',
      label: 'Proof Feed',
      icon: MessageSquareQuote,
    },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-sage-100 shadow-lg safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[52px] py-1 transition-all rounded-xl select-none ${
                isActive ? 'text-sage-800 font-bold' : 'text-charcoal-500 hover:text-charcoal-700'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-sage-100 text-sage-800 scale-105' : 'text-charcoal-500'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
