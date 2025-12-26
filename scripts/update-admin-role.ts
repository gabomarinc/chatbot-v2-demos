import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateAdminRole() {
    try {
        const admin = await prisma.user.update({
            where: { email: 'admin@konsul.com' },
            data: { role: 'SUPER_ADMIN' }
        })

        console.log('✅ Admin role updated successfully!')
        console.log('User:', admin.email, '- Role:', admin.role)
    } catch (error) {
        console.error('❌ Error updating admin role:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateAdminRole()
