'use server'

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const META_API_VERSION = 'v21.0';

/**
 * 1. Exchanges short-lived token for long-lived one
 * 2. Fetches Facebook Pages (for Messenger)
 */
export async function getFacebookPages(shortLivedToken: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const appSecret = process.env.META_APP_SECRET;
        const config = await prisma.globalConfig.findUnique({ where: { key: 'META_APP_ID' } });
        const appId = config?.value;

        if (!appSecret || !appId) {
            throw new Error('Server configuration missing (Meta App ID or Secret)');
        }

        // 1. Exchange for Long-Lived User Access Token
        const tokenRes = await fetch(
            `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`
        );
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok) {
            console.error('Token Exchange Error:', tokenData);
            throw new Error(tokenData.error?.message || 'Failed to exchange token');
        }

        const longLivedToken = tokenData.access_token;

        // 2. Fetch Pages (User's Pages)
        // We need name, access_token, id
        const pagesRes = await fetch(
            `https://graph.facebook.com/${META_API_VERSION}/me/accounts?fields=name,access_token,id,tasks&limit=100&access_token=${longLivedToken}`
        );
        const pagesData = await pagesRes.json();

        if (!pagesRes.ok) {
            console.error('Pages Fetch Error:', pagesData);
            throw new Error(pagesData.error?.message || 'Failed to fetch pages');
        }

        // Filter pages? usually just return all where user has sufficient tasks (MODERATE, CREATE_CONTENT etc)
        // For simplicity, we return all, as the token exchange usually grants access based on permissions
        const validPages = pagesData.data.map((page: any) => ({
            id: page.id, // Page ID
            name: page.name,
            pageAccessToken: page.access_token
        }));

        return {
            success: true,
            pages: validPages
        };

    } catch (error: any) {
        console.error('Get Facebook Pages Error:', error);
        return { error: error.message || 'Error fetching Facebook Pages' };
    }
}

/**
 * Connects the selected Facebook Page to the Agent (Messenger)
 */
export async function connectMessengerPage(data: {
    agentId: string;
    pageId: string;
    pageAccessToken: string;
    name: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        console.log('Connect Messenger Page called with:', data.name);

        const membership = await prisma.workspaceMember.findFirst({
            where: { userId: session.user.id },
            include: { workspace: true }
        });
        const workspace = membership?.workspace;

        if (!workspace) {
            throw new Error('Workspace not found');
        }

        // 2. Verify Token
        const verifyRes = await fetch(
            `https://graph.facebook.com/${META_API_VERSION}/${data.pageId}?fields=name&access_token=${data.pageAccessToken}`
        );

        if (!verifyRes.ok) throw new Error('Invalid or expired token');

        // 3. Save/Update Channel
        const allChannels = await prisma.channel.findMany({
            where: {
                type: 'MESSENGER',
                agent: { workspaceId: workspace.id }
            }
        });

        const existingChannel = allChannels.find(c => (c.configJson as any)?.pageId === data.pageId);

        const configJson = {
            pageAccessToken: data.pageAccessToken,
            pageId: data.pageId,
            verifyToken: Math.random().toString(36).substring(7)
        };

        if (existingChannel) {
            await prisma.channel.update({
                where: { id: existingChannel.id },
                data: {
                    agentId: data.agentId,
                    displayName: `Messenger: ${data.name}`,
                    configJson: configJson as any,
                    isActive: true
                }
            });
        } else {
            await prisma.channel.create({
                data: {
                    agent: { connect: { id: data.agentId } },
                    type: 'MESSENGER',
                    displayName: `Messenger: ${data.name}`,
                    configJson: configJson as any,
                    isActive: true
                }
            });
        }

        revalidatePath('/channels');
        return { success: true };

    } catch (error: any) {
        console.error('Connect Messenger Error:', error);
        return { error: error.message || 'Error connecting Messenger page' };
    }
}
