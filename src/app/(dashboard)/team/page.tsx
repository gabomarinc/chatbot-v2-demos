import { getTeamMembers } from '@/lib/actions/dashboard';
import { getWorkspaceInfo } from '@/lib/actions/workspace';
import { TeamPageClient } from '@/components/team/TeamPageClient';
import { auth } from '@/auth';

export default async function TeamPage() {
    const session = await auth();
    const [members, workspaceInfo] = await Promise.all([
        getTeamMembers(),
        getWorkspaceInfo()
    ]);

    const maxMembers = workspaceInfo?.plan?.maxMembers || 1;

    return (
        <TeamPageClient 
            initialMembers={members} 
            currentMemberCount={members.length}
            maxMembers={maxMembers}
            currentUserId={session?.user?.id}
        />
    );
}
