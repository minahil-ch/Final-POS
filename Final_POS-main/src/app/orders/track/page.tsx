'use client';

import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage() {
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-500 p-4 rounded text-white flex items-center justify-between shadow">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <MapPin size={20} /> Track Orders
        </h1>
        <Link href="/orders">
          <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded border border-white text-white hover:bg-white hover:text-purple-700 transition font-medium bg-white/10">
            <ArrowLeft size={16} /> Back to Orders
          </button>
        </Link>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          📍 Tracking system coming soon. You’ll be able to see live order updates here.
        </p>
      </div>
    </div>
  );
}
