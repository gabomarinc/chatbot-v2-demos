import { getAgentIntegrations } from '@/lib/actions/integrations';
import { AgentIntegrationsClient } from '@/components/agents/AgentIntegrationsClient';

export default async function AgentIntegrationsPage({
    params,
}: {
    params: Promise<{ agentId: string }>;
}) {
    const { agentId } = await params;
    const integrations = await getAgentIntegrations(agentId);

    return (
        <div className="max-w-4xl animate-fade-in">
            <div className="mb-10">
                <h2 className="text-gray-900 font-extrabold text-2xl tracking-tight">Ecosistema de Aplicaciones</h2>
                <p className="text-gray-500 font-medium">Conecta tu agente con las herramientas que ya utilizas</p>
            </div>

            <AgentIntegrationsClient
                agentId={agentId}
                existingIntegrations={integrations}
            />
        </div>
    );
}
