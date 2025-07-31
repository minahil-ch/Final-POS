"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCartStore();

  const router = useRouter();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    router.push("/checkout"); // Redirect to checkout page
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">🛒 Cart ({cart.length})</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetTitle className="text-lg font-semibold mb-4">Cart</SheetTitle>

        <div className="space-y-4">
          {cart.length === 0 && <p>No items in cart.</p>}
          {cart.map((item) => (
            <div key={item.id} className="border rounded p-2 space-y-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Rs. {item.price} × {item.quantity}
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => decreaseQty(item.id)}>−</Button>
                <Button size="sm" onClick={() => increaseQty(item.id)}>+</Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="font-semibold">Total: Rs. {total}</p>
            <Button className="w-full" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
