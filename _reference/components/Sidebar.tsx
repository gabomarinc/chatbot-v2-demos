import { LayoutDashboard, Bot, Users, Radio, MessageSquare, UserCircle, Clock, CreditCard, Settings, Gift, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Sidebar({ currentScreen, onNavigate }: SidebarProps) {
  const menuSections = [
    {
      title: 'VISIÓN GENERAL',
      items: [
        { id: 'dashboard', label: 'Paneles', icon: LayoutDashboard, color: 'blue' },
      ]
    },
    {
      title: 'INSCRIPCIONES',
      items: [
        { id: 'agents', label: 'Agentes', icon: Bot, color: 'purple' },
        { id: 'team', label: 'Equipo', icon: Users, color: 'green' },
        { id: 'channels', label: 'Canales', icon: Radio, color: 'orange' },
      ]
    },
    {
      title: 'COMUNICACIÓN',
      items: [
        { id: 'chat', label: 'Chat', icon: MessageSquare, color: 'indigo' },
        { id: 'contacts', label: 'Contactos', icon: UserCircle, color: 'pink' },
        { id: 'attentions', label: 'Atenciones', icon: Clock, color: 'cyan' },
      ]
    },
    {
      title: 'CUENTA',
      items: [
        { id: 'billing', label: 'Facturación', icon: CreditCard, color: 'emerald' },
        { id: 'settings', label: 'Configuraciones', icon: Settings, color: 'gray' },
      ]
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      const activeColors: { [key: string]: string } = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        indigo: 'bg-indigo-500',
        pink: 'bg-pink-500',
        cyan: 'bg-cyan-500',
        emerald: 'bg-emerald-500',
        gray: 'bg-gray-500',
      };
      return activeColors[color] || 'bg-purple-500';
    }
    return 'bg-gray-100';
  };

  const getTextColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      const textColors: { [key: string]: string } = {
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        green: 'text-green-600',
        orange: 'text-orange-600',
        indigo: 'text-indigo-600',
        pink: 'text-pink-600',
        cyan: 'text-cyan-600',
        emerald: 'text-emerald-600',
        gray: 'text-gray-600',
      };
      return textColors[color] || 'text-purple-600';
    }
    return 'text-gray-400';
  };

  return (
    <div className="w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900">Kônsul</div>
              <div className="text-xs text-gray-500">Agentes de IA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <div className="text-xs text-gray-400 mb-3 px-2 tracking-wide">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all ${
                      isActive
                        ? 'bg-white shadow-md border border-gray-200'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 px-3 py-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        getColorClasses(item.color, isActive)
                      } ${isActive ? 'shadow-sm' : 'group-hover:scale-105'}`}>
                        <Icon className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                      </div>
                      <span className={`text-sm transition-colors ${
                        isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${
                        getColorClasses(item.color, true)
                      }`}></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Referral Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full translate-y-10 -translate-x-10 opacity-50"></div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-900">Recomienda</div>
                <div className="text-xs text-gray-500">Gana recompensas</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white shadow-sm"></div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white shadow-sm"></div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white shadow-sm"></div>
              </div>
              <span className="text-xs text-gray-600">+18 referidos</span>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-2.5 text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm">
              Invitar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
