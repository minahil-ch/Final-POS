'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';


export default function AddUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, role } = formData;

    if (!name || !email || !role) {
      setError('All fields are required.');
      return;
    }

    const { error } = await supabase.from('users').insert([{ name, email, role }]);

    if (error) {
      console.error('Error adding user:', error.message);
      setError('Failed to add user.');
      return;
    }

    router.push('/users');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ali Khan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={formData.email}
              onChange={handleChange}
              placeholder="ali@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Cashier">Cashier</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
