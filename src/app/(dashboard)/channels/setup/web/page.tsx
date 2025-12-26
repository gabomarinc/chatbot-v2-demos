import { getAgents, getChannels } from '@/lib/actions/dashboard';
import { WebWidgetConfig } from '@/components/channels/WebWidgetConfig';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function WebWidgetSetupPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ agentId?: string }> 
}) {
    const params = await searchParams;
    // We need agents to let user select one
    const agents = await getAgents();

    // Check if there is already a WEBCHAT channel created.
    // For MVP we might assume one per workspace or check specifically.
    // Let's get all channels and filter.
    const channels = await getChannels();
    const existingWebChat = channels.find(c => c.type === 'WEBCHAT');

    return (
        <div className="max-w-[1600px] mx-auto animate-fade-in p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <Link
                    href={params.agentId ? `/agents/${params.agentId}/channels` : "/channels"}
                    className="flex items-center gap-2 text-gray-400 font-extrabold text-sm uppercase tracking-widest hover:text-[#21AC96] transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Volver
                </Link>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <h1 className="text-gray-900 font-black text-2xl tracking-tight">Widget Web</h1>
            </div>

            <WebWidgetConfig
                agents={agents.map(a => ({ id: a.id, name: a.name }))}
                existingChannel={existingWebChat}
                defaultAgentId={params.agentId}
            />
        </div>
    );
}
