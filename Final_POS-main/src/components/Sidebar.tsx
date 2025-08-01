'use client';

import {
  Home,
  Users,
  ShoppingCart,
  Package,
  ClipboardList,
  Layers,
  BarChart2,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  {
  label: 'Customers',
  icon: <Users />,
  subItems: [
    { label: 'All Customers', href: '/customers?tab=all' },
    { label: 'Add Customer', href: '/customers?tab=add' }, // ✅ fixed href
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
    label: 'Reports',
    icon: <BarChart2 />,
    subItems: [
      { label: 'Sales Graph', href: '/reports/sales' },
      { label: 'Inventory Graph', href: '/reports/inventory' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
   <div
  className={clsx(
    'h-screen sticky top-0 transition-all duration-300 z-50 mt-4 rounded-l-2xl rounded-r-2xl shadow-lg text-white',
    'bg-gradient-to-b from-black to-purple-800 dark:from-gray-900 dark:to-gray-800',
    collapsed ? 'w-15' : 'w-40'
  )}
 >
      {/* Top Header with Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/20 ">
        {!collapsed ? <span className="font-bold text-lg">Largify POS </span> : null}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col mt-4 space-y-2 relative">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className="relative group"
            
          >
            <Link
              href={item.href || '#'}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors"
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
             {item.subItems && !collapsed && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      setOpenMenu((prev) => (prev === item.label ? null : item.label));
    }}
    className="ml-auto focus:outline-none"
  >
    {openMenu === item.label ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
  </button>
)}


            </Link>

            {/* Hover SubMenu Box */}
           {item.subItems && openMenu === item.label && collapsed && (
  <div className="absolute left-full top-0 bg-white text-black shadow-lg rounded-md w-48 z-50">
    {item.subItems.map((sub, i) => (
      <Link
        href={sub.href}
        key={i}
        className="block px-4 py-2 hover:bg-gray-200"
      >
        {sub.label}
      </Link>
    ))}
  </div>
)}
{!collapsed && item.subItems && openMenu === item.label && (
  <div
    className="absolute left-full top-0 mt-2 ml-1 bg-purple-100 text-black shadow-md rounded-xl p-2 space-y-1 z-50 w-48"
  >
    {item.subItems.map((sub, i) => (
      <Link
        href={sub.href}
        key={i}
        className="block px-2 py-1 text-sm rounded hover:bg-purple-200"
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
