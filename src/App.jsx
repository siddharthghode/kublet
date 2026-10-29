import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import {
  getAppConfig,
  getInitialMetrics,
  getInitialEvents,
  formatTime,
} from './data/initialData';

export default function App() {
  // Simple zero-dependency client router
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname || '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Application State
  const [config] = useState(getAppConfig);
  const [metrics, setMetrics] = useState(getInitialMetrics);
  const [events, setEvents] = useState(getInitialEvents);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh handler: updates metrics, appends a new event, increments requests
  const handleRefresh = () => {
    setIsRefreshing(true);

    const randomDeltaRequests = Math.floor(Math.random() * 20) + 5;
    const newRequests = metrics.requests + randomDeltaRequests;
    const newCpu = Math.floor(Math.random() * 35) + 12; // 12% - 46%
    const newMem = Math.floor(Math.random() * 30) + 25; // 25% - 54%
    const newMb = Math.round((newMem / 100) * 128);

    setMetrics({
      status: 'Running',
      requests: newRequests,
      cpuUsage: newCpu,
      memoryUsage: newMem,
      memoryMb: newMb,
    });

    const newEvent = {
      id: Date.now(),
      timestamp: formatTime(new Date()),
      type: 'INFO',
      message: `Metrics updated - CPU: ${newCpu}%, Mem: ${newMem}% (${newMb} MiB), Requests: ${newRequests.toLocaleString()} (+${randomDeltaRequests})`,
    };

    setEvents((prev) => [newEvent, ...prev.slice(0, 19)]); // Keep latest 20 events

    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        currentPath={currentPath}
        navigate={navigate}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Body View */}
      <main className="main-content">
        {currentPath === '/health' ? (
          <Health navigate={navigate} />
        ) : (
          <Dashboard
            metrics={metrics}
            config={config}
            events={events}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            navigate={navigate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          <strong>KubePulse</strong> v{config.appVersion} &bull; Environment:{' '}
          <code>{config.environment}</code> &bull; Region:{' '}
          <code>{config.region}</code> &bull; Offline Ready
        </p>
      </footer>
    </div>
  );
}
