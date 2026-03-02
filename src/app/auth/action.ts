// src/app/auth/action.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signOutAction() {
  const supabase = await createClient();

  // This clears session + cookies correctly
  await supabase.auth.signOut();

  // IMPORTANT: redirect stops all further execution
  redirect('/auth/login');
}
