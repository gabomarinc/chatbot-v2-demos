import { useState } from 'react';
import { Plus, ChevronDown, Search } from 'lucide-react';

export function ChannelsScreen() {
  const [showModal, setShowModal] = useState(false);

  const channels = [
    { name: 'Kônsul – Axel', type: 'WhatsApp', agent: 'Paulina', identifier: '+507 6789-1234', status: 'Conectado' },
    { name: 'NOC Center', type: 'Instagram', agent: 'Carlos', identifier: '@noccenter', status: 'Conectado' },
    { name: 'Soporte Web', type: 'Webchat', agent: 'Sofia', identifier: 'https://web.ejemplo.com', status: 'Conectado' },
    { name: 'Ventas Bot', type: 'Telegram', agent: 'Miguel', identifier: '@ventasbot', status: 'Desconectado' },
  ];

  const channelOptions = [
    { name: 'Telegram', description: 'Conecta tu bot de Telegram', price: 'Gratis', icon: '📱' },
    { name: 'WhatsApp Meta', description: 'API oficial de WhatsApp Business', price: '$29/mes', icon: '💬' },
    { name: 'WhatsApp Web', description: 'Conexión vía WhatsApp Web', price: 'Gratis', icon: '💚' },
    { name: 'Instagram', description: 'Mensajes directos de Instagram', price: 'Gratis', icon: '📷' },
    { name: 'Messenger', description: 'Facebook Messenger', price: 'Gratis', icon: '💙' },
    { name: 'Mercado Libre', description: 'Preguntas de Mercado Libre', price: 'Gratis', icon: '🛒' },
    { name: 'Web Chat', description: 'Chat embebido en tu sitio', price: 'Gratis', icon: '🌐' },
    { name: 'SMS', description: 'Mensajes de texto SMS', price: '$0.05/SMS', icon: '📨' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Canales</h1>
          <p className="text-gray-500">Conecta y gestiona tus canales de comunicación</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nuevo canal
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          <span>Todos los agentes</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o identificador"
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Channels List */}
      <div className="space-y-3">
        {channels.map((channel, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    channel.type === 'WhatsApp'
                      ? 'bg-green-50'
                      : channel.type === 'Instagram'
                      ? 'bg-pink-50'
                      : channel.type === 'Telegram'
                      ? 'bg-blue-50'
                      : 'bg-purple-50'
                  }`}
                >
                  {channel.type === 'WhatsApp' && '💬'}
                  {channel.type === 'Instagram' && '📷'}
                  {channel.type === 'Telegram' && '📱'}
                  {channel.type === 'Webchat' && '🌐'}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-gray-900">{channel.name}</h3>
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{channel.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Agente: {channel.agent}</span>
                    <span>•</span>
                    <span>{channel.identifier}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${channel.status === 'Conectado' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm ${channel.status === 'Conectado' ? 'text-green-700' : 'text-gray-500'}`}>
                    {channel.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-gray-900 mb-2">¿Qué canal deseas conectar?</h2>
            <p className="text-gray-500 mb-8">Selecciona el canal que quieres integrar con tus agentes</p>

            <div className="grid grid-cols-3 gap-4">
              {channelOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-500 transition-all cursor-pointer group">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <h3 className="text-gray-900 mb-2">{option.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{option.description}</p>
                  <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {option.price === 'Gratis' ? 'Conectar Gratis' : option.price}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
