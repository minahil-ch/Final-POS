'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RecentActivity from "@/components/RecentActivity";
import QuickAccess from '@/components/QuickAccess';
import {
  ShoppingCart,
  Package,
  ClipboardList,
  ClipboardCheck,
  Users,
  FileBarChart,
  Settings,
  Download,
  AlertTriangle,
  Sun,
  MoonStar,
  Bell,
  User,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const navItems = [{ name: '', path: '/settings', icon: Settings }];

const lowStockItems = [
  { name: 'Mouse', quantity: 2 },
  { name: 'Keyboard', quantity: 1 },
  { name: 'USB Cable', quantity: 3 },
];

const outOfStockItems = [
  { name: 'HDMI Cable', quantity: 0 },
  { name: 'Laptop Charger', quantity: 0 },
];

const topProducts = [
  { name: 'Wireless Mouse', sales: 1240 },
  { name: 'Gaming Keyboard', sales: 980 },
  { name: 'Laptop Stand', sales: 860 },
  { name: 'Monitor 24"', sales: 750 },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };
  return (
    <button
      onClick={toggleTheme}
      className="text-yellow-600 hover:text-yellow-500 transition"
      title="Toggle Theme"
    >
      {theme === 'light' ? <MoonStar size={18} /> : <Sun size={18} />}
    </button>
  );
}

function RealTimeClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const updateClock = () => {
      const now = new Date().toLocaleTimeString();
      setTime(now);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  if (!time) return null;
  return (
    <div className="text-[10px] text-white hidden sm:block text-right leading-tight">
      <div>{greeting}, Admin</div>
      <div>{time}</div>
    </div>
  );
  
}



function exportDashboardCSV() {
  const data = [
    ['Metric', 'Value'],
    ['Total Sales', '$250000'],
    ["Today's Revenue", '$1500'],
    ['Active Users', '12'],
    ['Low Stock Items', lowStockItems.length.toString()],
    ['Out of Stock Items', outOfStockItems.length.toString()],
  ];
  const csvContent = data.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    'download',
    `dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DashboardPage() {

  const [range, setRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  const getChartData = () => {
    switch (range) {
      case 'Daily':
        return [
          { label: '8AM', sales: 300 },
          { label: '10AM', sales: 500 },
          { label: '12PM', sales: 400 },
          { label: '2PM', sales: 600 },
        ];
      case 'Weekly':
        return [
          { label: 'Mon', sales: 2200 },
          { label: 'Tue', sales: 1800 },
          { label: 'Wed', sales: 2000 },
          { label: 'Thu', sales: 2500 },
          { label: 'Fri', sales: 2700 },
          { label: 'Sat', sales: 1900 },
          { label: 'Sun', sales: 2300 },
        ];
      case 'Monthly':
        return [
          { label: 'Week 1', sales: 8000 },
          { label: 'Week 2', sales: 10500 },
          { label: 'Week 3', sales: 9500 },
          { label: 'Week 4', sales: 12000 },
        ];
      default:
        return [];
    }
  };

  const getOverviewChartData = () => {
    const data = getChartData();
    return data.map((item) => ({
      ...item,
      orders: Math.floor(item.sales / 30) + 150,
    }));
  };

  const totalAlerts = lowStockItems.length + outOfStockItems.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 overflow-hidden rounded-2xl">
      {/* ✅ Navbar */}
<nav className="bg-gradient-to-r from-primary to-purple-600 dark:bg-gray-900 dark:from-gray-900 dark:to-gray-900 border-b shadow px-4 py-2 flex items-center justify-between rounded-2xl">

        <div>
  <div className="text-lg font-bold text-white">POS Dashboard</div>
  <div className="text-[10px] text-white opacity-80">Welcome to Largify</div>
</div>

       <div className="flex-1 flex justify-center px-4">
  <div className="relative w-full max-w-sm">
    {/* Search Icon */}
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z"
        />
      </svg>
    </div>

    {/* Search Input */}
    <input
      type="text"
      placeholder="Search..."
      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-black rounded-md shadow-sm text-sm text-white placeholder-gray-300 focus:outline-none dark:bg-gray-800 dark:border-black"
    />
  </div>
</div>


        <div className="flex items-center space-x-3">
          {navItems.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={name}
                href={path}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                  isActive
                    ? 'bg-white text-teal-700'
                    : 'text-white hover:bg-white hover:text-teal-700'
                }`}
              >
                <Icon size={14} />
                {name}
              </Link>
              
            );
          })}
          <Download
    onClick={exportDashboardCSV}
    className="h-5 w-5 text-white cursor-pointer hover:text-purple-400 transition"
  />
          <div className="relative" ref={notificationRef}>
            
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-white"
              title="Notifications"
              
            >
              
              
              <Bell size={18} />
              
              
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-[5px] rounded-full">
                  {totalAlerts}
                </span>
              )}
              
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-50 text-xs">
                <div className="p-2 border-b dark:border-gray-700 font-semibold">
                  Alerts & Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto divide-y dark:divide-gray-700">
                  {[...lowStockItems, ...outOfStockItems].map((item, idx) => (
                    <li key={idx} className="p-2 space-y-1">
                      <div className="font-medium">
                        {item.name}
                        <span className="ml-1 font-normal text-gray-500 dark:text-gray-400">
                          ({item.quantity} in stock)
                        </span>
                      </div>
                      <div
                        className={`text-xs ${
                          item.quantity === 0
                            ? 'text-red-500'
                            : 'text-yellow-600'
                        }`}
                      >
                        {item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </div>
                    </li>
                  ))}
                  {totalAlerts === 0 && (
                    <li className="p-2 text-center text-gray-500">No new notifications</li>
                  )}
                </ul>
                <div className="p-2 border-t dark:border-gray-700 text-right">
                  <Link
                    href="/products"
                    className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
                  >
                    View All Alerts
                  </Link>
                </div>
              </div>
            )}
          </div>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center shadow">
              <User className="text-white" size={20} />
            </div>
            <span className="hidden sm:block text-xs font-semibold text-white">
              Admin
            </span>
          </div>
        </div>
      </nav> 
      {/* ✅ Welcome Banner Below Navbar */}
      
