//src/app/dashboard/sidebar.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutGrid,
  MessageSquare,
  PlusSquare,
  Users,
  UserCircle,
  LogOut,
  Bookmark,
  Search,
  Bell,
  Handshake,
} from 'lucide-react';
import { signOutAction } from '@/app/auth/action';
import { getUnreadCount, subscribeToNotifications } from '@/lib/notifications/api';

// ─── Supabase client at module level — not recreated every render ───────────
const supabase = createClient();

// ─── Nav items ───────────────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutGrid,   label: 'Dashboard',    href: '/dashboard' },
  { icon: Search,       label: 'Search',        href: '/dashboard/search' },
  { icon: Bell,         label: 'Notifications', href: '/dashboard/notifications' },
  { icon: MessageSquare,label: 'Messages',      href: '/dashboard/messages' },
  { icon: Handshake,    label: 'Connections',   href: '/dashboard/connections' },
  { icon: PlusSquare,   label: 'Create Post',   href: '/dashboard/post' },
  { icon: Users,        label: 'Community',     href: '/dashboard/community' },
  { icon: Bookmark,     label: 'Saved',         href: '/dashboard/saved' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Load user + initial unread count + subscribe to realtime ─────────────
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      // Load the actual unread count from the DB
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch {
        // Non-fatal — badge just won't show
      }

      // Subscribe to realtime notifications
      // Re-fetch the real count instead of blindly incrementing
      // so the badge is always accurate (handles concurrent sessions, etc.)
      unsubscribe = subscribeToNotifications(user.id, async () => {
        try {
          const count = await getUnreadCount();
          setUnreadCount(count);
        } catch {
          // Silently ignore — count stays at last known value
        }
      });
    };

    init();

    return () => {
      unsubscribe?.();
    };
  }, []);

  // ── Reset badge when user visits the notifications page ───────────────────
  useEffect(() => {
    if (pathname === '/dashboard/notifications') {
      setUnreadCount(0);
    }
  }, [pathname]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isActive = (href: string) => {
    // Exact match for dashboard root, prefix match for everything else
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 hover:w-64 bg-black/95 backdrop-blur-sm border-r border-neutral-800 flex flex-col py-6 z-[100] transition-all duration-300 ease-in-out group overflow-hidden shadow-2xl">

      {/* ── Logo ── */}
      <div className="mb-8 px-5 flex items-center gap-4">
        <Link href="/dashboard" className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FF6B35] flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Colabrey Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </Link>
        <div className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
          <span className="text-xl font-bold text-white tracking-tight">
            Colabrey
          </span>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav className="flex-1 flex flex-col gap-1 w-full px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isNotifications = item.label === 'Notifications';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group/item relative ${
                active
                  ? 'bg-neutral-900 text-blue-500'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {/* Icon + notification badge */}
              <div className="relative flex-shrink-0">
                <Icon className="w-6 h-6 transition-transform duration-200 group-hover/item:scale-110" />

                {/* Notification badge — only on the Bell icon */}
                {isNotifications && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>

              {/* Label (visible on hover) */}
              <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="flex flex-col gap-1 w-full px-3 mt-auto">
        {/* Profile link */}
        <Link
          href={userId ? '/dashboard/edit-profile' : '#'}
          className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group/item hover:bg-neutral-900 ${
            pathname.startsWith('/dashboard/edit-profile')
              ? 'bg-neutral-900 text-blue-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <UserCircle className="w-6 h-6 flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
          <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap text-sm font-medium">
            Profile
          </span>
        </Link>

        {/* Sign out */}
        <form action={signOutAction} className="w-full">
          <button
            type="submit"
            className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-all text-left group/item"
          >
            <LogOut className="w-6 h-6 flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
            <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap text-sm font-medium">
              Log Out
            </span>
          </button>
        </form>
      </div>
    </aside>
  );
}