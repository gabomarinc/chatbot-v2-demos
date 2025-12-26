'use client';

import { useState } from 'react';
import { UserCircle, Search, Filter, MoreVertical, MessageSquare, Calendar, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProspectDetailsModal } from './ProspectDetailsModal';
import { getProspectDetails } from '@/lib/actions/dashboard';

interface ProspectsTableClientProps {
    initialProspects: any[];
}

export function ProspectsTableClient({ initialProspects }: ProspectsTableClientProps) {
    const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const handleRowClick = async (prospectId: string) => {
        setSelectedProspectId(prospectId);
        setIsLoadingDetails(true);
        setModalData(null);

        try {
            const data = await getProspectDetails(prospectId);
            setModalData(data);
        } catch (error) {
            console.error("Error fetching prospect details:", error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedProspectId(null);
        setModalData(null);
    };

    return (
        <>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre / Contacto</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Última Interacción</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Agente Asignado</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Mensajes</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {initialProspects.length > 0 ? (
                                initialProspects.map((prospect) => (
                                    <tr
                                        key={prospect.id}
                                        onClick={() => handleRowClick(prospect.id)}
                                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#21AC96]/5 flex items-center justify-center text-[#21AC96] group-hover:scale-110 transition-transform shadow-sm">
                                                    <UserCircle className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-extrabold tracking-tight">{prospect.name}</span>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                        <Phone className="w-3 h-3" />
                                                        {prospect.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-700 font-bold">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {format(new Date(prospect.lastContact), "d MMM, yyyy", { locale: es })}
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium mt-0.5">
                                                    {format(new Date(prospect.lastContact), "HH:mm 'hs'")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                                                {prospect.agentName}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-gray-900">
                                                <MessageSquare className="w-4 h-4 text-[#21AC96]" />
                                                {prospect.messagesCount}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Dropdown logic here if needed
                                                }}
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                                                <UserCircle className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <h3 className="text-gray-900 font-extrabold text-xl tracking-tight mb-2">No tienes prospectos aún</h3>
                                            <p className="text-gray-400 font-medium max-w-sm">
                                                Tus prospectos aparecerán aquí una vez que tus agentes comiencen a interactuar con usuarios.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProspectDetailsModal
                isOpen={!!selectedProspectId}
                onClose={handleCloseModal}
                prospectData={modalData}
                isLoading={isLoadingDetails}
            />
        </>
    );
}
