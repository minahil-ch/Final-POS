"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import BarcodeScanner from "@/components/BarcodeScanner";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";

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
  const [search, setSearch] = useState("");
  const { addToCart } = useCartStore();

  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4 items-center justify-between">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <BarcodeScanner
          products={mockProducts}
          onScan={(product) => addToCart(product)}
        />

        <CartDrawer />
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.length > 0 ? (
          filtered.map((product) => (
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
