import React from 'react';
import { BedDouble, Users, Calendar, LayoutDashboard, AlertCircle } from 'lucide-react';
import { TabType } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useBookingStore } from '../../store/useBookingStore';

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const { getCurrentUserRole } = useAuthStore();
  const { getPendingCancellationRequests } = useBookingStore();
  
  const isAdmin = getCurrentUserRole() === 'admin';
  const pendingRequests = getPendingCancellationRequests();
  
  const tabs: { id: TabType; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    {
      id: 'rooms',
      label: 'Rooms',
      icon: <BedDouble className="w-5 h-5" />,
    },
    {
      id: 'guests',
      label: 'Guests',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'requests',
      label: 'Requests',
      icon: <AlertCircle className="w-5 h-5" />,
      adminOnly: true,
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center" aria-label="Tabs">
          {/* Left-aligned tabs */}
          <div className="flex space-x-4">
            {visibleTabs
              .filter((tab) => tab.id !== 'overview' && tab.id !== 'requests')
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
          </div>
  
          {/* Right-aligned tabs */}
          <div className="flex space-x-4">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'requests'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === 'requests' ? 'page' : undefined}
              >
                {tabs.find(t => t.id === 'requests')?.icon}
                <span className="hidden md:inline">Requests</span>
                {pendingRequests.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === 'overview' ? 'page' : undefined}
            >
              {tabs.find(t => t.id === 'overview')?.icon}
              <span className="hidden md:inline">Overview</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Tabs;