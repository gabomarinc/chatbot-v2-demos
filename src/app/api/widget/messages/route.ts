import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAgentReply } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, message, sessionId } = body;

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify agent exists
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Find or create webchat channel
    let channel = await prisma.channel.findFirst({
      where: {
        agentId,
        type: 'WEBCHAT',
      },
    });

    if (!channel) {
      channel = await prisma.channel.create({
        data: {
          agentId,
          type: 'WEBCHAT',
          displayName: 'Webchat',
          configJson: {},
          isActive: true,
        },
      });
    }

    // Find or create conversation
    const externalId = sessionId || `webchat-${Date.now()}-${Math.random()}`;
    let conversation = await prisma.conversation.findFirst({
      where: {
        agentId,
        channelId: channel.id,
        externalId,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          agentId,
          channelId: channel.id,
          externalId,
          status: 'OPEN',
        },
      });
    }

    // Store user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    });

    // Generate agent reply
    const { reply } = await generateAgentReply(
      agentId,
      conversation.id,
      message
    );

    // Get all messages for this conversation
    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role.toLowerCase(),
        content: msg.content,
        createdAt: msg.createdAt,
      })),
      sessionId: externalId,
    });
  } catch (error) {
    console.error('Widget API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

