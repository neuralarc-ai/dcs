'use client';

import { useState } from 'react';
import { 
  RiLayoutGridLine, 
  RiInboxArchiveLine, 
  RiSettings4Line, 
  RiLogoutBoxLine,
  RiShieldUserLine
} from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import IncomingRequestsTable from './IncomingRequestsTable';

import AdminTendersTable from './AdminTendersTable';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('incoming');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
              <RiShieldUserLine className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">NeuralArc Admin</h2>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Internal Portal</p>
            </div>
          </div>
          
          <Button 
            onClick={onLogout} 
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:text-white"
          >
            <RiLogoutBoxLine className="mr-2" size={18} />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0">
          <nav className="space-y-1 sticky top-24">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'incoming' 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <RiInboxArchiveLine size={20} />
              Incoming Requests
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'active' 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <RiLayoutGridLine size={20} />
              Active Projects
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'settings' 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <RiSettings4Line size={20} />
              Settings
            </button>
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="flex-1">
          {activeTab === 'incoming' && <IncomingRequestsTable />}
          
          {activeTab === 'active' && <AdminTendersTable />}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
              System settings coming soon...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

