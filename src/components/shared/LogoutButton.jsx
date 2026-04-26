"use client";

import { useRouter } from 'next/navigation';
import { removeToken } from '@/utils/auth';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        // Clear all stored auth data
        removeToken();
        
        // Optional: Call logout API if needed
        try {
            await fetch('http://server.nybff.us/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        // Redirect to login page
        router.push('/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium transition"
        >
            Logout
        </button>
    );
}