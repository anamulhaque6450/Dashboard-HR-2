import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Layout/Header';
import Overview from './components/Dashboard/Overview';
import Employees from './components/Dashboard/Employees';
import Performance from './components/Dashboard/Performance';
import Attendance from './components/Dashboard/Attendance';
import Payroll from './components/Dashboard/Payroll';
import Recruitment from './components/Dashboard/Recruitment';
import Training from './components/Dashboard/Training';
import Notifications from './components/Dashboard/Notifications';

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview setActiveSection={setActiveSection} />;
      case 'employees':
        return <Employees />;
      case 'performance':
        return <Performance />;
      case 'attendance':
        return <Attendance />;
      case 'payroll':
        return <Payroll />;
      case 'recruitment':
        return <Recruitment />;
      case 'training':
        return <Training />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`flex min-h-screen bg-gray-50 transition-all duration-300 ${
      sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
    }`}>
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <Header sidebarOpen={sidebarOpen} />
        
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto pt-16">
          <div className="p-4 sm:p-6 lg:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;