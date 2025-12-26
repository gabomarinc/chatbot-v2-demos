import { getBillingStats, getRevenueByPlan, getRecentPayments, getCostsByModel, getCostsByChannel } from '@/lib/actions/billing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Percent, Globe, Phone, Zap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/billing';

export default async function AdminBillingPage() {
    const [stats, revenueByPlan, recentPayments, costsByModel, costsByChannel] = await Promise.all([
        getBillingStats(),
        getRevenueByPlan(),
        getRecentPayments(10),
        getCostsByModel(),
        getCostsByChannel(),
    ]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Finanzas Globales
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Análisis de rentabilidad y ROI operativo.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-[#21AC96]/10 border border-[#21AC96]/20 rounded-[2rem]">
                    <Zap className="w-5 h-5 text-[#21AC96] animate-pulse" />
                    <span className="text-sm font-bold text-[#21AC96] uppercase tracking-wider">Monitoreo en Tiempo Real</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-xl shadow-slate-200/40 bg-white rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            MRR Actual
                        </CardTitle>
                        <div className="w-12 h-12 rounded-2xl bg-[#21AC96]/10 flex items-center justify-center text-[#21AC96] group-hover:scale-110 transition-transform">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">
                            {formatCurrency(stats.mrr)}
                        </div>
                        <p className="text-xs text-slate-400 font-bold mt-2">
                            {stats.activeSubscriptions} SUSCRIPCIONES ACTIVAS
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-green-200/40 bg-white rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Ingresos Totales
                        </CardTitle>
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-green-600">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <p className="text-xs text-green-400 font-bold mt-2">
                            HISTÓRICO ACUMULADO
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-amber-200/40 bg-white rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Gasto en APIs
                        </CardTitle>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-amber-600">
                            {formatCurrency(stats.estimatedCosts)}
                        </div>
                        <p className="text-xs text-amber-400 font-bold mt-2 uppercase tracking-tight">
                            {stats.totalCreditsUsed.toLocaleString()} MENSAJES PROCESADOS
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-blue-200/40 bg-slate-900 rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Rentabilidad (ROI)
                        </CardTitle>
                        <div className="w-12 h-12 rounded-2xl bg-[#21AC96]/20 flex items-center justify-center text-[#21AC96] group-hover:scale-110 transition-transform">
                            <Percent className="h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">
                            {stats.profitMargin.toFixed(1)}%
                        </div>
                        <p className="text-xs text-[#21AC96] font-bold mt-2 uppercase">
                            {formatCurrency(stats.profit)} de beneficio neto
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Costs by Channel */}
                <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="border-b border-slate-50 py-6 px-8 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Distribución por Canal</CardTitle>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">Costo API ($)</span>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {costsByChannel.length > 0 ? costsByChannel.map((channel) => (
                                <div key={channel.type} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                                            channel.type === 'WHATSAPP' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {channel.type === 'WHATSAPP' ? <Phone className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 text-sm tracking-tight">{channel.type}</div>
                                            <div className="text-xs text-slate-400 font-bold">{channel.messages.toLocaleString()} interacciones</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-slate-700 text-sm">{formatCurrency(channel.cost)}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Costo Neto</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-300 font-bold italic text-sm">No hay datos de consumo registrados aún.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Costs by Model */}
                <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="border-b border-slate-50 py-6 px-8 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Costo por Modelo AI</CardTitle>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">Tokens</span>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {costsByModel.map((item) => (
                                <div key={item.model} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 text-sm tracking-tight font-mono">{item.model}</div>
                                            <div className="text-xs text-slate-400 font-bold">{item.credits.toLocaleString()} créditos</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-red-500 text-sm">{formatCurrency(item.cost)}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gasto Total</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Payments Placeholder (Matches current theme) */}
            <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="border-b border-slate-50 py-6 px-8">
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Flujo de Caja Reciente</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-b border-slate-100 italic">
                                <TableHead className="pl-8 py-4 text-slate-400 font-bold text-[10px] uppercase">Workspace</TableHead>
                                <TableHead className="py-4 text-slate-400 font-bold text-[10px] uppercase">Plan Seleccionado</TableHead>
                                <TableHead className="py-4 text-slate-400 font-bold text-[10px] uppercase">Tipo de Pago</TableHead>
                                <TableHead className="py-4 text-slate-400 font-bold text-[10px] uppercase">Monto Bruto</TableHead>
                                <TableHead className="py-4 text-slate-400 font-bold text-[10px] uppercase text-right pr-8">Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentPayments.length > 0 ? recentPayments.map((payment: any) => (
                                <TableRow key={payment.id} className="border-b border-slate-50">
                                    <TableCell className="pl-8 py-5 font-bold text-slate-700 text-sm">{payment.workspace.name}</TableCell>
                                    <TableCell className="text-slate-500 font-medium">{payment.subscription?.plan.name || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold rounded-md px-2 py-0.5 border-slate-200">
                                            {payment.type === 'subscription' ? 'Suscripción' : 'Créditos'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-black text-[#21AC96] text-sm">{formatCurrency(payment.amount)}</TableCell>
                                    <TableCell className="pr-8 text-right text-slate-400 font-bold text-xs">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-slate-300 font-bold italic uppercase tracking-wider text-sm">
                                        Historial de pagos listo para conexión con Stripe
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
