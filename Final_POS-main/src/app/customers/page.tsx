'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Search, Download, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

// Customer type
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: 'Retail' | 'Wholesale';
  loyaltyPoints: number;
  tags: string[];
  avatar?: string;
  notes?: string;
  createdAt: string;
  salesHistory: {
    invoiceId: string;
    date: string;
    amount: number;
  }[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'loyaltyPoints'>('name');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'loyaltyPoints' | 'salesHistory' | 'createdAt'>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'Retail',
    tags: [],
    avatar: '',
    notes: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('customers');
    if (stored) setCustomers(JSON.parse(stored));
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData((prev) => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addCustomer = () => {
    if (!formData.name || !formData.phone) return alert('Name and phone required');

    const newCustomer: Customer = {
      id: uuidv4(),
      ...formData,
      loyaltyPoints: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString(),
      salesHistory: [],
    };

    const updated = [...customers, newCustomer];
    setCustomers(updated);
    localStorage.setItem('customers', JSON.stringify(updated));
    setFormData({ name: '', phone: '', email: '', address: '', type: 'Retail', tags: [], avatar: '', notes: '' });
    setShowForm(false);
  };

  const exportToPDF = () => {
    alert('PDF Export will be handled with jsPDF or react-pdf in production.');
  };

  const filteredCustomers = customers
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'loyaltyPoints') return b.loyaltyPoints - a.loyaltyPoints;
      return 0;
    });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="bg-gradient-to-r from-primary to-purple-600 p-4 rounded text-white flex items-center justify-between shadow">
        <h2 className="text-lg font-bold">Customers</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)} className="bg-white text-primary px-2 py-1 text-xs rounded shadow flex items-center gap-1">
            <UserPlus size={16} /> Add Customer
          </button>
          <button onClick={exportToPDF} className="bg-white text-primary px-2 py-1 text-xs rounded shadow flex items-center gap-1">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-md space-y-4 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-2">Add New Customer</h3>
            <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Full Name" className="w-full px-3 py-2 border rounded" />
            <input name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Phone" className="w-full px-3 py-2 border rounded" />
            <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" className="w-full px-3 py-2 border rounded" />
            <input name="address" value={formData.address} onChange={handleFormChange} placeholder="Address" className="w-full px-3 py-2 border rounded" />
            <select name="type" value={formData.type} onChange={handleFormChange} className="w-full px-3 py-2 border rounded">
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
            </select>
            <input name="tags" value={formData.tags.join(',')} onChange={handleFormChange} placeholder="Tags (comma separated)" className="w-full px-3 py-2 border rounded" />
            <input name="avatar" value={formData.avatar} onChange={handleFormChange} placeholder="Avatar URL (optional)" className="w-full px-3 py-2 border rounded" />
            <textarea name="notes" value={formData.notes} onChange={handleFormChange} placeholder="Notes" className="w-full px-3 py-2 border rounded" />
            <button onClick={addCustomer} className="bg-primary text-white px-4 py-2 rounded w-full">Save Customer</button>
          </div>
        </div>
      )}

      {/* Search & Sort */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          <input type="text" placeholder="Search customers..." className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select onChange={(e) => setSortKey(e.target.value as any)} className="text-sm border rounded px-2 py-1">
          <option value="name">Sort by Name</option>
          <option value="loyaltyPoints">Sort by Loyalty Points</option>
        </select>
      </div>

      {/* Customer Cards */}
      <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow text-sm space-y-2">
            <div className="flex items-center gap-3">
              <img src={c.avatar || 'https://placehold.co/48x48'} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold">{c.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{c.type} Customer</p>
              </div>
            </div>
            <div>
              <p>📞 {c.phone}</p>
              <p>📧 {c.email}</p>
              <p>🏠 {c.address}</p>
              <p>🎯 Tags: {c.tags.join(', ') || 'None'}</p>
              <p>📝 Notes: {c.notes || '—'}</p>
              <p>⭐ Loyalty: {c.loyaltyPoints} pts</p>
              <p className="text-xs text-gray-400">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold mt-2">Sales History:</p>
              {c.salesHistory.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No invoices yet</p>
              ) : (
                c.salesHistory.map((inv) => (
                  <p key={inv.invoiceId}>🧾 #{inv.invoiceId} – {inv.date} – ${inv.amount}</p>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-2 text-xs">
              <Link href={`/sales?saleFor=${c.id}`} className="bg-primary text-white px-2 py-1 rounded flex items-center gap-1">
                <ArrowRight size={14} /> New Sale
              </Link>
              <Link href={`/customers/${c.id}`} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded">
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center text-gray-500 mt-6">No customers found.</div>
      )}
    </div>
  );
}
