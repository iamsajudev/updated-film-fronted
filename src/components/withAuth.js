// components/withAuth.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUser } from '@/utils/auth';
import LoadingSpinner from './LoadingSpinner';

export function withAuth(Component, allowedRoles = []) {
    return function ProtectedRoute(props) {
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState(false);

        useEffect(() => {
            const token = getToken();
            const user = getUser();

            console.log('withAuth check - Token:', !!token, 'User:', !!user);

            if (!token || !user) {
                console.log('No token or user, redirecting to login');
                router.replace('/login');
                return;
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                console.log('User role not allowed, redirecting to dashboard');
                router.replace('/dashboard');
                return;
            }

            setIsAuthorized(true);
        }, [router]);

        if (!isAuthorized) {
            return <LoadingSpinner />;
        }

        return <Component {...props} />;
    };
}