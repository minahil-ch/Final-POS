"use client";
import { useCartStore } from "@/lib/cartStore";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [confirmedTotal, setConfirmedTotal] = useState(0);


  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePlaceOrder = () => {
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[0-9]{11}$/;

  if (!name || !phone || !address) {
    setError("⚠️ Please fill in all your information to place the order.");
    return;
  }

  if (!nameRegex.test(name)) {
    setError("⚠️ Name should only contain letters and spaces.");
    return;
  }

  if (!phoneRegex.test(phone)) {
    setError("⚠️ Phone number must be exactly 11 digits and contain only numbers.");
    return;
  }

  setError("");
  setConfirmedTotal(total);
  setOrderPlaced(true);
  clearCart();
};



  if (orderPlaced) {
    return (
      <div className="p-6 text-center max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Confirmed!</h1>
        <p className="text-lg mb-2">Thank you, {name}!</p>
        <p className="text-gray-600">Your order has been placed successfully.</p>
        <p className="mt-4">We will contact you at <strong>{phone}</strong> and deliver to:</p>
        <p className="italic text-sm text-gray-500 mt-2">{address}</p>
        <div className="mt-6 text-xl font-semibold">Total: Rs {confirmedTotal}</div>

      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* User Details */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>

      {/* Cart Summary */}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4 mb-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border p-3 rounded"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>
                  Rs {item.price} × {item.quantity || 1}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total & Place Order */}
      <div className="text-right font-semibold text-lg mb-4">
        Total: Rs {total}
      </div>

      <button
  onClick={handlePlaceOrder}
  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
>
  Place Order
</button>


    </div>
  );
}
