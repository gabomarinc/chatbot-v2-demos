import { useState } from 'react';
import { ChevronLeft, Play, MoreVertical, Globe, Upload, FileText, Video, CheckCircle, AlertCircle, Loader, Settings } from 'lucide-react';

interface AgentDetailScreenProps {
  onBack: () => void;
}

export function AgentDetailScreen({ onBack }: AgentDetailScreenProps) {
  const [activeTab, setActiveTab] = useState('perfil');
  const [activeTrainingTab, setActiveTrainingTab] = useState('sitio-web');
  const [activeWorkType, setActiveWorkType] = useState('soporte');

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: '👤' },
    { id: 'trabajo', label: 'Trabajo', icon: '💼' },
    { id: 'entrenamientos', label: 'Entrenamientos', icon: '📚' },
    { id: 'intenciones', label: 'Intenciones', icon: '🎯' },
    { id: 'integraciones', label: 'Integraciones', icon: '🔌' },
    { id: 'servidores', label: 'Servidores MCP', icon: '🖥️' },
    { id: 'canales', label: 'Canales', icon: '📡' },
    { id: 'configuraciones', label: 'Configuraciones', icon: '⚙️' },
  ];

  const trainings = [
    { url: 'https://ejemplo.com/sitemap.xml', status: 'entrenado', date: '2024-12-01' },
    { url: 'https://ejemplo.com/docs', status: 'entrenando', date: '2024-12-02' },
    { url: 'https://ejemplo.com/faq', status: 'error', date: '2024-12-01' },
  ];

  const integrations = [
    {
      name: 'ElevenLabs',
      description: 'Genera voces realistas con IA para tus agentes',
      icon: '🎙️',
    },
    {
      name: 'Google Calendar',
      description: 'Sincroniza y gestiona eventos automáticamente',
      icon: '📅',
    },
    {
      name: 'PlugChat',
      description: 'Conecta con múltiples canales de mensajería',
      icon: '💬',
    },
    {
      name: 'E-Vendi',
      description: 'Integración con plataforma de e-commerce',
      icon: '🛒',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="max-w-3xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nombre del agente</label>
                <input
                  type="text"
                  defaultValue="Paulina"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Comunicación</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Formal', 'Normal', 'Desenfadada'].map((style) => (
                    <button
                      key={style}
                      className={`px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${
                        style === 'Normal'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Comportamiento</label>
                <textarea
                  rows={8}
                  defaultValue="Eres un asistente amigable y profesional especializado en ventas de bienes raíces. Tu objetivo es ayudar a los clientes a encontrar la propiedad perfecta, responder preguntas sobre proyectos inmobiliarios y agendar visitas."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="text-xs text-gray-500 mt-2">245 / 1000 caracteres</div>
              </div>

              <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                Guardar cambios
              </button>
            </div>
          </div>
        );

      case 'trabajo':
        return (
          <div className="max-w-3xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-3">Tipo de trabajo</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'soporte', label: 'Soporte', icon: '🎧' },
                    { id: 'ventas', label: 'Ventas', icon: '💼' },
                    { id: 'personal', label: 'Uso personal', icon: '👤' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveWorkType(type.id)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm transition-all flex items-center gap-2 ${
                        activeWorkType === type.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Brinda soporte para:</label>
                <input
                  type="text"
                  defaultValue="Panamá Pacífico Partners"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Sitio oficial (opcional)</label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Describe un poco sobre tu empresa o proyecto</label>
                <textarea
                  rows={6}
                  placeholder="Cuéntanos sobre tu empresa, productos o servicios..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="text-xs text-gray-500 mt-2">0 / 500 caracteres</div>
              </div>

              <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                Guardar cambios
              </button>
            </div>
          </div>
        );

      case 'entrenamientos':
        return (
          <div className="max-w-4xl">
            <div className="space-y-6">
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-fit">
                {[
                  { id: 'texto', label: 'Texto', icon: FileText },
                  { id: 'sitio-web', label: 'Sitio web', icon: Globe },
                  { id: 'video', label: 'Video', icon: Video },
                  { id: 'documento', label: 'Documento', icon: Upload },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTrainingTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                        activeTrainingTab === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {activeTrainingTab === 'sitio-web' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Pegue la URL de sitio web o sitemap</label>
                        <input
                          type="url"
                          placeholder="https://ejemplo.com/sitemap.xml"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Intervalo de actualización</label>
                          <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option>Nunca</option>
                            <option>Diario</option>
                            <option>Semanal</option>
                            <option>Mensual</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Navegar subpáginas</label>
                          <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option>Sí</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>

                      <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                        Registrar entrenamiento
                      </button>
                    </div>
                  </div>

                  {/* Training List */}
                  <div className="space-y-3">
                    <h3 className="text-sm text-gray-700">Entrenamientos registrados</h3>
                    {trainings.map((training, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">{training.url}</div>
                            <div className="text-xs text-gray-500">{training.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {training.status === 'entrenado' && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Entrenado
                            </span>
                          )}
                          {training.status === 'entrenando' && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
                              <Loader className="w-3.5 h-3.5 animate-spin" />
                              Entrenando
                            </span>
                          )}
                          {training.status === 'error' && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs border border-red-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Error
                            </span>
                          )}
                          <button className="p-1.5 hover:bg-gray-50 rounded-lg">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'intenciones':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-12 border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                <div className="text-6xl">🎯</div>
              </div>
              <h3 className="text-gray-900 mb-2">Crear una intención</h3>
              <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                Las intenciones permiten que tu agente identifique y responda a solicitudes específicas de los usuarios
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                  Registrar primera intención
                </button>
                <button className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Importar
                </button>
              </div>
            </div>
          </div>
        );

      case 'integraciones':
        return (
          <div className="max-w-4xl">
            <div className="grid grid-cols-2 gap-6">
              {integrations.map((integration, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all">
                  <div className="text-4xl mb-4">{integration.icon}</div>
                  <h3 className="text-gray-900 mb-2">{integration.name}</h3>
                  <p className="text-sm text-gray-500 mb-6">{integration.description}</p>
                  <button className="w-full px-4 py-2.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors">
                    Activar integración
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'servidores':
        return (
          <div className="max-w-3xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 mb-1">Servidores MCP</h3>
                  <p className="text-sm text-gray-500">Conecta servidores Model Context Protocol</p>
                </div>
                <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                  Agregar servidor
                </button>
              </div>
              <div className="bg-white rounded-3xl p-12 border border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-6xl mb-4">🖥️</div>
                <p className="text-gray-500">No hay servidores MCP conectados</p>
              </div>
            </div>
          </div>
        );

      case 'canales':
        return (
          <div className="max-w-3xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 mb-1">Canales conectados</h3>
                  <p className="text-sm text-gray-500">Gestiona los canales donde este agente está activo</p>
                </div>
                <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                  Conectar canal
                </button>
              </div>
              <div className="space-y-3">
                {['WhatsApp', 'Instagram', 'Telegram', 'Webchat'].map((channel) => (
                  <div key={channel} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"></div>
                      <div>
                        <div className="text-sm text-gray-900">{channel}</div>
                        <div className="text-xs text-gray-500">Conectado</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">Contenido en desarrollo</div>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5" />
          Volver
        </button>
        
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
          <Play className="w-4 h-4" />
          Prueba tu agente
        </button>
      </div>

      {/* Agent Info Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            👩
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900">Paulina</h1>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Activo
              </span>
            </div>
            <p className="text-gray-500 mb-4">Vendedor en Panamá Pacífico Partners</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Modelo</div>
                  <div className="text-sm text-gray-900">GPT-4.1 Mini</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📡</span>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Canales</div>
                  <div className="text-sm text-gray-900">3 conectados</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💬</span>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Conversaciones</div>
                  <div className="text-sm text-gray-900">1,247 totales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-x-auto">
        <div className="flex p-2 gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-50 text-purple-700 border-2 border-purple-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
}
