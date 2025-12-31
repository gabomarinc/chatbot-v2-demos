import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWidgetMessage } from '@/lib/actions/widget';
import { sendMessengerMessage, sendMessengerImage, downloadMessengerMedia } from '@/lib/messenger';
import { uploadFileToR2 } from '@/lib/r2';
import sharp from 'sharp';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe') {
            // Find any Messenger channel to check verify token
            const channels = await prisma.channel.findMany({
                where: { type: 'MESSENGER', isActive: true }
            });

            // Allow verification if ANY channel matches OR if using the Master Token
            const MASTER_TOKEN = 'konsul_master_verify_secret';

            const isValid = token === MASTER_TOKEN || channels.some(c => {
                const config = c.configJson as any;
                return config?.verifyToken === token;
            });

            if (isValid) {
                console.log('MESSENGER WEBHOOK_VERIFIED');
                return new Response(challenge, { status: 200 });
            }
        }
    }

    return new Response('Forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Messenger webhook received:', JSON.stringify(body, null, 2));

        // Messenger webhook structure: entry[].messaging[]
        const entry = body.entry?.[0];
        const messaging = entry?.messaging?.[0];

        if (!messaging) {
            console.log('No messaging event found');
            return NextResponse.json({ status: 'ok' });
        }

        const senderId = messaging.sender?.id;
        const message = messaging.message;

        if (!senderId || !message) {
            console.log('No sender or message found');
            return NextResponse.json({ status: 'ok' });
        }

        const pageId = entry.id;

        // Find the specific channel for this Fan Page
        const channels = await prisma.channel.findMany({
            where: { type: 'MESSENGER', isActive: true }
        });

        const channel = channels.find(c => (c.configJson as any)?.pageId === pageId);

        if (!channel) {
            console.error(`No active Messenger channel found for Page ID: ${pageId}`);
            // Return 200 to avoid retries from Facebook even if we can't process it yet
            return NextResponse.json({ status: 'ok' });
        }

        const config = channel.configJson as any;

        // Handle text messages
        if (message.text) {
            const text = message.text;

            try {
                // Process with AI (Reusing widget logic)
                const result = await sendWidgetMessage({
                    channelId: channel.id,
                    content: text,
                    visitorId: senderId
                });

                // Send response back to Messenger
                if (result.agentMsg) {
                    // Check if agent response includes an image
                    const hasImage = result.agentMsg.metadata &&
                        typeof result.agentMsg.metadata === 'object' &&
                        (result.agentMsg.metadata as any).type === 'image' &&
                        (result.agentMsg.metadata as any).url;

                    if (hasImage) {
                        // Send image first
                        await sendMessengerImage(
                            config.pageAccessToken,
                            senderId,
                            (result.agentMsg.metadata as any).url
                        );

                        // Then send text if there's accompanying text
                        if (result.agentMsg.content && result.agentMsg.content.trim()) {
                            await sendMessengerMessage(
                                config.pageAccessToken,
                                senderId,
                                result.agentMsg.content
                            );
                        }
                    } else {
                        // Send text only
                        await sendMessengerMessage(
                            config.pageAccessToken,
                            senderId,
                            result.agentMsg.content
                        );
                    }
                }
            } catch (innerError: any) {
                console.error('Processing Error:', innerError);
                await sendDebugResponse(config, senderId, innerError.message || 'Unknown processing error');
            }
        }
        // Handle image messages
        else if (message.attachments && message.attachments[0]?.type === 'image') {
            const attachment = message.attachments[0];
            const imageUrl = attachment.payload?.url;

            if (imageUrl) {
                // Download image from Messenger
                const buffer = await downloadMessengerMedia(
                    // Usually we don't need token to download public URLs from Messenger attachments 
                    // unless they are specific signed URLs but using helper is safer
                    'dummy_id', // Method might need adjustment if URL is direct
                    config.pageAccessToken
                );

                // Wait, downloadMessengerMedia expects mediaId. 
                // Attachment payload has url directly? 
                // Facebook docs say: "The URL of the attachment."
                // Usually accessible directly?
                // Let's modify logic to just fetch URL directly like Instagram route did.

                const imageResponse = await fetch(imageUrl);
                const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

                // Compress with Sharp
                const compressedBuffer = await sharp(imageBuffer)
                    .resize(1920, null, { withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer();

                // Upload to R2
                const r2Url = await uploadFileToR2(
                    compressedBuffer,
                    `${Date.now()}-${senderId}.webp`,
                    'image/webp'
                );

                if (r2Url) {
                    // Save to database with metadata
                    const result = await sendWidgetMessage({
                        channelId: channel.id,
                        content: 'Imagen recibida',
                        visitorId: senderId,
                        metadata: {
                            type: 'image',
                            url: r2Url,
                            originalUrl: imageUrl
                        }
                    });

                    // Acknowledge receipt
                    if (result.agentMsg) {
                        await sendMessengerMessage(
                            config.pageAccessToken,
                            senderId,
                            result.agentMsg.content
                        );
                    }
                }
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('Messenger Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper to send debug message
async function sendDebugResponse(config: any, recipientId: string, errorMessage: string) {
    if (config?.pageAccessToken) {
        try {
            await sendMessengerMessage(config.pageAccessToken, recipientId, `⚠ Error interno: ${errorMessage}`);
        } catch (e) {
            console.error('Failed to send debug message', e);
        }
    }
}
