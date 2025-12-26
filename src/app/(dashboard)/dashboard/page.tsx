import DashboardClient from '@/components/dashboard/DashboardClient';
import { getDashboardStats, getChartData, getDashboardChannels, getTopAgents } from '@/lib/actions/dashboard';

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    // Redirect SUPER_ADMIN users to admin dashboard
    if (session?.user?.role === 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const [stats, chartData, channels, topAgents] = await Promise.all([
        getDashboardStats(),
        getChartData(),
        getDashboardChannels(),
        getTopAgents()
    ]);

    return (
        <DashboardClient
            stats={stats}
            chartData={chartData}
            channels={channels}
            topAgents={topAgents}
        />
    );
}
