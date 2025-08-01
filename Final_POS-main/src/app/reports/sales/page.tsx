"use client";

import { useState } from "react";

const salesData = [
  { date: "2025-07-29", branch: "Main Street", payment: "Credit Card", total: 5000, items: 100, avg: 50 },
  { date: "2025-07-29", branch: "Main Street", payment: "Cash", total: 3200, items: 80, avg: 40 },
  { date: "2025-07-29", branch: "Downtown", payment: "Credit Card", total: 6000, items: 120, avg: 50 },
  { date: "2025-07-29", branch: "Downtown", payment: "Cash", total: 3500, items: 90, avg: 38.89 },
];

export default function SalesReportPage() {
  const [branch, setBranch] = useState("");
  const [payment, setPayment] = useState("");

  const filtered = salesData.filter(row =>
    (branch ? row.branch === branch : true) &&
    (payment ? row.payment === payment : true)
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
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
        <select
          className="border rounded px-2 py-1 text-white bg-gradient-to-r from-primary to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={payment}
          onChange={e => setPayment(e.target.value)}
        >
          <option value="" className="text-black">All Payments</option>
          <option value="Credit Card" className="text-black">Credit Card</option>
          <option value="Cash" className="text-black">Cash</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Branch</th>
              <th className="border px-3 py-2">Payment Method</th>
              <th className="border px-3 py-2">Total Sales</th>
              <th className="border px-3 py-2">Items Sold</th>
              <th className="border px-3 py-2">Average Order Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="border px-3 py-2">{row.date}</td>
                <td className="border px-3 py-2">{row.branch}</td>
                <td className="border px-3 py-2">{row.payment}</td>
                <td className="border px-3 py-2">Rs. {row.total.toLocaleString()}</td>
                <td className="border px-3 py-2">{row.items}</td>
                <td className="border px-3 py-2">Rs. {row.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}