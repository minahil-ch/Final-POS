'use client';

import { useEffect, useState } from 'react';
import { Settings, User, Palette, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [businessName, setBusinessName] = useState('POS Inc.');
  const [ownerName, setOwnerName] = useState('John Doe');
  const [email, setEmail] = useState('admin@pos.com');
  const [password, setPassword] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    const savedEmailNotify = localStorage.getItem('emailNotifications') === 'true';
    setDarkMode(savedDark);
    setEmailNotifications(savedEmailNotify);

    if (savedDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

  const handleSave = () => {
    localStorage.setItem('emailNotifications', String(emailNotifications));
    localStorage.setItem('darkMode', String(darkMode));
    setSaveMessage('✅ Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-black dark:text-white flex items-center gap-2">
            <Settings className="w-7 h-7" />
            Settings
          </h1>
        </div>

        {/* General Settings */}
        <section className="bg-gray-100  rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <User size={20} />
            General
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block mb-1 font-medium">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#DCD0FF]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#DCD0FF]"
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-gray-100 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Palette size={20} />
            Preferences
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Enable Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:bg-[#DCD0FF]"></div>
                <span className="ml-2 text-xs">{darkMode ? 'On' : 'Off'}</span>
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
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:bg-[#DCD0FF]"></div>
                <span className="ml-2 text-xs">{emailNotifications ? 'On' : 'Off'}</span>
              </label>
            </div>
          </div>
        </section>

        {/* Account Security */}
        <section className="bg-gray-100 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Lock size={20} />
            Account & Security
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#DCD0FF]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#DCD0FF]"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="text-right">
          <button
            onClick={handleSave}
            className="bg-[#DCD0FF] hover:bg-[#c8b8ff] text-black px-6 py-2 text-sm font-semibold rounded shadow transition"
          >
            Save Changes
          </button>
          {saveMessage && <p className="mt-2 text-green-600 text-sm">{saveMessage}</p>}
        </div>
      </div>
    </div>
  );
}
