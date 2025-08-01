"use client";

import { useState } from "react";

const inventoryData = [
  { product: "Organic Apples", sku: "APL-001", qty: 100, purchase: 50, sales: 30, transferIn: 10, transferOut: 5, closing: 125 },
  { product: "Wheat Bread", sku: "BRD-002", qty: 80, purchase: 40, sales: 20, transferIn: 5, transferOut: 2, closing: 103 },
  { product: "Almond Milk", sku: "MLK-003", qty: 60, purchase: 30, sales: 15, transferIn: 8, transferOut: 3, closing: 80 },
  { product: "Cheddar Cheese", sku: "CHS-004", qty: 90, purchase: 45, sales: 25, transferIn: 7, transferOut: 4, closing: 113 },
];

export default function InventoryReportPage() {
  const [branch, setBranch] = useState("");

  // In a real app, filter by branch, date, etc.
  const filtered = inventoryData;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Inventory Movement Report</h1>
      <div className="flex gap-4 mb-6">
        <select
          className="border rounded px-2 py-1 text-white bg-gradient-to-r from-primary to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={branch}
          onChange={e => setBranch(e.target.value)}
        >
          <option value="" className="text-black">All Branches</option>
          <option value="Main Street" className="text-black">Main Street</option>
          <option value="Downtown" className="text-black">Downtown</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Product</th>
              <th className="border px-3 py-2">SKU</th>
              <th className="border px-3 py-2">Opening Stock</th>
              <th className="border px-3 py-2">Purchase</th>
              <th className="border px-3 py-2">Sales</th>
              <th className="border px-3 py-2">Transfer In</th>
              <th className="border px-3 py-2">Transfer Out</th>
              <th className="border px-3 py-2">Closing Stock</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="border px-3 py-2">{row.product}</td>
                <td className="border px-3 py-2">{row.sku}</td>
                <td className="border px-3 py-2">{row.qty}</td>
                <td className="border px-3 py-2">{row.purchase}</td>
                <td className="border px-3 py-2">{row.sales}</td>
                <td className="border px-3 py-2">{row.transferIn}</td>
                <td className="border px-3 py-2">{row.transferOut}</td>
                <td className="border px-3 py-2">{row.closing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}