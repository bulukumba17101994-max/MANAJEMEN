import React from 'react';
import { Calculator, Table2, Users, FileText } from 'lucide-react';

export type TabType = 'kalkulator' | 'matriks' | 'penerima' | 'laporan';

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
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg shadow-slate-900/10"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors relative ${
                isActive ? 'text-teal-700' : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-semibold px-1 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 whitespace-nowrap ${
                  isActive ? 'font-bold text-teal-800' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>

              {/* Active subtle bar */}
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-teal-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
