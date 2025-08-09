'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (!error) setUsers(data as User[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      name: name ? '' : 'Please enter a name',
      email: email ? '' : 'Please enter an email',
      role: role ? '' : 'Please select a role',
    };

    setErrors(newErrors);

    if (!name || !email || !role) return;

    if (editingId) {
      const { error } = await supabase
        .from('users')
        .update({ name, email, role })
        .eq('id', editingId);
      if (!error) {
        showMessage('✅ User successfully updated!');
        setEditingId(null);
        resetForm();
        fetchUsers();
      }
    } else {
      const { error } = await supabase.from('users').insert([
        { id: uuidv4(), name, email, role },
      ]);
      if (!error) {
        showMessage('✅ New user added!');
        resetForm();
        fetchUsers();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) {
      showMessage('🗑️ User deleted.');
      fetchUsers();
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('');
    setErrors({ name: '', email: '', role: '' });
    setEditingId(null);
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="bg-white min-h-screen p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>

      {/* Success Message */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex items-center text-green-700 bg-green-100 border border-green-300 rounded px-6 py-6 text-sm shadow-lg h-24">
            <CheckCircle className="mr-2 h-6 w-6" />
            <span className="text-base font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <input
            className="block w-full p-2 border border-gray-300 rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>

        <div>
          <input
            className="block w-full p-2 border border-gray-300 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div>
          <select
            className="block w-full p-2 border border-gray-300 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          {errors.role && (
            <span className="text-red-500 text-sm">{errors.role}</span>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {editingId ? 'Update User' : 'Add User'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Users Table */}
      <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-600">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-t text-sm hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
