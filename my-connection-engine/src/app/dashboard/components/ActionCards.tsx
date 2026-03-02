// app/dashboard/components/ActionCards.tsx

import Link from 'next/link';
import { Search, MessageSquare, UserCircle } from 'lucide-react';

const actions = [
  {
    title: 'Find People',
    description: 'Connect with peers based on shared skills & interests.',
    href: '/dashboard/search',
    icon: Search,
    iconColor: 'text-blue-500',
    wrapperClass: 'bg-neutral-900 border-neutral-800'
  },
  {
    title: 'Messages',
    description: 'Chat instantly with your network connections.',
    href: '/dashboard/messages',
    icon: MessageSquare,
    iconColor: 'text-green-500',
    wrapperClass: 'bg-neutral-900 border-neutral-800'
  },
  {
    title: 'Edit Profile',
    description: 'Showcase your best self with an updated profile.',
    href: '/dashboard/edit-profile',
    icon: UserCircle,
    iconColor: 'text-purple-500',
    wrapperClass: 'bg-neutral-900 border-neutral-800'
  },
];

export default function ActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className={`block p-6 rounded-3xl border border-neutral-800 bg-neutral-900 transition-transform hover:scale-[1.02]`}
          >
            <div className="flex flex-col h-full">
              <div className={`w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {action.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {action.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}