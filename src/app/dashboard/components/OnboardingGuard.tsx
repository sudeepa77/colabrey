 //app/src/dashboard/components/OnboardingGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Profile = {
    full_name: string | null;
    [key: string]: any;
};

export default function OnboardingGuard({ profile }: { profile: Profile | null }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Condition:
        // 1. Profile exists.
        // 2. Profile has a full_name.
        // If EITHER is false, we consider it "Incomplete".

        // However, we allow the user to be on /dashboard/edit-profile to fix it.
        // We also might allow /dashboard/settings or other essential pages? 
        // User said "only for new sign up users... without filling name they can't go back".
        // So strict block on everything except edit-profile.

        // Skip check if already on edit-profile
        if (pathname === '/dashboard/edit-profile') return;

        const isProfileComplete = profile && profile.full_name && profile.full_name.trim().length > 0;

        if (!isProfileComplete) {
            router.replace('/dashboard/edit-profile');
        }
    }, [profile, pathname, router]);

    return null;
}
