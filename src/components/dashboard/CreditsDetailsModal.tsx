'use client'

import { useState, useEffect } from 'react';
import { X, Coins, TrendingUp, Bot, Zap, Clock, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

interface CreditsDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    creditsData: any;
    isLoading?: boolean;
}

export function CreditsDetailsModal({ isOpen, onClose, creditsData, isLoading = false }: CreditsDetailsModalProps) {
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    if (isLoading || !creditsData) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-xl overflow-hidden max-h-[90vh] animate-scale-in">
                    <div className="flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21AC96]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#21AC96]/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#21AC96]/10 flex items-center justify-center text-[#21AC96]">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">Detalle de Créditos</h2>
                            <p className="text-sm text-gray-400 font-medium">Información completa sobre el uso de créditos</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Main Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-[#21AC96]/10 to-[#21AC96]/5 rounded-2xl p-5 border border-[#21AC96]/20">
                            <div className="flex items-center gap-3 mb-2">
                                <Coins className="w-5 h-5 text-[#21AC96]" />
                                <span className="text-sm font-bold text-gray-600">Balance Actual</span>
                            </div>
                            <p className="text-3xl font-extrabold text-gray-900">{creditsData.balance.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">créditos disponibles</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold text-gray-600">Total Usado</span>
                            </div>
                            <p className="text-3xl font-extrabold text-gray-900">{creditsData.totalUsed.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">histórico total</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-2xl p-5 border border-purple-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-bold text-gray-600">Promedio Diario</span>
                            </div>
                            <p className="text-3xl font-extrabold text-gray-900">{creditsData.avgDailyUsage}</p>
                            <p className="text-xs text-gray-400 mt-1">últimos 7 días</p>
                        </div>
                    </div>

                    {/* Projection */}
                    {creditsData.daysRemaining !== null && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-yellow-700" />
                                <span className="text-sm font-bold text-yellow-900">Proyección</span>
                            </div>
                            <p className="text-sm text-yellow-800">
                                Con el consumo actual, tus créditos durarán aproximadamente <span className="font-bold">{creditsData.daysRemaining} días</span>
                            </p>
                        </div>
                    )}

                    {/* Subscription Info */}
                    {creditsData.subscription && (
                        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-600 mb-1">Plan de Suscripción</p>
                                    <p className="text-lg font-extrabold text-gray-900">{creditsData.subscription.planName || creditsData.subscription.planType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-600 mb-1">Próxima Renovación</p>
                                    <p className="text-lg font-extrabold text-gray-900">
                                        {format(new Date(creditsData.subscription.currentPeriodEnd), 'd MMM yyyy', { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Daily Usage Chart */}
                    {creditsData.dailyUsage && creditsData.dailyUsage.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
                            <h3 className="text-lg font-extrabold text-gray-900 mb-4">Uso Diario (Últimos 7 días)</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={creditsData.dailyUsage}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            tickFormatter={(value) => format(new Date(value), 'd MMM', { locale: es })}
                                        />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-gray-900 text-white px-3 py-2 rounded-xl">
                                                            <p className="text-xs font-bold text-gray-300 mb-1">
                                                                {format(new Date(data.date), 'd MMM', { locale: es })}
                                                            </p>
                                                            <p className="text-sm font-bold">
                                                                {data.credits} créditos
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Line type="monotone" dataKey="credits" stroke="#21AC96" strokeWidth={3} dot={{ fill: '#21AC96', r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Breakdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* By Agent */}
                        {creditsData.agentUsage && creditsData.agentUsage.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Bot className="w-5 h-5 text-[#21AC96]" />
                                    <h3 className="text-lg font-extrabold text-gray-900">Por Agente</h3>
                                </div>
                                <div className="space-y-3">
                                    {creditsData.agentUsage.map((agent: any, index: number) => (
                                        <div key={agent.agentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#21AC96]/10 flex items-center justify-center text-[#21AC96] font-bold text-sm">
                                                    #{index + 1}
                                                </div>
                                                <span className="font-bold text-gray-900">{agent.agentName}</span>
                                            </div>
                                            <span className="font-extrabold text-[#21AC96]">{agent.credits.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* By Model */}
                        {creditsData.modelUsage && creditsData.modelUsage.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-lg font-extrabold text-gray-900">Por Modelo</h3>
                                </div>
                                <div className="space-y-3">
                                    {creditsData.modelUsage.map((model: any, index: number) => (
                                        <div key={model.model} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <span className="font-bold text-gray-900">{model.model}</span>
                                            <span className="font-extrabold text-purple-600">{model.credits.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Usage */}
                    {creditsData.recentUsage && creditsData.recentUsage.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h3 className="text-lg font-extrabold text-gray-900 mb-4">Uso Reciente</h3>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {creditsData.recentUsage.map((usage: any) => (
                                    <div key={usage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#21AC96]"></div>
                                            <span className="font-bold text-gray-700">{usage.agentName}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-500">{usage.model}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500">{format(new Date(usage.date), 'd MMM HH:mm', { locale: es })}</span>
                                            <span className="font-extrabold text-[#21AC96]">{usage.credits} créditos</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={() => {
                            router.push('/billing');
                            onClose();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#21AC96] text-white rounded-xl font-bold hover:bg-[#1a8a78] transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Ver Gestión de Créditos
                    </button>
                </div>
            </div>
        </div>
    );
}

