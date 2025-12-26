import { getProspects } from '@/lib/actions/dashboard';
import { Search, Filter } from 'lucide-react';
import { ProspectsTableClient } from '@/components/prospects/ProspectsTableClient';

export default async function ProspectsPage() {
    const prospects = await getProspects();

    // Serialize dates for client component
    const serializedProspects = prospects.map(p => ({
        ...p,
        lastContact: p.lastContact instanceof Date ? p.lastContact.toISOString() : p.lastContact,
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt
    }));

    return (
        <div className="max-w-[1600px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-gray-900 text-3xl font-extrabold tracking-tight mb-2">Prospectos</h1>
                    <p className="text-gray-500 font-medium">Gestiona y analiza los contactos captados por tus agentes</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#21AC96] transition-all" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o teléfono..."
                            className="pl-12 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#21AC96]/5 focus:border-[#21AC96] transition-all w-64 shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm text-gray-700 hover:shadow-md hover:border-gray-200 transition-all font-bold cursor-pointer group shadow-sm">
                        <Filter className="w-4 h-4 text-gray-400 group-hover:text-[#21AC96]" />
                        Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#21AC96] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#21AC96]/20 hover:bg-[#1a8a78] transition-all cursor-pointer">
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Client Component */}
            <ProspectsTableClient initialProspects={serializedProspects} />
        </div>
    );
}
