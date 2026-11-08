import React, { useState } from 'react';
import { LayoutDashboard, Calculator, Table2, Users, FileText } from 'lucide-react';

export type TabType = 'dashboard' | 'kalkulator' | 'matriks' | 'penerima' | 'laporan';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  activeRecipientsCount: number;
  totalRecipientsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  activeRecipientsCount,
}) => {
  const [clickedTab, setClickedTab] = useState<TabType | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);

  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      animClass: 'animate-icon-pop',
      badge: null,
    },
    {
      id: 'kalkulator' as TabType,
      label: 'Kalkulator',
      icon: Calculator,
      animClass: 'animate-icon-wiggle',
      badge: null,
    },
    {
      id: 'matriks' as TabType,
      label: 'Matriks SK',
      icon: Table2,
      animClass: 'animate-icon-spin',
      badge: '100%',
    },
    {
      id: 'penerima' as TabType,
      label: 'Penerima',
      icon: Users,
      animClass: 'animate-icon-pop',
      badge: activeRecipientsCount.toString(),
    },
    {
      id: 'laporan' as TabType,
      label: 'Laporan',
      icon: FileText,
      animClass: 'animate-icon-wiggle',
      badge: null,
    },
  ];

  const handleTabClick = (tabId: TabType) => {
    setClickedTab(tabId);
    setClickCount((c) => c + 1);
    onChangeTab(tabId);
  };

  return (
    <nav 
      aria-label="Navigasi Utama Mobile" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/20 transition-colors"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isJustClicked = clickedTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[40px] transition-all relative group select-none active:scale-95 ${
                isActive 
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Outer soft aura when active */}
              <div 
                className={`relative flex items-center justify-center px-2.5 py-1 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-teal-500/15 dark:bg-teal-400/20 shadow-xs shadow-teal-500/10' 
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800/60'
                }`}
              >
                {/* Ripple ring effect on click */}
                {isJustClicked && (
                  <span
                    key={`ripple-${tab.id}-${clickCount}`}
                    className="absolute inset-0 rounded-2xl bg-teal-400/30 dark:bg-teal-300/30 animate-ripple pointer-events-none"
                  />
                )}

                {/* Animated Icon */}
                <div
                  key={isJustClicked ? `icon-${tab.id}-${clickCount}` : undefined}
                  className={`relative flex items-center justify-center transition-all ${
                    isJustClicked ? tab.animClass : isActive ? 'animate-tab-float' : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive 
                        ? 'scale-110 stroke-[2.4] drop-shadow-xs' 
                        : 'stroke-[1.8] group-hover:scale-110'
                    }`}
                  />
                </div>

                {/* Tab Badge */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 tabular-nums shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Tab Label */}
              <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap transition-all ${
                isActive ? 'font-bold scale-105' : 'font-medium'
              }`}>
                {tab.label}
              </span>

              {/* Active bar indicator with spring dot */}
              {isActive && (
                <div className="absolute bottom-1 flex items-center justify-center">
                  <span className="w-6 h-0.5 rounded-full bg-teal-600 dark:bg-teal-400 shadow-xs shadow-teal-500/50" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
