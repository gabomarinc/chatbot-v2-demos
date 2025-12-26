import { TrendingUp, TrendingDown, CheckCircle, Coins, Users, Calendar, Filter, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function DashboardScreen() {
  const stats = [
    { label: 'Atenciones Finalizadas', value: '1,247', change: '+12.5%', isPositive: true, icon: CheckCircle },
    { label: 'Créditos Gastados', value: '8,932', change: '-5.2%', isPositive: false, icon: Coins },
    { label: 'Nuevos Contactos', value: '342', change: '+23.1%', isPositive: true, icon: Users },
    { label: 'Total de Agendamientos', value: '89', change: '+8.4%', isPositive: true, icon: Calendar },
  ];

  const chartData = [
    { name: 'Ene', creditos: 2400 },
    { name: 'Feb', creditos: 1398 },
    { name: 'Mar', creditos: 3800 },
    { name: 'Abr', creditos: 3908 },
    { name: 'May', creditos: 4800 },
    { name: 'Jun', creditos: 3800 },
  ];

  const modelData = [
    { name: 'GPT-4.1 Mini', credits: 4521, percentage: 45, color: '#8b5cf6' },
    { name: 'GPT-4.0', credits: 2890, percentage: 29, color: '#a78bfa' },
    { name: 'Claude 3 Sonnet', credits: 1654, percentage: 16, color: '#c4b5fd' },
    { name: 'Gemini Pro', credits: 867, percentage: 10, color: '#ddd6fe' },
  ];

  const topAgents = [
    { name: 'Paulina', credits: 2847, avatar: '👩' },
    { name: 'Carlos', credits: 2156, avatar: '👨' },
    { name: 'Sofia', credits: 1923, avatar: '👩' },
  ];

  const topAttendants = [
    { name: 'Ana García', resolved: 234, avatar: '👩' },
    { name: 'Luis Pérez', resolved: 198, avatar: '👨' },
    { name: 'María López', resolved: 176, avatar: '👩' },
  ];

  const topContacts = [
    { name: 'Juan Martínez', interactions: 45, avatar: '👨' },
    { name: 'Laura Ruiz', interactions: 38, avatar: '👩' },
    { name: 'Pedro Silva', interactions: 32, avatar: '👨' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Paneles</h1>
        <p className="text-gray-500">Información en tiempo real sobre tu cuenta y agentes</p>
      </div>

      {/* Tabs and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button className="px-4 py-2 bg-white rounded-md text-sm text-gray-900 shadow-sm">
            Visión General
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Atención
          </button>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <span>Últimos 30 días</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Line Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 mb-1">Créditos por Período</h3>
              <p className="text-sm text-gray-500">Consumo mensual de créditos</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <span>Mensual</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line type="monotone" dataKey="creditos" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Model Usage */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-6">Gastos por Modelo</h3>
          <div className="space-y-4">
            {modelData.map((model, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{model.name}</span>
                  <span className="text-sm text-gray-900">{model.credits}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${model.percentage}%`, backgroundColor: model.color }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{model.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Agents */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-4">Top Agentes</h3>
          <div className="space-y-4">
            {topAgents.map((agent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-lg">
                    {agent.avatar}
                  </div>
                  <span className="text-sm text-gray-700">{agent.name}</span>
                </div>
                <div className="text-sm text-gray-900">{agent.credits}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Attendants */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-4">Top Atendentes</h3>
          <div className="space-y-4">
            {topAttendants.map((attendant, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-lg">
                    {attendant.avatar}
                  </div>
                  <span className="text-sm text-gray-700">{attendant.name}</span>
                </div>
                <div className="text-sm text-gray-900">{attendant.resolved}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contacts */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-4">Top Contactos</h3>
          <div className="space-y-4">
            {topContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg">
                    {contact.avatar}
                  </div>
                  <span className="text-sm text-gray-700">{contact.name}</span>
                </div>
                <div className="text-sm text-gray-900">{contact.interactions}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
