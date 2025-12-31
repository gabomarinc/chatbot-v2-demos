import { getAgents } from '@/lib/actions/dashboard';
import { MessengerConfig } from '@/components/channels/MessengerConfig';

export default async function MessengerSetupPage({
    searchParams,
}: {
    searchParams: { agentId?: string; channelId?: string };
}) {
    const agents = await getAgents();
    const { agentId, channelId } = searchParams;

    return (
        <div className="max-w-[1600px] mx-auto p-6 md:p-10">
            <MessengerConfig
                agents={agents}
                initialAgentId={agentId}
                initialChannelId={channelId}
            />
        </div>
    );
}
