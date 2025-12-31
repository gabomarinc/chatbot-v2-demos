'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Copy, Check, Info, AlertTriangle, ArrowRight, MessageCircle } from 'lucide-react';
import { createChannel, updateChannel, getChannels } from '@/lib/actions/dashboard';

interface Agent {
    id: string;
    name: string;
}

interface MessengerConfigProps {
    agents: Agent[];
    initialAgentId?: string;
    initialChannelId?: string;
}

export function MessengerConfig({ agents, initialAgentId, initialChannelId }: MessengerConfigProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        agentId: initialAgentId || '',
        displayName: '',
        pageAccessToken: '',
        pageId: '',
        verifyToken: Math.random().toString(36).substring(7),
    });

    const [existingChannel, setExistingChannel] = useState<any>(null);

    // Load existing channel data if editing
    useEffect(() => {
        const loadChannel = async () => {
            if (initialChannelId) {
                setIsLoading(true);
                try {
                    // Logic to fetch specific channel would go here if we had a direct fetch action
                    // For now, fetching all and filtering (efficient enough for dashboard)
                    const channels = await getChannels();
                    const channel = channels.find(c => c.id === initialChannelId);

                    if (channel) {
                        setExistingChannel(channel);
                        const config = channel.configJson as any;
                        setFormData({
                            agentId: channel.agentId,
                            displayName: channel.displayName,
                            pageAccessToken: config?.pageAccessToken || '',
                            pageId: config?.pageId || '',
                            verifyToken: config?.verifyToken || formData.verifyToken,
                        });
                    }
                } catch (error) {
                    console.error('Error loading channel:', error);
                    toast.error('Error cargando configuración del canal');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadChannel();
    }, [initialChannelId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`${field} copiado al portapapeles`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agentId || !formData.pageAccessToken || !formData.pageId) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                agentId: formData.agentId,
                displayName: formData.displayName || `Messenger - ${agents.find(a => a.id === formData.agentId)?.name}`,
                type: 'MESSENGER' as const,
                configJson: {
                    pageAccessToken: formData.pageAccessToken,
                    pageId: formData.pageId,
                    verifyToken: formData.verifyToken
                },
                isActive: true
            };

            if (existingChannel) {
                await updateChannel(existingChannel.id, payload);
                toast.success('Configuración actualizada correctamente');
            } else {
                await createChannel(payload);
                toast.success('Canal de Messenger conectado correctamente');
            }

            router.push('/channels');
            router.refresh();
        } catch (error) {
            console.error('Error saving channel:', error);
            toast.error('Error al guardar la configuración');
        } finally {
            setIsSubmitting(false);
        }
    };

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/webhooks/messenger`
        : 'https://[tu-dominio]/api/webhooks/messenger';

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-fullblur-[80px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-white mb-2">Facebook Messenger</h2>
                            <div className="flex items-center gap-2 text-blue-100 font-medium">
                                <span className="px-2 py-0.5 rounded-md bg-blue-500/50 border border-blue-400/50 text-xs font-bold uppercase tracking-wider">BETA</span>
                                <span>Integración Oficial</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-blue-50 text-lg max-w-2xl font-medium leading-relaxed">
                        Conecta tu Página de Facebook para recibir y responder mensajes automáticamente usando tus agentes de IA.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Configuration Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8">

                        {/* Agent Selection */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Agente Responsable
                            </label>
                            <div className="relative">
                                <select
                                    name="agentId"
                                    value={formData.agentId}
                                    onChange={handleChange}
                                    className="w-full pl-5 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white"
                                    required
                                >
                                    <option value="">Selecciona un Agente...</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ArrowRight className="w-5 h-5 rotate-90" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 font-medium px-2">
                                Este agente procesará todos los mensajes entrantes de Messenger.
                            </p>
                        </div>

                        <div className="h-px bg-gray-100"></div>

                        {/* Credentials */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg">Credenciales de la Página</h3>
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Identificador de la Página (Page ID)
                                    </label>
                                    <input
                                        type="text"
                                        name="pageId"
                                        value={formData.pageId}
                                        onChange={handleChange}
                                        placeholder="Ej: 102030405060708"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-mono text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Token de Acceso de la Página
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="pageAccessToken"
                                            value={formData.pageAccessToken}
                                            onChange={handleChange}
                                            placeholder="EAA..."
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-mono text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all pr-12"
                                            required
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                            <Info className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1.5 bg-blue-50 inline-block px-3 py-1.5 rounded-lg border border-blue-100">
                                        <Info className="w-3.5 h-3.5" />
                                        Requiere permisos `pages_messaging`
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100"></div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Check className="w-6 h-6" />
                                    {existingChannel ? 'Actualizar Configuración' : 'Conectar Messenger'}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Sidebar Guide */}
                <div className="space-y-6">
                    {/* Webhook Info Card */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>

                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Configuración Webhook
                        </h3>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Callback URL</label>
                                <div className="flex items-center gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                                    <code className="text-xs font-mono text-blue-300 flex-1 truncate">
                                        {webhookUrl}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(webhookUrl, 'URL')}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                    >
                                        {copiedField === 'URL' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify Token</label>
                                <div className="flex items-center gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                                    <code className="text-xs font-mono text-blue-300 flex-1 truncate">
                                        {formData.verifyToken}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(formData.verifyToken, 'Token')}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                    >
                                        {copiedField === 'Token' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-500 pt-1">
                                    Usa este token para verificar el webhook en Meta.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Steps Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Guía Rápida</h3>
                        <div className="space-y-6">
                            {[
                                { title: 'Crea una App en Meta', desc: 'Tipo Negocios (Business)' },
                                { title: 'Añade el producto Messenger', desc: 'En la configuración de la app' },
                                { title: 'Configura el Webhook', desc: 'Usa la URL y Token de arriba. Suscríbete a "messages".' },
                                { title: 'Genera el Token', desc: 'Vincula tu Página y genera el token de acceso.' }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{step.title}</p>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
