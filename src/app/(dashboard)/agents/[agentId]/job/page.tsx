import { getAgent } from '@/lib/actions/dashboard';
import { AgentJobForm } from '@/components/agents/AgentJobForm';
import { redirect } from 'next/navigation';

export default async function AgentJobPage({ params }: { params: { agentId: string } }) {
    const agent = await getAgent(params.agentId);

    if (!agent) {
        redirect('/agents');
    }

    return (
        <AgentJobForm
            agent={{
                id: agent.id,
                jobType: agent.jobType,
                jobCompany: agent.jobCompany,
                jobWebsiteUrl: agent.jobWebsiteUrl,
                jobDescription: agent.jobDescription,
            }}
        />
    );
}
