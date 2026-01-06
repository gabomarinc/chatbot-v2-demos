
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting Verification Script ---");

    try {
        // 1. Check Workspaces
        const workspaces = await prisma.workspace.findMany();
        console.log(`Found ${workspaces.length} workspaces.`);
        if (workspaces.length === 0) {
            console.error("No workspace found. Cannot proceed.");
            return;
        }
        const workspaceId = workspaces[0].id;
        console.log(`Using Workspace ID: ${workspaceId}`);

        // 2. Check Custom Fields
        const fields = await prisma.customFieldDefinition.findMany({
            where: { agent: { workspaceId } } // Assuming linked via Agent
        });
        console.log(`Found ${fields.length} custom fields.`);
        fields.forEach(f => console.log(` - ${f.label} (${f.key}) [${f.type}]`));

        // 3. Check Recent Conversations
        const conversations = await prisma.conversation.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { contact: true }
        });
        console.log(`Found ${conversations.length} recent conversations.`);

        for (const convo of conversations) {
            console.log(`Conversation ${convo.id} (External: ${convo.externalId})`);
            console.log(` - Contact Name: ${convo.contactName}`);
            console.log(` - Linked Contact: ${convo.contact ? convo.contact.id : 'NONE'}`);

            if (!convo.contact) {
                console.log("   -> Attempting to create contact for this conversation...");
                try {
                    const newContact = await prisma.contact.create({
                        data: {
                            workspaceId,
                            name: convo.contactName || 'Unknown User',
                            email: convo.contactEmail,
                            externalId: convo.externalId,
                            customData: {},
                        }
                    });
                    console.log(`   -> SUCCESS: Created contact ${newContact.id}`);

                    // Try to link
                    await prisma.conversation.update({
                        where: { id: convo.id },
                        data: { contactId: newContact.id }
                    });
                    console.log(`   -> SUCCESS: Linked to conversation`);
                } catch (e) {
                    console.log(`   -> FAILED: ${e.message}`);
                }
            }
        }

        // 4. Verify Contact Table Count
        const contactCount = await prisma.contact.count();
        console.log(`Total Contacts in DB: ${contactCount}`);

    } catch (e) {
        console.error("Script Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
