import { auth } from '@/auth';
import { getGlobalSettings, getWorkspacesData, getGlobalAgents } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bot, Key, Activity, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
    const session = await auth();
    const workspaces = await getWorkspacesData();
    const agents = await getGlobalAgents();

    // Calculate totals
    const totalWorkspaces = workspaces.length;
    const totalAgents = agents.length;
    const totalCreditsUsed = workspaces.reduce((acc, ws) => acc + (ws.creditBalance?.totalUsed || 0), 0);
    const activeWorkspaces = workspaces.filter(ws => (ws.creditBalance?.totalUsed || 0) > 0).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#21AC96] to-[#1a8a78] bg-clip-text text-transparent">
                        Torre de Control
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Bienvenido, Comandante. Aquí está el estado de la flota.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#21AC96]/10 to-[#1a8a78]/10 border border-[#21AC96]/20 rounded-2xl">
                    <Zap className="w-4 h-4 text-[#21AC96]" />
                    <span className="text-sm font-semibold text-[#21AC96]">Sistema Operativo</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-lg shadow-[#21AC96]/10 bg-gradient-to-br from-white to-[#21AC96]/5 hover:shadow-[#21AC96]/20 transition-all duration-300 hover:scale-[1.02] group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Clientes Totales
                        </CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21AC96] to-[#1a8a78] flex items-center justify-center shadow-lg shadow-[#21AC96]/30 group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#21AC96] to-[#1a8a78] bg-clip-text text-transparent">
                            {totalWorkspaces}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-[#21AC96]" />
                            <p className="text-xs text-[#21AC96] font-medium">
                                {activeWorkspaces} activos
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-[#21AC96]/10 bg-gradient-to-br from-white to-[#21AC96]/5 hover:shadow-[#21AC96]/20 transition-all duration-300 hover:scale-[1.02] group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Agentes Desplegados
                        </CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21AC96] to-[#1a8a78] flex items-center justify-center shadow-lg shadow-[#21AC96]/30 group-hover:scale-110 transition-transform">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#21AC96] to-[#1a8a78] bg-clip-text text-transparent">
                            {totalAgents}
                        </div>
                        <p className="text-xs text-[#21AC96] font-medium mt-2">
                            En {totalWorkspaces} workspaces
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-[#21AC96]/10 bg-gradient-to-br from-white to-[#21AC96]/5 hover:shadow-[#21AC96]/20 transition-all duration-300 hover:scale-[1.02] group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Consumo Global
                        </CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21AC96] to-[#1a8a78] flex items-center justify-center shadow-lg shadow-[#21AC96]/30 group-hover:scale-110 transition-transform">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#21AC96] to-[#1a8a78] bg-clip-text text-transparent">
                            {totalCreditsUsed.toLocaleString()}
                        </div>
                        <p className="text-xs text-[#21AC96] font-medium mt-2">
                            Créditos consumidos
                        </p>
                    </CardContent>
                </Card>

                <Link href="/admin/settings" className="group">
                    <Card className="border-2 border-dashed border-slate-200 shadow-none hover:border-[#21AC96]/30 hover:bg-gradient-to-br hover:from-[#21AC96]/5 hover:to-[#1a8a78]/5 transition-all duration-300 cursor-pointer h-full hover:shadow-lg hover:shadow-[#21AC96]/10 hover:scale-[1.02]">
                        <CardContent className="flex flex-col items-center justify-center h-full py-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-3 group-hover:from-[#21AC96] group-hover:to-[#1a8a78] transition-all duration-300 group-hover:scale-110">
                                <Key className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-[#21AC96] transition-colors">
                                Configurar APIs
                            </span>
                            <span className="text-xs text-slate-400 mt-1">
                                Gestionar claves maestras
                            </span>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/admin/workspaces" className="group">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-[#21AC96]/5 border border-[#21AC96]/10 hover:shadow-lg hover:shadow-[#21AC96]/10 transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#21AC96] to-[#1a8a78] flex items-center justify-center shadow-lg shadow-[#21AC96]/30">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-700 group-hover:text-[#21AC96] transition-colors">
                                    Ver Clientes
                                </div>
                                <div className="text-xs text-slate-500">
                                    Gestionar workspaces
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/agents" className="group">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-[#21AC96]/5 border border-[#21AC96]/10 hover:shadow-lg hover:shadow-[#21AC96]/10 transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#21AC96] to-[#1a8a78] flex items-center justify-center shadow-lg shadow-[#21AC96]/30">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-700 group-hover:text-[#21AC96] transition-colors">
                                    Ver Agentes
                                </div>
                                <div className="text-xs text-slate-500">
                                    Inventario completo
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/settings" className="group">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-[#21AC96]/5 border border-[#21AC96]/10 hover:shadow-lg hover:shadow-[#21AC96]/10 transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#21AC96] to-[#1a8a78] flex items-center justify-center shadow-lg shadow-[#21AC96]/30">
                                <Key className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-700 group-hover:text-[#21AC96] transition-colors">
                                    Configuración
                                </div>
                                <div className="text-xs text-slate-500">
                                    API Keys y ajustes
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
