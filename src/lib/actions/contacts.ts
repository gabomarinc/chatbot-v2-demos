'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface FilterCondition {
    field: string; // "monthly_salary" or "city"
    operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
    value: any;
}

export interface GetContactsOptions {
    workspaceId: string;
    filters?: FilterCondition[];
    page?: number;
    pageSize?: number;
}

export async function getContacts({ workspaceId, filters = [], page = 1, pageSize = 20 }: GetContactsOptions) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {
            workspaceId,
        };

        if (filters.length > 0) {
            // Build JSONB filter query
            // Note: Prisma has limited support for complex JSONB filtering directly in typed where input
            // We might need raw query for complex JSON operators or use path access.
            // For simple "equals" or "contains" on top level keys, specific syntax applies.

            // However, Prisma Client supports some JSON filtering.
            // AND: [ { customData: { path: ['field'], equals: value } } ]

            const jsonFilters = filters.map(filter => {
                const { field, operator, value } = filter;
                let prismaOp: any = {};

                // This assumes customData is flat JSON object
                if (operator === 'equals') {
                    prismaOp = { equals: value };
                } else if (operator === 'contains' && typeof value === 'string') {
                    prismaOp = { string_contains: value }; // Prisma JSON filter syntax might vary by version
                } else if (operator === 'gt') {
                    prismaOp = { gt: Number(value) };
                } else if (operator === 'lt') {
                    prismaOp = { lt: Number(value) };
                }

                return {
                    customData: {
                        path: [field],
                        ...prismaOp
                    }
                };
            });

            if (jsonFilters.length > 0) {
                where.AND = jsonFilters;
            }
        }

        const [contacts, total] = await Promise.all([
            prisma.contact.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { conversations: true }
                    }
                }
            }),
            prisma.contact.count({ where })
        ]);

        return {
            contacts,
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Failed to fetch contacts');
    }
}

export async function updateContact(contactId: string, updates: Record<string, any>, workspaceId: string) {
    try {
        // 1. Fetch contact to verify existence and get current data
        const contact = await prisma.contact.findUnique({
            where: { id: contactId }
        });

        if (!contact) {
            throw new Error('Contact not found');
        }

        // 2. Fetch custom fields definitions to validate
        // We need to find the agent(s) associated with this contact's workspace to know valid fields.
        // OR, we can just fetch all custom fields for the workspace.
        // 2. Fetch custom fields definitions to validate
        const agents = await prisma.agent.findMany({
            where: { workspaceId },
            include: {
                customFieldDefinitions: true
            }
        });

        if (agents.length === 0) {
            // If no agents, assume no custom fields.
        }

        // Flatten all available fields in the workspace
        const allFields = agents.flatMap(a => a.customFieldDefinitions);
        const validKeys = new Set(allFields.map(f => f.key));

        // 3. Filter updates to only include valid keys
        const filteredUpdates: Record<string, any> = {};
        for (const [key, value] of Object.entries(updates)) {
            if (validKeys.has(key)) {
                filteredUpdates[key] = value;
            }
        }

        // 4. Merge with existing data
        const currentData = (contact.customData as Record<string, any>) || {};
        const newData = { ...currentData, ...filteredUpdates };

        const updatedContact = await prisma.contact.update({
            where: { id: contactId },
            data: { customData: newData }
        });

        return { success: true, contact: updatedContact };
    } catch (error) {
        console.error('Error updating contact:', error);
        return { success: false, error: 'Failed to update contact' };
    }
}
