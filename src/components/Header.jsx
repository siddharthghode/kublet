import React from 'react';

export default function Header({ currentPath, navigate, onRefresh, isRefreshing }) {
  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand */}
        <div 
          className="brand-section" 
          onClick={() => navigate('/')} 
          role="button" 
          tabIndex={0}
          title="Back to KubePulse Dashboard"
        >
          <div className="brand-logo-wrapper">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <polygon points="50,12 85,32 85,68 50,88 15,68 15,32" stroke="#326ce5" strokeWidth="8" fill="#1e293b"/>
              <path d="M26 50 H40 L45 36 L52 64 L58 44 L62 50 H74" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="52" cy="64" r="4" fill="#10b981"/>
            </svg>
          </div>
          <div className="brand-titles">
            <span className="brand-name">KubePulse</span>
            <span className="brand-subtitle">Kubernetes Learning Dashboard</span>
          </div>
        </div>

        {/* Status Indicator & Navigation Actions */}
        <div className="header-actions">
          {/* Status Indicator showing "Healthy" */}
          <div className="status-pill" title="Liveness & Readiness probe status">
            <span className="pulse-dot"></span>
            <span>Healthy</span>
          </div>

          {/* Navigation link to Dashboard */}
          <button
            type="button"
            className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Dashboard
          </button>

          {/* Navigation link to /health */}
          <button
            type="button"
            className={`nav-link ${currentPath === '/health' ? 'active' : ''}`}
            onClick={() => navigate('/health')}
          >
            /health
          </button>

          {/* Global Refresh Button */}
          {currentPath === '/' && (
            <button
              type="button"
              className="btn-primary"
              onClick={onRefresh}
              title="Update metrics, increment requests, and log event"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ 
                  animation: isRefreshing ? 'spin 0.6s linear infinite' : 'none',
                  transition: 'transform 0.2s ease'
                }}
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
