"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  sku: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-contain mb-2"
        />
        <h4 className="text-sm font-semibold">{product.name}</h4>
        <p className="text-sm text-muted-foreground">Rs. {product.price}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addToCart(product)} className="w-full text-xs">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
