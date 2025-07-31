"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  sku: string;
}

interface Props {
  products: Product[];
  onScan: (product: Product) => void;
}

export default function BarcodeScanner({ products, onScan }: Props) {
  const [barcode, setBarcode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleScan = () => {
    const matched = products.find((p) => p.sku === barcode);
    if (matched) {
      onScan(matched);
      setBarcode("");
      setErrorMessage(""); // clear error if successful
    } else {
      setErrorMessage("❌ Product not found for this barcode.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Scan barcode..."
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleScan();
          }}
          className="w-48"
        />
        <Button variant="outline" onClick={handleScan}>
          Scan
        </Button>
      </div>

      {/* Error message UI */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
