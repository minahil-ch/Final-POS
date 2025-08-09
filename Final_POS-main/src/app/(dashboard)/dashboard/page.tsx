'use client';

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
  Legend,
  ResponsiveContainer,
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

const dataByYear = {
  2024: [
    { month: 'Jan', sales: 1200, orders: 80, customers: 50 },
    { month: 'Feb', sales: 1500, orders: 95, customers: 60 },
    { month: 'Mar', sales: 1700, orders: 100, customers: 70 },
    { month: 'Apr', sales: 1600, orders: 110, customers: 75 },
    { month: 'May', sales: 1800, orders: 120, customers: 80 },
    { month: 'Jun', sales: 2000, orders: 130, customers: 85 },
    { month: 'Jul', sales: 2200, orders: 145, customers: 90 },
    { month: 'Aug', sales: 2100, orders: 140, customers: 92 },
    { month: 'Sep', sales: 1900, orders: 135, customers: 89 },
    { month: 'Oct', sales: 2300, orders: 150, customers: 95 },
    { month: 'Nov', sales: 2400, orders: 155, customers: 98 },
    { month: 'Dec', sales: 2500, orders: 160, customers: 100 },
  ],
  2025: [
    { month: 'Jan', sales: 1400, orders: 85, customers: 60 },
    { month: 'Feb', sales: 1550, orders: 100, customers: 65 },
    { month: 'Mar', sales: 1800, orders: 105, customers: 75 },
    { month: 'Apr', sales: 1650, orders: 115, customers: 78 },
    { month: 'May', sales: 1850, orders: 125, customers: 82 },
    { month: 'Jun', sales: 2100, orders: 135, customers: 87 },
    { month: 'Jul', sales: 2300, orders: 150, customers: 92 },
    { month: 'Aug', sales: 2200, orders: 145, customers: 94 },
    { month: 'Sep', sales: 2000, orders: 140, customers: 90 },
    { month: 'Oct', sales: 2400, orders: 155, customers: 96 },
    { month: 'Nov', sales: 2500, orders: 160, customers: 98 },
    { month: 'Dec', sales: 2600, orders: 165, customers: 105 },
  ],
};

function RealTimeClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const updateClock = () => setTime(new Date().toLocaleTimeString());
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  if (!time) return null;
  return (
    <div className="text-[10px] text-gray-700 dark:text-white text-right leading-tight hidden sm:block">
      <div>{greeting}, Admin</div>
      <div>{time}</div>
    </div>
  );
}

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
    <button onClick={toggleTheme} className="text-yellow-600 hover:text-yellow-500 transition">
      {theme === 'light' ? <MoonStar size={18} /> : <Sun size={18} />}
    </button>
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
  link.setAttribute('download', `dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DashboardPage() {
  const pathname = usePathname();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [year, setYear] = useState(2025);
  const chartData = dataByYear[year as keyof typeof dataByYear];

  const totalAlerts = lowStockItems.length + outOfStockItems.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
   <div className="relative"></div>
  <div className="absolute top-0 right-0 w-[200px] h-[60px] rounded-bl-2xl z-0 bg-[#DCD0FF] dark:bg-gray-700" />
      {/* ✅ Navbar */}
      <nav className=" relative z-10 bg-white dark:bg-black border-b shadow px-4 py-2 flex items-center justify-between text-black dark:text-white rounded-tr-2xl">
        {/* Sidebar Toggle */}
        <button
          onClick={() => {
            const newState = localStorage.getItem('sidebar-collapsed') !== 'true';
            localStorage.setItem('sidebar-collapsed', newState.toString());
            window.dispatchEvent(new Event('toggle-sidebar'));
          }}
          className="p-2 border border-black dark:border-white rounded-md text-gray-800 dark:text-white hover:bg-[#DCD0FF] dark:hover:bg-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <div className="ml-3 text-lg font-bold">Dashboard</div>
          <div className="ml-3 text-xs opacity-80">Welcome to Largify</div>
        </div>
  <div className="flex-1 flex justify-center px-4">
       

  <div className="relative w-full max-w-sm">
    {/* Search Icon */}
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-800 dark:text-white"

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
  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-gray-900 dark:border-black rounded-md shadow-sm text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none dark:bg-gray-800"
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
                    : 'text-gray-800 dark:text-white hover:bg-white hover:text-teal-700'
                }`}
              >
                <Icon size={14} />
                {name}
              </Link>
            );
          })}
          <Download
            onClick={exportDashboardCSV}
            className="h-5 w-5 text-gray-700 dark:text-white cursor-pointer hover:text-purple-400 transition"
          />
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative">
              <Bell className="text-gray-700 dark:text-white" size={18} />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-[5px] rounded-full">
                  {totalAlerts}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-50 text-xs">
                <div className="p-2 border-b dark:border-gray-700 font-semibold">Alerts & Notifications</div>
                <ul className="max-h-60 overflow-y-auto divide-y dark:divide-gray-700">
                  {[...lowStockItems, ...outOfStockItems].map((item, idx) => (
                    <li key={idx} className="p-2 space-y-1">
                      <div className="font-medium">
                        {item.name}
                        <span className="ml-1 font-normal text-gray-500 dark:text-gray-400">({item.quantity} in stock)</span>
                      </div>
                      <div className={`text-xs ${item.quantity === 0 ? 'text-red-500' : 'text-yellow-600'}`}>
                        {item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </div>
                    </li>
                  ))}
                  {totalAlerts === 0 && <li className="p-2 text-center text-gray-500">No new notifications</li>}
                </ul>
                <div className="p-2 border-t dark:border-gray-700 text-right">
                  <Link href="/products" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
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
            <span className="hidden sm:block text-xs font-semibold text-gray-800 dark:text-white">Admin</span>
          </div>
        </div>
      </nav>

      {/* ✅ Banner */}
      <div className="mt-3 w-full max-w-4xl mx-auto bg-white dark:bg-black text-black dark:text-white py-0 px-6 shadow-md rounded-2xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 text-center">Welcome to Largify POS</h1>
        <div className="text-xs sm:text-sm text-center">Monitor your business performance with real-time insights and analytics.</div>
        <div className="mt-2 text-[11px] sm:text-xs font-mono pl-4">
          <RealTimeClock />
        </div>
      </div>

        {/* ✅ Remaining Dashboard */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-6 gap-2">
          <MetricCard title="Total Sales" value="$250k" color="blue" />
          <MetricCard title="Today's Revenue" value="$1.5k" color="green" />
          <MetricCard title="Active Users" value="12" color="purple" />
          <MetricCard title="Low Stock Items" value={lowStockItems.length.toString()} color="yellow" />
          <MetricCard title="Out of Stock" value={outOfStockItems.length.toString()} color="red" />
          <MetricCard title="Total Inventory Items" value="128" color="indigo" />
        </div>

      {/* ✅ Yearly Graph */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-700 dark:text-white">
          Sales, Orders & Customers - {year}
        </h3>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value) as keyof typeof dataByYear)}
          className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {Object.keys(dataByYear).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#38BDF8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="customers"
            name="Customers"
            stroke="#34D399"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-black p-3 rounded shadow text-xs">
          <h3 className="font-bold text-gray-800 dark:text-gray-300 mb-2">Top Product Report</h3>
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
          <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-100 text-xs rounded p-3 shadow flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">Low Stock Alert:</span>
              <span>{lowStockItems.length} {lowStockItems.length > 1 ? 'products' : 'product'} have low stock.</span>
            </div>
            <Link href="/products" className="text-xs font-medium bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded">
              View Products
            </Link>
          </div>
        )}

        {/* Quick Access & Recent Activity */}
        <div className="flex flex-row gap-4 w-full">
          <div className="w-full lg:w-1/2">
            <RecentActivity />
          </div>
          <div className="w-full lg:w-1/2">
            <QuickAccess />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-black p-2 rounded shadow text-xs">
      <p className="text-gray-500 dark:text-gray-300">{title}</p>
      <p className={`text-lg font-bold text-${color}-600`}>{value}</p>
    </div>
  );
}
