// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'POS System',
  description: 'Professional POS Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
  <html lang="en">
    <body className=" ml-10 flex min-h-screen bg-gray-100 dark:bg-black">
      <Sidebar />
      <main className="flex-1 p-8 bg-white dark:bg-black text-black dark:text-white">
        {children}
      </main>
    </body>
  </html>
);

}

import Sidebar from '@/components/Sidebar';
