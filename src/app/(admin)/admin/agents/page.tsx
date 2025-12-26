import { getGlobalAgents, getGlobalUsageStats } from '@/lib/actions/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Globe, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculateEstimatedCost, formatCurrency } from '@/lib/billing';

export default async function AdminAgentsPage() {
    const agents = await getGlobalAgents();
    const usageLogs = await getGlobalUsageStats();

    // Map usage to agents
    const agentsWithUsage = agents.map(agent => {
        const agentUsage = usageLogs.filter(log => log.agentId === agent.id);
        const totalTokens = agentUsage.reduce((acc, log) => acc + log.tokensUsed, 0);
        const estimatedCost = agentUsage.reduce((acc, log) => {
            return acc + calculateEstimatedCost(log.model, log.tokensUsed);
        }, 0);

        return {
            ...agent,
            totalTokens,
            estimatedCost
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agentes Globales</h1>
                    <p className="text-slate-500 mt-2">Inventario completo con monitoreo de canales y costos.</p>
                </div>
            </div>

            <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="pl-8 py-5 h-auto text-slate-500 font-bold uppercase tracking-wider text-[10px]">Agente</TableHead>
                                <TableHead className="py-5 h-auto text-slate-500 font-bold uppercase tracking-wider text-[10px]">Cliente / Workspace</TableHead>
                                <TableHead className="py-5 h-auto text-slate-500 font-bold uppercase tracking-wider text-[10px]">Canales Activos</TableHead>
                                <TableHead className="py-5 h-auto text-slate-500 font-bold uppercase tracking-wider text-[10px]">Modelo</TableHead>
                                <TableHead className="py-5 h-auto text-slate-500 font-bold uppercase tracking-wider text-[10px]">Conversaciones</TableHead>
                                <TableHead className="py-5 h-auto text-slate-500 font-bold uppercase tracking-wider text-[10px]">Costo Est. (API)</TableHead>
                                <TableHead className="pr-8 py-5 h-auto text-slate-500 font-bold uppercase tracking-wider text-[10px]">Creado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agentsWithUsage.map((agent) => (
                                <TableRow key={agent.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                                    <TableCell className="pl-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                                                <Bot className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">{agent.name}</span>
                                                <span className="text-[10px] font-mono text-slate-400">ID: {agent.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{agent.workspace.name}</span>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                                <User className="w-3 h-3" />
                                                {agent.workspace.owner.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {agent.channels.filter(c => c.isActive).length > 0 ? (
                                                agent.channels.filter(c => c.isActive).map((channel, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className={cn(
                                                            "rounded-lg px-2 py-1 flex items-center gap-1 text-[10px] font-bold border-0 shadow-sm",
                                                            channel.type === 'WHATSAPP' ? "bg-green-50 text-green-700 shadow-green-100" : "bg-blue-50 text-blue-700 shadow-blue-100"
                                                        )}
                                                    >
                                                        {channel.type === 'WHATSAPP' ? <Phone className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                                        {channel.type}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-300 font-medium italic">Sin canales activos</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-[10px] bg-slate-50/50 border-slate-200 text-slate-600 rounded-md">
                                            {agent.model}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-700">
                                        {agent._count.conversations}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-[#21AC96]">
                                                {formatCurrency(agent.estimatedCost)}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                                                {agent.totalTokens.toLocaleString()} tokens
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-8 text-slate-400 text-xs font-medium">
                                        {format(agent.createdAt, 'dd MMM yyyy', { locale: es })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
