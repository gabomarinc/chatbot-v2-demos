'use client';

import { useEffect, useState } from 'react';
import { Loader2, MessageCircle, ShieldCheck, CheckCircle2, AlertCircle, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import { getFacebookPages, connectMessengerPage } from '@/lib/actions/messenger-auth';

interface MessengerEmbeddedSignupProps {
    appId: string;
    agentId: string;
    onSuccess?: () => void;
}

declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: any;
    }
}

export function MessengerEmbeddedSignup({ appId, agentId, onSuccess }: MessengerEmbeddedSignupProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pages, setPages] = useState<any[]>([]);
    const [showPageSelection, setShowPageSelection] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
            console.warn('Facebook SDK requiere HTTPS.');
        }

        const loadSDK = () => {
            if (document.getElementById('facebook-jssdk')) {
                const checkFB = setInterval(() => {
                    if (window.FB) {
                        setIsLoaded(true);
                        clearInterval(checkFB);
                    }
                }, 100);
                setTimeout(() => clearInterval(checkFB), 5000);
                return;
            }

            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v21.0'
                });
                setIsLoaded(true);
            };

            const script = document.createElement('script');
            script.id = 'facebook-jssdk';
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        };

        loadSDK();
    }, [appId]);

    const launchLogin = () => {
        if (!window.FB) return;

        setIsProcessing(true);

        window.FB.login((response: any) => {
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                handleAuth(accessToken);
            } else {
                setIsProcessing(false);
                if (response.error) {
                    toast.error(`Error: ${response.error.message}`);
                } else {
                    toast.error('Inicio de sesión cancelado.');
                }
            }
        }, {
            scope: 'pages_messaging,pages_show_list,pages_read_engagement',
            return_scopes: true
        });
    };

    const handleAuth = async (accessToken: string) => {
        try {
            // 1. Obtener páginas disponibles
            const result = await getFacebookPages(accessToken);

            if (result.error) {
                throw new Error(result.error);
            }

            if (result.pages && result.pages.length > 0) {
                setPages(result.pages);
                setShowPageSelection(true);
            } else {
                toast.error('No se encontraron Páginas de Facebook en tu cuenta.');
            }
        } catch (error: any) {
            console.error('Error de autenticación:', error);
            toast.error(error.message || 'Error al conectar con Facebook');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSelectPage = async (page: any) => {
        setIsProcessing(true);
        try {
            const result = await connectMessengerPage({
                agentId,
                pageId: page.id,
                pageAccessToken: page.pageAccessToken,
                name: page.name
            });

            if (result.success) {
                toast.success('¡Messenger conectado correctamente! 🎉');
                if (onSuccess) onSuccess();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al conectar página');
        } finally {
            setIsProcessing(false);
            setShowPageSelection(false);
        }
    };

    if (showPageSelection) {
        return (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-gray-900">Selecciona una Página</h3>
                    <p className="text-gray-500 text-sm">Elige qué página de Facebook conectar a Messenger.</p>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {pages.map((page) => (
                        <button
                            key={page.id}
                            onClick={() => handleSelectPage(page)}
                            className="w-full p-4 flex items-center gap-4 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-2xl transition-all group text-left"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                <Facebook className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{page.name}</h4>
                                <p className="text-xs text-gray-500">ID: {page.id}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="text-center pt-2">
                    <button
                        onClick={() => setShowPageSelection(false)}
                        className="text-gray-400 text-xs font-bold hover:text-gray-600 uppercase tracking-widest"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 overflow-hidden relative group rounded-[2.5rem] shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -ml-32 -mb-32"></div>

            <div className="relative p-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                    <MessageCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-white font-black text-2xl tracking-tight">Conexión Instantánea</h3>
                    <p className="text-blue-100/80 text-sm font-medium max-w-sm leading-relaxed">
                        Conecta tu Página de Facebook con un solo clic y empieza a responder mensajes automáticamente.
                    </p>
                </div>

                <button
                    onClick={launchLogin}
                    disabled={!isLoaded || isProcessing}
                    className="w-full py-4 bg-white text-blue-900 rounded-2xl text-sm font-black shadow-lg shadow-black/20 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group-hover:ring-4 ring-white/20"
                >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <ShieldCheck className="w-5 h-5" />
                            <span>CONECTAR MESSENGER</span>
                        </>
                    )}
                </button>

                {!isLoaded && (
                    <p className="text-[10px] text-blue-200/60 font-bold uppercase tracking-widest animate-pulse">
                        Sincronizando con Meta...
                    </p>
                )}
            </div>
        </div>
    );
}
