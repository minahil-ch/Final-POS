'use client';

import { useState } from 'react';
import { Settings, User, Palette, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
            <Settings className="inline-block w-6 h-6 mr-2" />
            Settings
          </h1>
        </div>

        {/* General Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-primary dark:text-purple-400">
            <User size={18} />
            General
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-300">Business Name</label>
              <input
                type="text"
                placeholder="POS Inc."
                className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-300">Owner Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-primary dark:text-purple-400">
            <Palette size={18} />
            Preferences
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Enable Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                  {darkMode ? 'On' : 'Off'}
                </span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                  {emailNotifications ? 'On' : 'Off'}
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Account Security */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-primary dark:text-purple-400">
            <Lock size={18} />
            Account & Security
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-300">Email</label>
              <input
                type="email"
                placeholder="admin@pos.com"
                className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="text-right">
          <button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white px-6 py-2 text-sm font-medium rounded shadow transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
