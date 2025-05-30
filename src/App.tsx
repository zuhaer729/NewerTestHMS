import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import RoomsPage from './pages/RoomsPage';
import GuestsPage from './pages/GuestsPage';
import BookingsPage from './pages/BookingsPage';
import OverviewPage from './pages/OverviewPage';
import RequestsPage from './pages/RequestsPage';
import { TabType } from './types';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('rooms');
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'rooms':
        return <RoomsPage />;
      case 'guests':
        return <GuestsPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'requests':
        return <RequestsPage />;
      case 'overview':
        return <OverviewPage />;
      default:
        return <RoomsPage />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;