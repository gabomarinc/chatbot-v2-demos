import { getConversations } from '@/lib/actions/dashboard';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default async function ChatPage({
    searchParams,
}: {
    searchParams: Promise<{ conversationId?: string }>;
}) {
    const params = await searchParams;
    const conversations = await getConversations();

    // Map database conversations to client interface
    // Note: getConversations already includes relationships, we just need to ensure correct typing match
    const initialConversations = conversations.map(c => ({
        id: c.id,
        agent: c.agent,
        lastMessageAt: c.lastMessageAt,
        messages: c.messages,
        _count: c._count,
        contactName: c.contactName,
        externalId: c.externalId,
        status: c.status,
        channel: c.channel
    }));

    return <ChatInterface initialConversations={initialConversations as any} initialConversationId={params.conversationId} />;
}
