'use client';

import { BadgeCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const orders = [
    {
      id: 'ORD001',
      customer: 'Qudsia',
      total: 3500,
      status: 'Pending',
    },
    {
      id: 'ORD002',
      customer: 'Ayesha',
      total: 2200,
      status: 'Completed',
    },
    {
      id: 'ORD003',
      customer: 'Minahil',
      total: 4500,
      status: 'Pending',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-medium">
            <BadgeCheck size={14} /> Completed
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-medium">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="p-4 w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-gradient-to-r from-primary to-purple-600 p-4 rounded text-white flex items-center justify-between shadow">
        <h1 className="text-lg font-bold">📦 All Orders</h1>
        
      </div>

      <div className="mt-6 overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Total (PKR)</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 border-b">{order.id}</td>
                <td className="p-3 border-b">{order.customer}</td>
                <td className="p-3 border-b">Rs. {order.total.toLocaleString()}</td>
                <td className="p-3 border-b">{getStatusBadge(order.status)}</td>
                <td className="p-3 border-b text-center">
                  <Button variant="secondary" className="text-xs">
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-6">No orders available.</div>
      )}
    </div>
  );
}
