'use client';

import { useState } from 'react';
import { PackageSearch } from 'lucide-react';

const inventoryLogs = [
  { product: 'Organic Apples', sku: 'APL-001', opening: 100, purchase: 50, sales: 30, transferIn: 10, transferOut: 5, closing: 125 },
  { product: 'Wheat Bread', sku: 'BRD-002', opening: 80, purchase: 40, sales: 20, transferIn: 5, transferOut: 2, closing: 103 },
  { product: 'Almond Milk', sku: 'MLK-003', opening: 60, purchase: 30, sales: 15, transferIn: 8, transferOut: 3, closing: 80 },
];

export default function InventoryLogsPage() {
  const [branch, setBranch] = useState('');

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded shadow flex items-center justify-between text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <PackageSearch size={20} /> Inventory Logs
        </h2>

        <select
          className="bg-white text-sm text-black px-3 py-1 rounded shadow focus:outline-none"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">All Branches</option>
          <option value="Main Street">Main Street</option>
          <option value="Downtown">Downtown</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-3 py-2 border">Product</th>
              <th className="px-3 py-2 border">SKU</th>
              <th className="px-3 py-2 border">Opening</th>
              <th className="px-3 py-2 border">Purchase</th>
              <th className="px-3 py-2 border">Sales</th>
              <th className="px-3 py-2 border">Transfer In</th>
              <th className="px-3 py-2 border">Transfer Out</th>
              <th className="px-3 py-2 border">Closing</th>
            </tr>
          </thead>
          <tbody>
            {inventoryLogs.map((row, index) => (
              <tr key={index} className="even:bg-gray-50 dark:even:bg-gray-800">
                <td className="px-3 py-2 border">{row.product}</td>
                <td className="px-3 py-2 border">{row.sku}</td>
                <td className="px-3 py-2 border">{row.opening}</td>
                <td className="px-3 py-2 border">{row.purchase}</td>
                <td className="px-3 py-2 border">{row.sales}</td>
                <td className="px-3 py-2 border">{row.transferIn}</td>
                <td className="px-3 py-2 border">{row.transferOut}</td>
                <td className="px-3 py-2 border">{row.closing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
