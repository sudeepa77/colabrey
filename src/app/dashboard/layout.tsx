import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OnboardingGuard from './components/OnboardingGuard';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch profile to check completeness status
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <>
            <OnboardingGuard profile={profile} />
            {children}
        </>
    );
}
