'use server'

import { prisma } from '@/lib/prisma'
import { Intent, Conversation, Message } from '@prisma/client'

export interface IntentContext {
    conversation: Conversation
    message: Message
    userMessage: string
}

/**
 * Detect if a user message matches any intent triggers
 */
export async function detectIntent(
    userMessage: string,
    intents: Intent[]
): Promise<Intent | null> {
    const enabledIntents = intents.filter(i => i.enabled)

    for (const intent of enabledIntents) {
        // Split trigger by | to get individual patterns
        const patterns = intent.trigger.split('|').map(p => p.trim())

        // Check if any pattern matches (case insensitive)
        const matches = patterns.some(pattern => {
            const regex = new RegExp(pattern, 'i')
            return regex.test(userMessage)
        })

        if (matches) {
            return intent
        }
    }

    return null
}

/**
 * Execute an intent action based on its type
 */
export async function executeIntent(
    intent: Intent,
    context: IntentContext
): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        // Update analytics
        await prisma.intent.update({
            where: { id: intent.id },
            data: {
                triggerCount: { increment: 1 },
                lastTriggered: new Date()
            }
        })

        // Execute based on action type
        switch (intent.actionType) {
            case 'WEBHOOK':
                return await executeWebhook(intent, context)

            case 'INTERNAL':
                return await executeInternalAction(intent, context)

            case 'FORM':
                return await executeFormCollection(intent, context)

            default:
                return { success: false, error: 'Unknown action type' }
        }
    } catch (error: any) {
        console.error('[INTENT ERROR]', error)
        return { success: false, error: error.message }
    }
}

/**
 * Execute a webhook action
 */
async function executeWebhook(
    intent: Intent,
    context: IntentContext
): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!intent.actionUrl) {
        return { success: false, error: 'No webhook URL configured' }
    }

    try {
        const payload = {
            intentName: intent.name,
            conversationId: context.conversation.id,
            externalId: context.conversation.externalId,
            contactName: context.conversation.contactName,
            contactEmail: (context.conversation as any).contactEmail,
            userMessage: context.userMessage,
            messageId: context.message.id,
            timestamp: new Date().toISOString(),
            ...((intent.payloadJson as any) || {})
        }

        console.log(`[INTENT WEBHOOK] Calling ${intent.actionUrl}`)

        const response = await fetch(intent.actionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Konsul-Intent-Bot/1.0'
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        if (!response.ok) {
            throw new Error(`Webhook returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json().catch(() => ({}))

        console.log(`[INTENT WEBHOOK] Success:`, data)
        return { success: true, data }
    } catch (error: any) {
        console.error(`[INTENT WEBHOOK ERROR]`, error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Execute an internal action (predefined functions)
 */
async function executeInternalAction(
    intent: Intent,
    context: IntentContext
): Promise<{ success: boolean; data?: any; error?: string }> {
    const config = (intent.payloadJson as any) || {}
    const actionName = config.action || 'unknown'

    console.log(`[INTENT INTERNAL] Executing action: ${actionName}`)

    switch (actionName) {
        case 'send_notification':
            // Example: Send email notification
            return {
                success: true,
                data: { message: 'Notification sent (stub)' }
            }

        case 'create_lead':
            // Example: Create lead in CRM
            return {
                success: true,
                data: { leadId: 'stub-lead-id' }
            }

        case 'escalate_to_human':
            // Example: Notify human agent
            await prisma.conversation.update({
                where: { id: context.conversation.id },
                data: { status: 'OPEN' } // Mark as needing attention
            })
            return {
                success: true,
                data: { message: 'Escalated to human agent' }
            }

        default:
            return {
                success: false,
                error: `Unknown internal action: ${actionName}`
            }
    }
}

/**
 * Execute form collection (returns form fields to collect)
 */
async function executeFormCollection(
    intent: Intent,
    context: IntentContext
): Promise<{ success: boolean; data?: any; error?: string }> {
    const config = (intent.payloadJson as any) || {}
    const fields = config.fields || []

    console.log(`[INTENT FORM] Collecting ${fields.length} fields`)

    // Return form configuration to be displayed in the chat
    return {
        success: true,
        data: {
            type: 'form',
            fields: fields,
            webhookUrl: config.webhookUrl,
            message: config.message || `Para continuar, necesito algunos datos:`
        }
    }
}
