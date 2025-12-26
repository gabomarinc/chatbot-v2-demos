import { NextRequest, NextResponse } from 'next/server';
import { getGoogleTokens } from '@/lib/google';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const agentId = searchParams.get('state'); // We passed agentId in the 'state' parameter

    if (!code || !agentId) {
        return NextResponse.redirect(new URL('/agents?error=missing_params', req.url));
    }

    try {
        const tokens = await getGoogleTokens(code);

        // Find or create the integration record
        await prisma.agentIntegration.upsert({
            where: {
                // Since there's no unique constraint on agentId + provider in the current schema (I should check that),
                // I'll first try to find it.
                id: (await prisma.agentIntegration.findFirst({
                    where: { agentId, provider: 'GOOGLE_CALENDAR' }
                }))?.id || 'new-id-' + Math.random()
            },
            update: {
                configJson: tokens as any,
                enabled: true
            },
            create: {
                agentId,
                provider: 'GOOGLE_CALENDAR',
                configJson: tokens as any,
                enabled: true
            }
        });

        // Redirect back to the agent integrations page
        return NextResponse.redirect(new URL(`/agents/${agentId}/settings`, req.url));
    } catch (error) {
        console.error('Google OAuth Error:', error);
        return NextResponse.redirect(new URL(`/agents/${agentId}/settings?error=oauth_failed`, req.url));
    }
}
