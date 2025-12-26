import { getAgent } from '@/lib/actions/dashboard';
import { AgentSettingsForm } from '@/components/agents/AgentSettingsForm';
import { redirect } from 'next/navigation';

export default async function AgentSettingsPage({ params }: { params: { agentId: string } }) {
    const agent = await getAgent(params.agentId);

    if (!agent) {
        redirect('/agents');
    }

    return (
        <AgentSettingsForm
            agent={{
                id: agent.id,
                model: agent.model,
                temperature: agent.temperature,
                timezone: agent.timezone,
                allowEmojis: agent.allowEmojis,
                signMessages: agent.signMessages,
                restrictTopics: agent.restrictTopics,
                splitLongMessages: agent.splitLongMessages,
                allowReminders: agent.allowReminders,
                smartRetrieval: agent.smartRetrieval,
                transferToHuman: agent.transferToHuman,
            }}
        />
    );
}