<div className="mt-6 bg-gradient-to-r from-primary to-purple-600 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-800 text-white py-4 px-6 shadow-md rounded-2xl">

  <h1 className="text-xl sm:text-2xl font-bold mb-1 text-center">
    Welcome to Largify POS
  </h1>
  <div className="text-xs sm:text-sm text-center">
    Monitor your business performance with real-time insights and analytics.
  </div>
  <div className="mt-2 text-[11px] sm:text-xs font-mono pl-4">
    <RealTimeClock />
  </div>
</div>


   

      {/* ✅ Main */}
      <div className="max-w-screen-xl mx-auto px-4">
      <main className="p-4 space-y-4">
        {/* Metrics Cards */}
        <div className="grid grid-cols-6 gap-2 mt-2">
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
            <p className="text-gray-500 dark:text-gray-300">Total Sales</p>
            <p className="text-lg font-bold text-blue-600">$250k</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
            <p className="text-gray-500 dark:text-gray-300">Today's Revenue</p>
            <p className="text-lg font-bold text-green-600">$1.5k</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
            <p className="text-gray-500 dark:text-gray-300">Active Users</p>
            <p className="text-lg font-bold text-purple-600">12</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
            <p className="text-gray-500 dark:text-gray-300">Low Stock Items</p>
            <p className="text-lg font-bold text-yellow-600">{lowStockItems.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
            <p className="text-gray-500 dark:text-gray-300">Out of Stock</p>
            <p className="text-lg font-bold text-red-600">{outOfStockItems.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
            <p className="text-gray-500 dark:text-gray-300">Total Inventory Items</p>
            <p className="text-lg font-bold text-indigo-600">128</p>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex justify-between items-center mt-1">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Charts - {range}
          </h2>
          <div className="space-x-1">
            {['Daily', 'Weekly', 'Monthly'].map((item) => (
              <button
                key={item}
                onClick={() => setRange(item as typeof range)}
                className={`px-2 py-1 text-xs rounded font-medium ${
                  range === item
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-gray-800 border dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-gray-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow h-64">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Sales Trend
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={9} />
                <YAxis fontSize={9} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow h-64">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Sales vs Orders
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getOverviewChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={9} />
                <YAxis fontSize={9} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#60A5FA" />
                <Bar dataKey="orders" fill="#34D399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Below */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow text-xs">
          <h3 className="font-medium text-gray-600 dark:text-gray-300 mb-2">
            Top Product Report
          </h3>
          <ul className="space-y-1">
            {topProducts.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.name}</span>
                <span className="font-semibold text-teal-600">{item.sales}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100 text-xs rounded p-3 shadow flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">Low Stock Alert:</span>
              <span>
                {lowStockItems.length}{' '}
                {lowStockItems.length > 1 ? 'products' : 'product'} have low stock.
              </span>
            </div>
            <Link
              href="/products"
              className="text-xs font-medium bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded"
            >
              View Products
            </Link>
          </div>
        )}
        
       
  <div className="flex flex-row gap-4 w-full">
    <div className="w-full lg:w-1/2 h-full">
      <RecentActivity />
    </div>
    <div className="w-full lg:w-1/2 h-full">
      <QuickAccess />
    </div>
  </div>
      </main>
      </div>
    </div>
  );
}
