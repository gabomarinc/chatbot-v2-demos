import { auth } from '@/auth';
import { getWorkspacesData } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function AdminWorkspacesPage() {
    const workspaces = await getWorkspacesData();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clientes & Workspaces</h1>
                    <p className="text-slate-500 mt-2">Visión global de todos los entornos y sus consumos.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-lg">{workspaces.length}</span>
                    <span className="text-xs text-gray-500 uppercase font-medium">Activos</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado General</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Workspace</TableHead>
                                <TableHead>Dueño</TableHead>
                                <TableHead>Agentes</TableHead>
                                <TableHead>Créditos Disp.</TableHead>
                                <TableHead>Consumo Total</TableHead>
                                <TableHead>Fecha Creación</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workspaces.map((ws) => (
                                <TableRow key={ws.id}>
                                    <TableCell className="font-medium">{ws.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{ws.owner.name}</span>
                                            <span className="text-xs text-gray-400">{ws.owner.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ws._count.agents}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Coins className="w-4 h-4 text-amber-500" />
                                            <span className={ws.creditBalance?.balance === 0 ? "text-red-500 font-bold" : "font-mono"}>
                                                {ws.creditBalance?.balance || 0}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono">
                                            {ws.creditBalance?.totalUsed || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {format(ws.createdAt, 'dd MMM yyyy', { locale: es })}
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
