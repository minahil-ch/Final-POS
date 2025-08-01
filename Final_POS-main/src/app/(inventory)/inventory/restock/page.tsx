'use client';

import { useState } from 'react';
import { PackagePlus } from 'lucide-react';

const products = [
  { id: 1, name: 'Organic Apples', sku: 'APL-001', currentStock: 125 },
  { id: 2, name: 'Wheat Bread', sku: 'BRD-002', currentStock: 103 },
  { id: 3, name: 'Almond Milk', sku: 'MLK-003', currentStock: 80 },
];

export default function RestockPage() {
  const [restockQuantities, setRestockQuantities] = useState<{ [key: number]: number }>({});

  const handleRestock = (id: number) => {
    const quantity = restockQuantities[id];
    if (!quantity || quantity <= 0) return alert('Please enter a valid quantity');
    alert(`Restocked ${quantity} units of product ID ${id}`);
    setRestockQuantities((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 rounded shadow flex items-center justify-between text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <PackagePlus size={20} /> Restock Inventory
        </h2>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col gap-2"
          >
            <div className="font-semibold text-lg">{product.name}</div>
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
            <div className="text-sm">Current Stock: {product.currentStock}</div>
            <input
              type="number"
              placeholder="Enter quantity"
              value={restockQuantities[product.id] || ''}
              onChange={(e) =>
                setRestockQuantities((prev) => ({
                  ...prev,
                  [product.id]: parseInt(e.target.value),
                }))
              }
              className="border rounded px-2 py-1 mt-2"
            />
            <button
              onClick={() => handleRestock(product.id)}
              className="bg-purple-600 text-white rounded px-3 py-1 hover:bg-purple-700 transition"
            >
              Restock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
