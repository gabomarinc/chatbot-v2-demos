import { getAgent } from '@/lib/actions/dashboard';
import { AgentProfileForm } from '@/components/agents/AgentProfileForm';
import { redirect } from 'next/navigation';

export default async function AgentProfilePage({ params }: { params: { agentId: string } }) {
    const agent = await getAgent(params.agentId);

    if (!agent) {
        redirect('/agents');
    }

    return (
        <AgentProfileForm
            agent={{
                id: agent.id,
                name: agent.name,
                communicationStyle: agent.communicationStyle,
                personalityPrompt: agent.personalityPrompt,
            }}
        />
    );
}
