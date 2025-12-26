import { Search, Paperclip, Send, MoreVertical, Phone, Video, UserPlus, X, Calendar } from 'lucide-react';

export function ChatScreen() {
  const conversations = [
    {
      id: 1,
      name: 'Juan Martínez',
      lastMessage: 'Gracias por la información',
      time: '2m',
      agent: 'Paulina',
      unread: 0,
      avatar: '👨',
    },
    {
      id: 2,
      name: 'Desconocido',
      lastMessage: '¿Cuáles son los horarios?',
      time: '15m',
      agent: 'Carlos',
      unread: 2,
      avatar: '❓',
    },
    {
      id: 3,
      name: 'Laura Ruiz',
      lastMessage: 'Perfecto, nos vemos mañana',
      time: '1h',
      agent: 'Sofia',
      unread: 0,
      avatar: '👩',
    },
  ];

  const messages = [
    { from: 'client', text: 'Hola, quisiera información sobre los apartamentos disponibles', time: '10:23' },
    { from: 'agent', text: '¡Hola! Claro, con gusto te ayudo. Tenemos varias opciones disponibles en Panamá Pacífico. ¿Buscas algo específico?', time: '10:24' },
    { from: 'client', text: 'Me interesan apartamentos de 2 habitaciones', time: '10:25' },
    { from: 'agent', text: 'Excelente. Tenemos varios apartamentos de 2 habitaciones entre 85m² y 120m². ¿Qué presupuesto tienes en mente?', time: '10:26' },
    { from: 'client', text: 'Entre $150,000 y $200,000', time: '10:27' },
    { from: 'agent', text: 'Perfecto, tengo 3 opciones que se ajustan a tu presupuesto. ¿Te gustaría agendar una visita?', time: '10:28' },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                conv.id === 1 ? 'bg-purple-50 border-l-4 border-l-purple-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900 truncate">{conv.name}</span>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mb-1">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Agente: {conv.agent}</span>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-lg">
              👨
            </div>
            <div>
              <h3 className="text-gray-900 text-sm">Juan Martínez</h3>
              <p className="text-xs text-gray-500">WhatsApp • Atendido por Paulina</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md ${message.from === 'agent' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.from === 'agent'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${message.from === 'agent' ? 'text-right' : 'text-left'}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-end gap-3">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="w-full bg-transparent focus:outline-none text-sm text-gray-900 placeholder-gray-400"
              />
            </div>
            <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info Panel */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          {/* Contact Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              👨
            </div>
            <h3 className="text-gray-900 mb-1">Juan Martínez</h3>
            <p className="text-sm text-gray-500">+507 6234-5678</p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-xs text-gray-600 mb-2">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs border border-purple-200">
                Cliente VIP
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
                Interesado
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors">
              <UserPlus className="w-5 h-5" />
              Asumir atención
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
              <Calendar className="w-5 h-5" />
              Agendar cita
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
              <X className="w-5 h-5" />
              Cerrar atención
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Canal</label>
              <p className="text-sm text-gray-900">WhatsApp</p>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Agente asignado</label>
              <p className="text-sm text-gray-900">Paulina</p>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Estado</label>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Activo
              </span>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Primera interacción</label>
              <p className="text-sm text-gray-900">01 Dic 2024, 10:23</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
