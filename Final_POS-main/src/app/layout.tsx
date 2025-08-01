import './globals.css';
import { ReactNode } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper'; // Client wrapper

export const metadata = {
  title: 'POS System',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="ml-10 flex min-h-screen bg-gray-100 dark:bg-black">
        <SidebarWrapper /> {/* this renders client Sidebar properly */}
        <main className="flex-1 p-8 bg-white dark:bg-black text-black dark:text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
