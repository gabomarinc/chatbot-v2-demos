import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // Get user data
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            role: true,
        }
    });

    if (!user) {
        redirect('/login');
    }

    // Get user's workspace membership
    const membership = await prisma.workspaceMember.findFirst({
        where: { userId: session.user.id },
        include: {
            workspace: {
                select: {
                    name: true,
                    createdAt: true,
                }
            }
        }
    });

    // Get statistics
    const agentsCreated = await prisma.agent.count({
        where: { workspaceId: membership?.workspaceId || '' }
    });

    const conversationsHandled = await prisma.conversation.count({
        where: {
            agent: {
                workspaceId: membership?.workspaceId || ''
            }
        }
    });

    const channelsConfigured = await prisma.channel.count({
        where: {
            agent: {
                workspaceId: membership?.workspaceId || ''
            }
        }
    });

    const usageLogs = await prisma.usageLog.findMany({
        where: { workspaceId: membership?.workspaceId || '' },
        select: { creditsUsed: true }
    });

    const creditsUsed = usageLogs.reduce((sum, log) => sum + log.creditsUsed, 0);

    return (
        <ProfileClient
            user={{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                createdAt: user.createdAt,
                role: user.role,
            }}
            stats={{
                agentsCreated,
                conversationsHandled,
                channelsConfigured,
                creditsUsed,
                workspaceName: membership?.workspace.name || 'N/A',
                workspaceRole: membership?.role || 'AGENT',
                memberSince: membership?.workspace.createdAt || null,
            }}
            initialTimezone="UTC"
        />
    );
}
