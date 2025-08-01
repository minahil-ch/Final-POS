'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import BarcodeScanner from "@/components/BarcodeScanner";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";
import { Button } from "@/components/ui/button";

const mockProducts = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 1200,
    image: "/images/mouse.jpeg",
    sku: "MOU123",
  },
  {
    id: 2,
    name: "Keyboard",
    price: 2500,
    image: "/images/keyboard.jpeg",
    sku: "KEY456",
  },
  {
    id: 3,
    name: "USB Cable",
    price: 500,
    image: "/images/usb.jpeg",
    sku: "USB789",
  },
];

export default function SalesPage() {
  const { addToCart } = useCartStore();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "new";

  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    setFilteredProducts(
      mockProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  if (tab === "report") {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Sales Report</h2>
        <p>📊 Coming soon: Graphs and sale summaries will show here.</p>
        <Link href="/sales?tab=new">
          <Button className="mt-4">← Back to New Sale</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">🛒 New Sale</h2>
        <Link href="/sales?tab=report">
          <Button variant="outline">📈 View Sales Report</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <div className="flex items-center gap-2">
          <BarcodeScanner
            products={mockProducts}
            onScan={(product) => addToCart(product)}
          />
          <CartDrawer />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
