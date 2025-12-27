'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export async function registerUser(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validatedFields = registerSchema.safeParse({
        name,
        email,
        password,
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return {
                error: { email: ['Este correo ya está registrado'] },
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user and a default workspace in a transaction
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash: hashedPassword,
                },
            })

            const workspace = await tx.workspace.create({
                data: {
                    name: `Mi Workspace`,
                    ownerId: user.id,
                },
            })

            await tx.workspaceMember.create({
                data: {
                    userId: user.id,
                    workspaceId: workspace.id,
                    role: 'OWNER',
                },
            })

            // Create a default credit balance
            await tx.creditBalance.create({
                data: {
                    workspaceId: workspace.id,
                    balance: 5000, // Initial credits from Freshie plan
                },
            })

            // Get the Freshie plan (default for new users)
            const freshiePlan = await tx.subscriptionPlan.findFirst({
                where: { type: 'FRESHIE' }
            });

            if (freshiePlan) {
                // Create a default subscription with Freshie plan
                const nextMonth = new Date()
                nextMonth.setMonth(nextMonth.getMonth() + 1)

                await tx.subscription.create({
                    data: {
                        workspaceId: workspace.id,
                        planId: freshiePlan.id,
                        status: 'active',
                        currentPeriodEnd: nextMonth,
                    }
                })
            }
        })

        return { success: true }
    } catch (err) {
        console.error('Registration error:', err)
        return {
            error: { form: ['Ocurrió un error inesperado. Inténtalo de nuevo.'] },
        }
    }
}

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
})

export async function changePassword(userId: string, currentPassword: string, newPassword: string, confirmPassword: string) {
    try {
        const validatedFields = changePasswordSchema.safeParse({
            currentPassword,
            newPassword,
            confirmPassword,
        })

        if (!validatedFields.success) {
            return {
                error: validatedFields.error.flatten().fieldErrors,
            }
        }

        // Get user with password hash
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return {
                error: { form: ['Usuario no encontrado'] },
            }
        }

        // Verify current password
        const passwordsMatch = await bcrypt.compare(currentPassword, user.passwordHash)
        if (!passwordsMatch) {
            return {
                error: { currentPassword: ['La contraseña actual es incorrecta'] },
            }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: hashedPassword,
            },
        })

        return { success: true }
    } catch (err) {
        console.error('Change password error:', err)
        return {
            error: { form: ['Ocurrió un error inesperado. Inténtalo de nuevo.'] },
        }
    }
}

// Update user profile (name, image)
export async function updateUserProfile(userId: string, name?: string, image?: string) {
    try {
        const updateData: { name?: string; image?: string } = {}
        if (name !== undefined) updateData.name = name
        if (image !== undefined) updateData.image = image

        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        })

        return { success: true }
    } catch (err) {
        console.error('Update profile error:', err)
        return {
            error: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
        }
    }
}

// Get user statistics
export async function getUserStats(userId: string) {
    try {
        // Get user's workspace
        const membership = await prisma.workspaceMember.findFirst({
            where: { userId },
            include: {
                workspace: {
                    include: {
                        _count: {
                            select: {
                                agents: true,
                            }
                        }
                    }
                }
            }
        })

        if (!membership) {
            return {
                agentsCreated: 0,
                conversationsHandled: 0,
                channelsConfigured: 0,
                creditsUsed: 0,
                workspaceName: '',
                workspaceRole: '',
                memberSince: null,
            }
        }

        const workspace = membership.workspace

        // Count agents created by this user (if tracking is needed, we'd need a createdBy field)
        // For now, we'll count all agents in the workspace
        const agentsCount = workspace._count.agents

        // Count conversations in the workspace
        const conversationsCount = await prisma.conversation.count({
            where: {
                agent: { workspaceId: workspace.id }
            }
        })

        // Count channels in the workspace
        const channelsCount = await prisma.channel.count({
            where: {
                agent: { workspaceId: workspace.id }
            }
        })

        // Get credits used (from UsageLog)
        const usageLogs = await prisma.usageLog.aggregate({
            where: { workspaceId: workspace.id },
            _sum: { creditsUsed: true }
        })

        const creditsUsed = usageLogs._sum.creditsUsed || 0

        return {
            agentsCreated: agentsCount,
            conversationsHandled: conversationsCount,
            channelsConfigured: channelsCount,
            creditsUsed,
            workspaceName: workspace.name,
            workspaceRole: membership.role,
            memberSince: membership.workspace.createdAt,
        }
    } catch (err) {
        console.error('Get user stats error:', err)
        return {
            agentsCreated: 0,
            conversationsHandled: 0,
            channelsConfigured: 0,
            creditsUsed: 0,
            workspaceName: '',
            workspaceRole: '',
            memberSince: null,
        }
    }
}

// Update user timezone preference
export async function updateUserTimezone(userId: string, timezone: string) {
    try {
        const key = `user_${userId}_timezone`
        await prisma.globalConfig.upsert({
            where: { key },
            update: { value: timezone },
            create: { key, value: timezone },
        })
        return { success: true }
    } catch (err) {
        console.error('Update timezone error:', err)
        return {
            error: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
        }
    }
}

// Get user timezone preference
export async function getUserTimezone(userId: string) {
    try {
        const key = `user_${userId}_timezone`
        const config = await prisma.globalConfig.findUnique({
            where: { key },
        })
        return config?.value || 'America/Panama'
    } catch (err) {
        console.error('Get timezone error:', err)
        return 'America/Panama'
    }
}
