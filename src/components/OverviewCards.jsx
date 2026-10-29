import React from 'react';

export default function OverviewCards({ metrics }) {
  return (
    <section aria-label="Application Overview">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          </svg>
          Overview Metrics
        </h2>
        <span className="section-subtitle">Real-time container indicators</span>
      </div>

      <div className="cards-grid">
        {/* Card 1: Application Status */}
        <div className="metric-card">
          <div className="card-top">
            <span className="card-label">Application Status</span>
            <div className="card-icon" style={{ color: 'var(--status-green)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="card-badge-running">
            <span className="pulse-dot"></span>
            <span>{metrics.status}</span>
          </div>
          <span className="card-meta">Ready to accept ingress traffic</span>
        </div>

        {/* Card 2: Requests */}
        <div className="metric-card">
          <div className="card-top">
            <span className="card-label">HTTP Requests</span>
            <div className="card-icon" style={{ color: '#38bdf8' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="card-value">
            {metrics.requests.toLocaleString()}
          </div>
          <span className="card-meta">Total incoming HTTP requests handled</span>
        </div>

        {/* Card 3: CPU Usage */}
        <div className="metric-card">
          <div className="card-top">
            <span className="card-label">CPU Usage</span>
            <div className="card-icon" style={{ color: '#60a5fa' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
            </div>
          </div>
          <div className="card-value">{metrics.cpuUsage}%</div>
          <div className="card-progress-bar">
            <div
              className="card-progress-fill card-progress-cpu"
              style={{ width: `${Math.min(metrics.cpuUsage, 100)}%` }}
            ></div>
          </div>
          <span className="card-meta">Target limit: 500m (0.5 vCPU)</span>
        </div>

        {/* Card 4: Memory Usage */}
        <div className="metric-card">
          <div className="card-top">
            <span className="card-label">Memory Usage</span>
            <div className="card-icon" style={{ color: '#c084fc' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 19v-3"></path>
                <path d="M10 19v-3"></path>
                <path d="M14 19v-3"></path>
                <path d="M18 19v-3"></path>
                <path d="M6 5v3"></path>
                <path d="M10 5v3"></path>
                <path d="M14 5v3"></path>
                <path d="M18 5v3"></path>
                <rect x="2" y="8" width="20" height="8" rx="1"></rect>
              </svg>
            </div>
          </div>
          <div className="card-value">{metrics.memoryUsage}%</div>
          <div className="card-progress-bar">
            <div
              className="card-progress-fill card-progress-memory"
              style={{ width: `${Math.min(metrics.memoryUsage, 100)}%` }}
            ></div>
          </div>
          <span className="card-meta">
            Allocated: {metrics.memoryMb} MiB / 128 MiB limit
          </span>
        </div>
      </div>
    </section>
  );
}
