import { IntentsClient } from '@/components/agents/IntentsClient'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function AgentIntentsPage({ params }: { params: Promise<{ agentId: string }> }) {
    const { agentId } = await params

    const agent = await prisma.agent.findUnique({
        where: { id: agentId },
        include: {
            intents: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!agent) {
        notFound()
    }

    // Serialize dates for client component
    const serializedIntents = agent.intents.map(intent => ({
        ...intent,
        createdAt: intent.createdAt,
        updatedAt: intent.updatedAt,
        lastTriggered: intent.lastTriggered
    }))

    return <IntentsClient agentId={agent.id} intents={serializedIntents} />
}
