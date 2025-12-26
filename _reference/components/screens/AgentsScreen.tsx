import { Plus, MoreVertical, Zap, MessageSquare, Calendar } from 'lucide-react';

interface AgentsScreenProps {
  onSelectAgent: (id: string) => void;
}

export function AgentsScreen({ onSelectAgent }: AgentsScreenProps) {
  const agents = [
    { 
      id: '1', 
      name: 'Paulina', 
      status: 'Activo', 
      description: 'Vendedor en Panamá Pacífico Partners', 
      avatar: '👩',
      model: 'GPT-4.1 Mini',
      channels: 3,
      conversations: 1247,
      creditsUsed: 2847
    },
    { 
      id: '2', 
      name: 'Carlos', 
      status: 'Activo', 
      description: 'Soporte técnico para servicios IT', 
      avatar: '👨',
      model: 'GPT-4.0',
      channels: 2,
      conversations: 892,
      creditsUsed: 2156
    },
    { 
      id: '3', 
      name: 'Sofia', 
      status: 'Activo', 
      description: 'Atención al cliente - E-commerce', 
      avatar: '👩',
      model: 'Claude 3 Sonnet',
      channels: 4,
      conversations: 654,
      creditsUsed: 1923
    },
    { 
      id: '4', 
      name: 'Miguel', 
      status: 'Inactivo', 
      description: 'Agente de ventas - Sector inmobiliario', 
      avatar: '👨',
      model: 'GPT-4.1 Mini',
      channels: 1,
      conversations: 0,
      creditsUsed: 0
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Agentes</h1>
          <p className="text-gray-500">Crea, entrena y gestiona tus agentes de IA</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Crear agente
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        <button className="px-4 py-2 bg-white rounded-md text-sm text-gray-900 shadow-sm">
          Todos
        </button>
        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          Activos
        </button>
        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          Inactivos
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer group"
            onClick={() => onSelectAgent(agent.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
                  {agent.avatar}
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">{agent.name}</h3>
                  <p className="text-xs text-gray-500">{agent.model}</p>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">{agent.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-lg text-gray-900 mb-1">{agent.channels}</div>
                <div className="text-xs text-gray-500">Canales</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-lg text-gray-900 mb-1">{agent.conversations}</div>
                <div className="text-xs text-gray-500">Conversaciones</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-900 mb-1">{agent.creditsUsed}</div>
                <div className="text-xs text-gray-500">Créditos</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
                  agent.status === 'Activo'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Activo' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                {agent.status}
              </span>
              <span className="text-xs text-purple-600 group-hover:text-purple-700">Ver detalles →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
