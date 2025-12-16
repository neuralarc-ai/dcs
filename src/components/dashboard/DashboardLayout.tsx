'use client';

import { 
  RiFolderOpenLine, 
  RiFileCheckLine, 
  RiUploadCloudLine, 
  RiMessage3Line, 
  RiLogoutBoxLine,
  RiFileTextLine
} from 'react-icons/ri';
import { Button } from '../ui/Button';

interface DashboardLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardLayout({ 
  onLogout, 
  children, 
  activeTab, 
  onTabChange 
}: DashboardLayoutProps) {
  const tabs = [
    { id: 'tenders', label: 'Active Tenders', icon: RiFolderOpenLine },
    { id: 'submitted', label: 'Submitted Tenders', icon: RiFileCheckLine },
    { id: 'submit', label: 'Submit Requirements', icon: RiUploadCloudLine },
    { id: 'contact', label: 'Contact Us', icon: RiMessage3Line },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-md">
              <RiFileTextLine className="text-white w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 hidden sm:block">DCS Tender Portal</h2>
          </div>
          
          <Button variant="ghost" onClick={onLogout} className="border border-gray-200">
            <RiLogoutBoxLine size={18} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* Tabs */}
        <nav className="flex space-x-1 overflow-x-auto border-b border-gray-200 mb-8 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap mb-[-2px]
                  ${isActive 
                    ? 'border-green-500 text-green-700 bg-green-50/50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-green-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <main className="animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

