import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Settings, Users, LayoutDashboard, Bot, LogOut, Crown, DollarSign, CreditCard } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
        redirect('/dashboard');
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100/50 flex flex-col shadow-[20px_0_30px_rgba(0,0,0,0.02)]">
                {/* Logo */}
                <div className="p-8 border-b border-slate-100/50">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#21AC96] to-[#1a8a78] rounded-2xl flex items-center justify-center shadow-lg shadow-[#21AC96]/30 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <Crown className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <div className="text-slate-900 font-bold text-xl tracking-tight group-hover:text-[#21AC96] transition-colors">
                                Kônsul
                            </div>
                            <div className="text-[10px] text-[#21AC96] font-bold uppercase tracking-widest bg-[#21AC96]/10 px-1.5 rounded-full inline-block">
                                Super Admin
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
                    <div className="text-[10px] text-slate-400 mb-4 px-2 tracking-[0.2em] font-bold uppercase opacity-60">
                        TORRE DE CONTROL
                    </div>

                    <Link
                        href="/admin/dashboard"
                        className="group relative w-full rounded-2xl transition-all duration-300 block hover:bg-gradient-to-r hover:from-[#21AC96]/5 hover:to-[#21AC96]/10 active:scale-95"
                    >
                        <div className="flex items-center gap-3.5 px-4 py-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-[#21AC96] to-[#1a8a78] text-white shadow-lg shadow-[#21AC96]/30">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-slate-600 group-hover:text-[#21AC96] transition-colors">
                                Dashboard
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/workspaces"
                        className="group relative w-full rounded-2xl transition-all duration-300 block hover:bg-gradient-to-r hover:from-[#21AC96]/5 hover:to-[#21AC96]/10 active:scale-95"
                    >
                        <div className="flex items-center gap-3.5 px-4 py-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-[#21AC96] to-[#1a8a78] text-white shadow-lg shadow-[#21AC96]/30">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-slate-600 group-hover:text-[#21AC96] transition-colors">
                                Clientes
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/agents"
                        className="group relative w-full rounded-2xl transition-all duration-300 block hover:bg-gradient-to-r hover:from-[#21AC96]/5 hover:to-[#21AC96]/10 active:scale-95"
                    >
                        <div className="flex items-center gap-3.5 px-4 py-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-[#21AC96] to-[#1a8a78] text-white shadow-lg shadow-[#21AC96]/30">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-slate-600 group-hover:text-[#21AC96] transition-colors">
                                Agentes
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="group relative w-full rounded-2xl transition-all duration-300 block hover:bg-gradient-to-r hover:from-[#21AC96]/5 hover:to-[#21AC96]/10 active:scale-95"
                    >
                        <div className="flex items-center gap-3.5 px-4 py-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-[#21AC96] to-[#1a8a78] text-white shadow-lg shadow-[#21AC96]/30">
                                <Settings className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-slate-600 group-hover:text-[#21AC96] transition-colors">
                                Configuración
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/billing"
                        className="group relative w-full rounded-2xl transition-all duration-300 block hover:bg-gradient-to-r hover:from-[#21AC96]/5 hover:to-[#21AC96]/10 active:scale-95"
                    >
                        <div className="flex items-center gap-3.5 px-4 py-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-[#21AC96] to-[#1a8a78] text-white shadow-lg shadow-[#21AC96]/30">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-slate-600 group-hover:text-[#21AC96] transition-colors">
                                Facturación
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/plans"
                        className="group relative w-full rounded-2xl transition-all duration-300 block hover:bg-gradient-to-r hover:from-[#21AC96]/5 hover:to-[#21AC96]/10 active:scale-95"
                    >
                        <div className="flex items-center gap-3.5 px-4 py-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-[#21AC96] to-[#1a8a78] text-white shadow-lg shadow-[#21AC96]/30">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-slate-600 group-hover:text-[#21AC96] transition-colors">
                                Planes
                            </span>
                        </div>
                    </Link>
                </nav>

                {/* Logout Button */}
                <div className="p-6 border-t border-slate-100/50">
                    <form action={async () => {
                        'use server'
                        await signOut({ redirectTo: '/login' })
                    }}>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-red-200 hover:bg-red-50/50 transition-all duration-300 cursor-pointer active:scale-[0.98] group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-red-500 group-hover:to-red-600 rounded-xl flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-all duration-300">
                                    <LogOut className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-xs font-bold text-slate-700 group-hover:text-red-600 transition-colors">
                                        Cerrar Sesión
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                        Salir del panel
                                    </div>
                                </div>
                            </div>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
