
import { PrismaClient } from '@prisma/client';
import { updateContact } from './src/lib/actions/contacts';

const prisma = new PrismaClient();

async function main() {
    // Target specific contact from screenshot: "Visitante n6ww" -> ID cmk2xxdsp...
    // Let's find it by externalId likely "n6ww..." or just findFirst
    const contact = await prisma.contact.findFirst({
        where: { name: { contains: 'Visitante n6ww' } }
    });

    if (!contact) {
        console.log("Contact 'Visitante n6ww' not found.");
        // List recent contacts to find it
        const recent = await prisma.contact.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
        console.log("Recent contacts:", recent.map(c => ({ id: c.id, name: c.name })));
        return;
    }

    console.log(`Found target contact: ${contact.id} (${contact.name})`);
    console.log(`Current Custom Data:`, contact.customData);
    console.log(`Workspace ID:`, contact.workspaceId);

    // Simulate LLM sending "Name" (mixed case) and "salario_mensual"
    const updates = {
        "Name": "Chris Debug",
        "salario_mensual": 3500,
        "Email": "chris.debug@example.com"
    };

    console.log("Simulating updateContact with:", updates);

    // Call updateContact
    const result = await updateContact(contact.id, updates, contact.workspaceId);
    console.log("Result:", result);

    if (result.success) {
        const check = await prisma.contact.findUnique({ where: { id: contact.id } });
        console.log("After update:", {
            name: check?.name,
            email: check?.email,
            customData: check?.customData
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
