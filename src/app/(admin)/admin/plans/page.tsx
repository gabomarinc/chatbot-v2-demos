import { getSubscriptionPlans } from '@/lib/actions/billing';
import PlansManagementClient from './PlansManagementClient';
import { Toaster } from '@/components/ui/sonner';

export default async function AdminPlansPage() {
    const plans = await getSubscriptionPlans();

    return (
        <>
            <PlansManagementClient initialPlans={plans} />
            <Toaster />
        </>
    );
}
