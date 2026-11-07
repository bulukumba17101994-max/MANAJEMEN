import React from 'react';
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
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'kalkulator' as TabType,
      label: 'Kalkulator',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'matriks' as TabType,
      label: 'Matriks SK',
      icon: Table2,
      badge: '100%',
    },
    {
      id: 'penerima' as TabType,
      label: 'Penerima',
      icon: Users,
      badge: activeRecipientsCount.toString(),
    },
    {
      id: 'laporan' as TabType,
      label: 'Laporan',
      icon: FileText,
      badge: null,
    },
  ];

  return (
    <nav 
      aria-label="Navigasi Utama Mobile" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/20 transition-colors"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[40px] transition-all relative ${
                isActive 
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>

              {/* Active bar indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-teal-600 dark:bg-teal-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
