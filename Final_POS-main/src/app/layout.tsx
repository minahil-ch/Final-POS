'use client';

import './globals.css';
import { ReactNode, useEffect, useState } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { PageContentProvider } from '@/context/PageContentContext';
import dynamic from 'next/dynamic';

const AIChatBox = dynamic(() => import('@/components/AIChatBot'), { ssr: false });

export default function RootLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored === 'true') setCollapsed(true);

    const handleToggle = () => {
      const updated = localStorage.getItem('sidebar-collapsed') === 'true';
      setCollapsed(updated);
    };

    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#DCD0FF] dark:bg-gray-700">
        <PageContentProvider>
          <SidebarWrapper collapsed={collapsed} setCollapsed={setCollapsed} />
          <main
            className={`
              transition-all duration-300 max-w-screen-xl
              bg-[#DCD0FF] dark:bg-gray-700 text-black dark:text-white 
              w-full max-w-[90%] mr-auto rounded-xl
              ${collapsed ? 'ml-0' : 'ml-0'}
            `}
          >
            <div className="pl-3 p-8">{children}</div>
          </main>
          <AIChatBox />
        </PageContentProvider>
      </body>
    </html>
  );
}
