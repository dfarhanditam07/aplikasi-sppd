'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ClipboardIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Buat Surat', icon: HomeIcon },
    { href: '/pending', label: 'Pending Approval', icon: ClipboardIcon },
    { href: '/approved', label: 'Disetujui', icon: CheckCircleIcon },
    { href: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                Surat Dinas
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-white text-white'
                      : 'border-transparent text-gray-200 hover:border-gray-300 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-300`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? 'bg-indigo-700 text-white'
                  : 'text-gray-200 hover:bg-indigo-600 hover:text-white'
              } block pl-3 pr-4 py-2 text-base font-medium transition duration-300`}
            >
              <item.icon className="h-5 w-5 mr-2 inline" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}