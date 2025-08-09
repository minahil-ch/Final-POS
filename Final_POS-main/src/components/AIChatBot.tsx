'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, MessageCircle, Loader2, Plus, History, Trash2 } from 'lucide-react';
import { usePageContent } from '@/context/PageContentContext';
import { v4 as uuidv4 } from 'uuid';

type Message = { sender: 'user' | 'bot'; text: string; timestamp: string };
type ChatSession = { id: string; title: string; messages: Message[] };

export default function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const { getCombinedContext, scanAllRoutes, scanCurrentPage } = usePageContent();
  const chatRef = useRef<HTMLDivElement>(null);

  const DEFAULT_ROUTES = ['/', '/dashboard', '/products', '/inventory', '/sales', '/customers', '/orders', '/users'];

  // Load saved chats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-chat-history');
    if (saved) {
      const parsed: ChatSession[] = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-chat-history', JSON.stringify(chats));
  }, [chats]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [activeChatId, chats]);

  const currentChat = chats.find(c => c.id === activeChatId);

  const handleScanAll = async () => {
    setLoading(true);
    await scanAllRoutes(DEFAULT_ROUTES);
    await scanCurrentPage();
    setLoading(false);
    alert('✅ Scanned all pages successfully!');
  };

  const handleNewChat = () => {
    const newChat: ChatSession = { id: uuidv4(), title: 'New Chat', messages: [] };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSelectHistory = (id: string) => {
    setActiveChatId(id);
    setShowHistory(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setChats(prev => prev.filter(chat => chat.id !== id));
    if (activeChatId === id) {
     setActiveChatId((prevChats) => {
  if (Array.isArray(prevChats) && prevChats.length > 0) {
    return prevChats[0].id;
  }
  return null;
});

    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString();

    let updatedChats = [...chats];
    const chatIndex = updatedChats.findIndex(c => c.id === activeChatId);
    if (chatIndex === -1) return;

    if (updatedChats[chatIndex].messages.length === 0) {
      updatedChats[chatIndex].title = input.trim().slice(0, 30);
    }

    updatedChats[chatIndex].messages.push({ sender: 'user', text: input, timestamp });
    setChats(updatedChats);
    setInput('');
    setBotTyping(true);

    let context = getCombinedContext();
    if (!context || context.trim().length < 10) {
      await scanAllRoutes(DEFAULT_ROUTES);
      await scanCurrentPage();
      context = getCombinedContext();
    }

    try {
      let answer = '';
      for (let attempt = 0; attempt < 2; attempt++) {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: input, context: context.slice(0, 16000) }),
        });
        const data = await res.json();
        if (data.answer) {
          answer = data.answer;
          break;
        }
      }
      if (!answer) {
        answer = "Sorry, I couldn't find a precise answer based on the scanned pages.";
      }

      updatedChats = [...updatedChats];
      updatedChats[chatIndex].messages.push({
        sender: 'bot',
        text: answer,
        timestamp: new Date().toLocaleTimeString(),
      });
      setChats(updatedChats);
    } catch (err) {
      updatedChats[chatIndex].messages.push({
        sender: 'bot',
        text: "⚠️ I couldn't process your question right now. Please try again after scanning pages.",
        timestamp: new Date().toLocaleTimeString(),
      });
      setChats(updatedChats);
    } finally {
      setBotTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      <div className="relative">
        {/* Main Chat Toggle Button */}
        <button
          onClick={() => setIsOpen(p => !p)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg"
        >
          <MessageCircle size={24} />
        </button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 w-96 bg-white border shadow-xl rounded-lg flex flex-col">
            
            {/* Top bar */}
            <div className="flex justify-between items-center p-2 border-b bg-gray-50 rounded-t-lg">
              <div className="flex gap-2">
                <button onClick={handleNewChat} className="flex items-center gap-1 text-xs bg-blue-100 px-2 py-1 rounded">
                  <Plus size={14}/> New
                </button>
                <button onClick={() => setShowHistory(p => !p)} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                  <History size={14}/> History
                </button>
              </div>
              <button onClick={handleScanAll} className="text-xs px-2 py-1 border rounded text-green-700">
                {loading ? 'Scanning...' : 'Scan All'}
              </button>
            </div>

            {/* History dropdown with delete button */}
            {showHistory && (
              <div className="max-h-32 overflow-y-auto text-xs border-b bg-gray-50">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`flex justify-between items-center cursor-pointer px-2 py-1 hover:bg-gray-100 ${
                      chat.id === activeChatId ? 'bg-blue-100' : ''
                    }`}
                  >
                    <span onClick={() => handleSelectHistory(chat.id)} className="truncate flex-1">
                      {chat.title}
                    </span>
                    <Trash2
                      size={14}
                      onClick={() => handleDeleteHistoryItem(chat.id)}
                      className="text-red-500 cursor-pointer ml-2"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Chat window */}
            <div ref={chatRef} className="flex-1 max-h-80 overflow-y-auto space-y-2 p-2">
              {currentChat?.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded max-w-[80%] ${
                    msg.sender === 'user' ? 'ml-auto bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  {msg.text}
                  <div className="text-xs text-gray-400 mt-1">{msg.timestamp}</div>
                </div>
              ))}
              {botTyping && (
                <div className="p-2 rounded bg-gray-100 w-fit animate-pulse text-xs text-gray-500">
                  Bot is typing...
                </div>
              )}
            </div>

            {/* Input + send button */}
            <div className="flex gap-2 p-2 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Ask something..."
              />
              <button
                onClick={handleSend}
                disabled={botTyping}
                className="p-2 bg-blue-500 rounded text-white disabled:opacity-50"
              >
                {botTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
