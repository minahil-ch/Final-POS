"use client";

import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/reports/sales" className="block border rounded-lg p-6 shadow hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold mb-2">Sales Report</h2>
          <p className="text-muted-foreground">View sales by date, branch, and payment method.</p>
        </Link>
        <Link href="/reports/inventory" className="block border rounded-lg p-6 shadow hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold mb-2">Inventory Movement Report</h2>
          <p className="text-muted-foreground">Track inventory movement, purchases, sales, and stock levels.</p>
        </Link>
      </div>
    </div>
  );
}