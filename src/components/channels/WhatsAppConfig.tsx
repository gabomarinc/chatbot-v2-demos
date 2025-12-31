'use client';

import { useState } from 'react';
import { createChannel, updateChannel } from '@/lib/actions/dashboard';
import { Loader2, CheckCircle2, MessageSquare, ShieldCheck, Key, Phone, Link2, Copy, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { WhatsAppEmbeddedSignup } from './WhatsAppEmbeddedSignup';

interface Agent {
    id: string;
    name: string;
}

interface WhatsAppConfigProps {
    agents: Agent[];
    existingChannel?: any;
    metaAppId?: string;
    defaultAgentId?: string;
}

export function WhatsAppConfig({ agents, existingChannel, metaAppId, defaultAgentId }: WhatsAppConfigProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showManual, setShowManual] = useState(false);

    const [formData, setFormData] = useState({
        agentId: existingChannel?.agentId || defaultAgentId || (agents.length > 0 ? agents[0].id : ''),
        displayName: existingChannel?.displayName || 'WhatsApp Business',
        accessToken: existingChannel?.configJson?.accessToken || '',
        phoneNumberId: existingChannel?.configJson?.phoneNumberId || '',
        wabaId: existingChannel?.configJson?.wabaId || '',
        verifyToken: existingChannel?.configJson?.verifyToken || Math.random().toString(36).substring(7),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.accessToken || !formData.phoneNumberId) {
            toast.error('Token y Phone Number ID son obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                agentId: formData.agentId,
                displayName: formData.displayName,
                type: 'WHATSAPP' as const,
                configJson: {
                    accessToken: formData.accessToken,
                    phoneNumberId: formData.phoneNumberId,
                    wabaId: formData.wabaId,
                    verifyToken: formData.verifyToken
                },
                isActive: true
            };

            if (existingChannel) {
                await updateChannel(existingChannel.id, {
                    displayName: formData.displayName,
                    configJson: payload.configJson
                });
            } else {
                await createChannel(payload);
            }

            setIsSaved(true);
            toast.success('Configuración de WhatsApp guardada');
            router.refresh();
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error('Error saving WhatsApp:', error);
            toast.error('Error al guardar la configuración');
        } finally {
            setIsLoading(false);
        }
    };

    const webhookUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/whatsapp`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
            {/* Configuration Form */}
            <div className="space-y-8">
                {/* Professional Option */}
                {metaAppId ? (
                    (!showManual || !existingChannel) && (
                        <WhatsAppEmbeddedSignup
                            appId={metaAppId}
                            agentId={formData.agentId}
                            configId={existingChannel?.configJson?.configId}
                            onSuccess={() => router.refresh()}
                        />
                    )
                ) : (
                    <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 flex gap-4 items-start shadow-sm">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-amber-900 font-bold text-sm">Conexión Profesional Deshabilitada</h4>
                            <p className="text-amber-700 text-xs leading-relaxed">
                                Para habilitar la conexión simplificada, configura el <span className="font-bold">Meta App ID</span> en el panel de <Link2 className="inline w-3 h-3" /> <span className="underline cursor-pointer" onClick={() => router.push('/admin/settings')}>Administrador &gt; Configuración</span>.
                            </p>
                        </div>
                    </div>
                )}

                {/* Manual Credentials and Agent Selection Form */}
                {(showManual || existingChannel || !metaAppId) && (
                    <>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                    <Key className="w-5 h-5" />
                                </div>
                                <h3 className="text-gray-900 font-extrabold text-lg tracking-tight">Credenciales de Meta</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Agente Responsable</label>
                                    <select
                                        disabled={!!existingChannel}
                                        value={formData.agentId}
                                        onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:bg-white focus:border-green-500 transition-all font-medium appearance-none cursor-pointer disabled:opacity-50"
                                    >
                                        {agents.map(agent => (
                                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Access Token (Permanente)</label>
                                    <input
                                        type="password"
                                        value={formData.accessToken}
                                        onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                                        placeholder="EAAG..."
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:bg-white focus:border-green-500 transition-all font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number ID</label>
                                        <input
                                            type="text"
                                            value={formData.phoneNumberId}
                                            onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                                            placeholder="1234567890..."
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:bg-white focus:border-green-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">WABA ID (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.wabaId}
                                            onChange={(e) => setFormData({ ...formData, wabaId: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:bg-white focus:border-green-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Link2 className="w-5 h-5" />
                                </div>
                                <h3 className="text-gray-900 font-extrabold text-lg tracking-tight">Configuración del Webhook</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 italic text-xs text-amber-700 leading-relaxed font-medium">
                                    Configura esta URL en el portal de Meta for Developers dentro de la sección "WhatsApp &gt; Configuration".
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">URL del Webhook</label>
                                    <div className="relative">
                                        <input
                                            readOnly
                                            type="text"
                                            value={webhookUrl}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm transition-all font-mono"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(webhookUrl);
                                                toast.success('URL copiada');
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Verify Token</label>
                                    <div className="relative">
                                        <input
                                            readOnly
                                            type="text"
                                            value={formData.verifyToken}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm transition-all font-mono"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(formData.verifyToken);
                                                toast.success('Token copiado');
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-4 bg-green-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span>{existingChannel ? 'Actualizar Configuración' : 'Activar Canal WhatsApp'}</span>
                            )}
                        </button>
                    </>
                )}

                {/* Toggle Manual/Simplificada */}
                {!existingChannel && metaAppId && (
                    <button
                        onClick={() => setShowManual(!showManual)}
                        className="w-full py-4 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Settings2 className="w-4 h-4" />
                        {showManual ? 'Ver Conexión Simplificada (Recomendado)' : 'Configuración Manual Avanzada'}
                    </button>
                )}
            </div>

            {/* Guide Column */}
            <div className="space-y-8">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6 text-left">
                    <div className="flex items-center gap-3 text-white">
                        <MessageSquare className="w-6 h-6 text-green-500" />
                        <h3 className="font-extrabold text-xl tracking-tight">Guía de Conexión</h3>
                    </div>

                    <div className="space-y-6 text-slate-400 text-sm font-medium">
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white shrink-0">1</div>
                            <p>Crea una App de tipo <span className="text-white">"Business"</span> en Meta for Developers.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white shrink-0">2</div>
                            <p>Añade el producto <span className="text-white">"WhatsApp"</span> a tu aplicación.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white shrink-0">3</div>
                            <p>Genera un <span className="text-white">System User Access Token</span> con permisos <code className="text-green-500">whatsapp_business_messaging</code>.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white shrink-0">4</div>
                            <p>Copia el <span className="text-white">Phone Number ID</span> desde el panel de WhatsApp de Meta.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white shrink-0">5</div>
                            <p>Configura el Webhook arriba indicado y <span className="text-white">suscríbete al campo "messages"</span>.</p>
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-[11px] text-green-400 leading-relaxed font-bold">
                            TIP: Configura el "Meta App ID" en el panel de Admin para habilitar la conexión en 1-clic.
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Conexión Segura Directa</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
