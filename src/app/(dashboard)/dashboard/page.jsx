"use client";

import UserDashboard from '@/components/Dashboard/UserDashboard';
import { withAuth } from '@/components/withAuth';

function DashboardPage() {
    return <UserDashboard />;
}

export default withAuth(DashboardPage);