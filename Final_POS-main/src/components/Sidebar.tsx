'use client';

import {
  Home,
  Users,
  ShoppingCart,
  Package,
  ClipboardList,
  Layers,
  GitBranchPlus,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
   UserCog, 
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
 
const menuItems = [
  { label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  {
    label: 'Customers',
    icon: <Users />,
    subItems: [
      { label: 'All Customers', href: '/customers?tab=all' },
      { label: 'Add Customer', href: '/customers?tab=add' },
    ],
  },
  {
    label: 'Sales',
    icon: <ShoppingCart />,
    subItems: [
      { label: 'New Sale', href: '/sales?tab=new' },
      { label: 'Sales Report', href: '/sales?tab=report' },
    ],
  },
  {
    label: 'Orders',
    icon: <ClipboardList />,
    subItems: [
      { label: 'All Orders', href: '/orders' },
      { label: 'Track Order', href: '/orders/track' },
    ],
  },
  {
    label: 'Inventory',
    icon: <Layers />,
    subItems: [
      { label: 'Inventory Logs', href: '/inventory/logs' },
      { label: 'Restock', href: '/inventory/restock' },
    ],
  },
   
  {
    label: 'Products',
    icon: <Package />,
    subItems: [
      { label: 'All Products', href: '/products' },
      { label: 'Add Product', href: '/products/allproducts/addproduct' },
    ],
  },
   {
    label: 'Users',
    icon: <UserCog />,
    subItems: [
      { label: 'All Users', href: '/users' },
      { label: 'Add User', href: '/users/add' },
    ],
  },

   {
    label: 'Branches',
    icon: <GitBranchPlus />,
    subItems: [
      { label: 'Add branches', href: '/add-branch' },
    
    ],
  },

  
  {
    label: 'Reports',
    icon: <BarChart2 />,
    subItems: [
      { label: 'Sales Graph', href: '/reports/sales' },
      { label: 'Inventory Graph', href: '/reports/inventory' },
    ],
  },
];



export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
   <div
  className={clsx(
    'sticky top-8 left-7 z-40 shadow-lg transition-all duration-300',
    'bg-white dark:bg-black text-gray-800 dark:text-white',
    'rounded-tl-2xl rounded-bl-2xl', // ✅ Rounded only on top-left and bottom-left
    'mt-6 ml-2 mb-4',
    collapsed ? 'w-13 h-[96vh]' : 'w-46 h-[96vh]'
  )}
>


      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
        {!collapsed && (
          <span className="font-bold text-lg text-black dark:text-white">
            Largify POS
          </span>
        )}
       
      </div>

      {/* Menu Items */}
      <div className="flex flex-col mt-3 space-y-1 relative">
        {menuItems.map((item, idx) => (
          <div key={idx} className="relative group">
            <Link
              href={item.href || '#'}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F3E5F5] dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200"
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {item.subItems && !collapsed && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu((prev) => (prev === item.label ? null : item.label));
                  }}
                  className="ml-auto text-gray-400 dark:text-gray-300"
                >
                {openMenu === item.label ? (
  <ChevronUp size={14} className="text-gray-700 dark:text-gray-300" />
) : (
  <ChevronDown size={14} className="text-gray-700 dark:text-gray-300" />
)}

                </button>
              )}
            </Link>

            {/* Submenu beside */}
            {!collapsed && item.subItems && openMenu === item.label && (
              <div className="absolute left-full top-0 ml-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-xl p-2 space-y-1 z-50 w-44">
                {item.subItems.map((sub, i) => (
                  <Link
                    key={i}
                    href={sub.href}
                    className="block px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}