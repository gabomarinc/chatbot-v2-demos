import { CheckCircle, CreditCard, Zap } from 'lucide-react';

export function BillingScreen() {
  const benefits = [
    '5,000 créditos mensuales incluidos',
    'Hasta 3 agentes activos',
    'Conexión ilimitada de canales',
    'Soporte prioritario 24/7',
    'Entrenamientos ilimitados',
    'Acceso a todas las integraciones',
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Facturación</h1>
        <p className="text-gray-500">Gestiona tu suscripción y créditos</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Subscription Status */}
        <div className="col-span-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6" />
                <span className="text-sm">Estado de suscripción</span>
              </div>
              <h2 className="text-white mb-1">Plan Profesional</h2>
              <p className="text-purple-100">Tu suscripción está activa</p>
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-purple-100">Renovación automática</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-purple-400/30">
            <div>
              <p className="text-sm text-purple-100 mb-1">Próximo cobro</p>
              <p className="text-white">01 Enero 2025</p>
            </div>
            <div>
              <p className="text-sm text-purple-100 mb-1">Monto</p>
              <p className="text-white">$99.00 USD / mes</p>
            </div>
          </div>
        </div>

        {/* Credit Balance */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Saldo de Créditos</p>
              <h3 className="text-gray-900">2,488</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Usados este mes</span>
              <span className="text-gray-900">2,512</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <p className="text-xs text-gray-500">50% del plan usado</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Plan Benefits */}
        <div className="col-span-2 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-6">Beneficios del plan</h3>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="px-6 py-2.5 text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
              Ver todos los planes
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-4">Método de pago</h3>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-900">•••• 4242</p>
                <p className="text-xs text-gray-500">Vence 12/25</p>
              </div>
            </div>
          </div>
          <button className="w-full px-4 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Actualizar método
          </button>
        </div>
      </div>

      {/* Buy Extra Credits */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-gray-900 mb-2">Comprar créditos extras</h3>
            <p className="text-sm text-gray-500">Añade créditos adicionales cuando los necesites</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="auto-credits" className="rounded" />
            <label htmlFor="auto-credits" className="text-sm text-gray-700">Créditos extra automáticos</label>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { amount: 1000, price: 10, popular: false },
            { amount: 5000, price: 45, popular: true },
            { amount: 10000, price: 85, popular: false },
            { amount: 25000, price: 200, popular: false },
          ].map((pack) => (
            <div
              key={pack.amount}
              className={`relative bg-white rounded-xl p-6 border-2 transition-all cursor-pointer hover:shadow-md ${
                pack.popular ? 'border-purple-500 shadow-md' : 'border-gray-200'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white rounded-full text-xs">
                  Más popular
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Créditos</p>
                <p className="text-2xl text-gray-900 mb-3">{pack.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-900 mb-4">${pack.price} USD</p>
                <button
                  className={`w-full px-4 py-2 rounded-lg text-sm transition-colors ${
                    pack.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Cantidad personalizada"
              className="w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500">$0.01 por crédito</span>
          </div>
          <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
