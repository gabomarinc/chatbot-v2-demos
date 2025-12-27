import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUserStats, getUserTimezone } from '@/lib/actions/auth';
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

    // Get user statistics and preferences
    const [stats, timezone] = await Promise.all([
        getUserStats(session.user.id),
        getUserTimezone(session.user.id),
    ]);

    return (
        <ProfileClient
            user={user}
            stats={stats}
            initialTimezone={timezone}
        />
    );
}

