'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerUser } from '@/lib/actions/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await registerUser(null, formData);

            if (result?.error) {
                setError(result.error);
                setLoading(false);
            } else if (result?.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError({ form: ['Ocurrió un error al registrarse. Inténtalo de nuevo.'] });
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-[#21AC96]/10 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-[#21AC96]/20 rounded-full animate-ping opacity-20"></div>
                    <CheckCircle2 className="w-14 h-14 text-[#21AC96] relative z-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">¡Bienvenido a Kônsul!</h2>
                <p className="text-gray-500 font-medium">Tu cuenta ha sido creada con éxito.</p>
                <p className="text-gray-400 text-sm mt-1">Redirigiéndote para que inicies sesión...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Crea tu cuenta</h2>
                <p className="text-gray-500 text-sm mt-2 font-medium">Empieza a crear tus agentes de IA hoy mismo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error?.form && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-shake shadow-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{error.form[0]}</span>
                    </div>
                )}

                <div className="group space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-[#21AC96]">Nombre completo</label>
                    <div className="relative isolate">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#21AC96] group-focus-within:scale-110 transition-all duration-300 z-10">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            name="name"
                            type="text"
                            required
                            className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border ${error?.name ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#21AC96]/5 focus:border-[#21AC96] focus:bg-white transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium`}
                            placeholder="Juan Pérez"
                        />
                    </div>
                    {error?.name && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error.name[0]}</p>}
                </div>

                <div className="group space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-[#21AC96]">Email</label>
                    <div className="relative isolate">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#21AC96] group-focus-within:scale-110 transition-all duration-300 z-10">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            required
                            className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border ${error?.email ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#21AC96]/5 focus:border-[#21AC96] focus:bg-white transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium`}
                            placeholder="nombre@empresa.com"
                        />
                    </div>
                    {error?.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error.email[0]}</p>}
                </div>

                <div className="group space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-[#21AC96]">Contraseña</label>
                    <div className="relative isolate">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#21AC96] group-focus-within:scale-110 transition-all duration-300 z-10">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border ${error?.password ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#21AC96]/5 focus:border-[#21AC96] focus:bg-white transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium`}
                            placeholder="••••••••"
                        />
                    </div>
                    {error?.password && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error.password[0]}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-2 py-4 px-4 bg-[#21AC96] hover:bg-[#1a8a78] text-white rounded-2xl font-bold shadow-xl shadow-[#21AC96]/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    ) : (
                        <>
                            <span className="relative z-10">Registrarse</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center pt-4">
                <p className="text-sm text-gray-500 font-medium">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="text-[#21AC96] font-bold hover:text-[#1a8a78] transition-colors inline-flex items-center gap-1 group/link">
                        Inicia sesión
                        <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                </p>
            </div>
        </div>
    );
}
