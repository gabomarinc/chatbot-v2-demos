import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AgentsScreen } from './components/screens/AgentsScreen';
import { AgentDetailScreen } from './components/screens/AgentDetailScreen';
import { TeamScreen } from './components/screens/TeamScreen';
import { ChannelsScreen } from './components/screens/ChannelsScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { BillingScreen } from './components/screens/BillingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const renderScreen = () => {
    if (selectedAgent) {
      return <AgentDetailScreen onBack={() => setSelectedAgent(null)} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'agents':
        return <AgentsScreen onSelectAgent={(id) => setSelectedAgent(id)} />;
      case 'team':
        return <TeamScreen />;
      case 'channels':
        return <ChannelsScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'billing':
        return <BillingScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
