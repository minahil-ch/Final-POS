"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Dummy users (You can add "name" too if needed)
const users = [
  { name: "Admin", email: "admin@example.com", password: "123", role: "admin" },
  { name: "Cashier", email: "cashier@example.com", password: "123", role: "cashier" },
  { name: "Inventory", email: "inventory@example.com", password: "123", role: "inventory_manager" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Save role in localStorage
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name); // optional
      router.push("/dashboard"); // You can change route if needed
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
  type="submit"
  className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-2 rounded-md shadow-md hover:opacity-90 transition duration-300"
>
  Login
</button>

      </form>
    </div>
  );
}
