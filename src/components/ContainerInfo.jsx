import React from 'react';

export default function ContainerInfo({ config }) {
  return (
    <section aria-label="Container Information">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Container Information
        </h2>
        <span className="section-subtitle">Environment & Pod metadata</span>
      </div>

      <div className="container-info-card">
        <div className="info-grid">
          {/* Application Name */}
          <div className="info-item">
            <span className="info-item-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Application Name
            </span>
            <span className="info-item-value">{config.appName}</span>
          </div>

          {/* Environment */}
          <div className="info-item">
            <span className="info-item-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Environment
            </span>
            <div className="info-item-value">
              <span className="badge-env">{config.environment}</span>
            </div>
          </div>

          {/* Version */}
          <div className="info-item">
            <span className="info-item-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              Version
            </span>
            <span className="info-item-value">v{config.appVersion}</span>
          </div>

          {/* Region */}
          <div className="info-item">
            <span className="info-item-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Region / Zone
            </span>
            <span className="info-item-value">{config.region}</span>
          </div>

          {/* Container / Instance ID */}
          <div className="info-item" style={{ gridColumn: '1 / -1' }}>
            <span className="info-item-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              Container / Pod Instance ID
            </span>
            <span className="info-item-value" title="Simulated Pod hostname">
              {config.containerId}
            </span>
          </div>
        </div>

        {/* Kubernetes Architecture Context Note */}
        <div className="k8s-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div>
            <strong>Kubernetes Concept Mapping:</strong> These configuration parameters are supplied via environment variables (<code>VITE_APP_NAME</code>, <code>VITE_ENVIRONMENT</code>, <code>VITE_VERSION</code>, <code>VITE_REGION</code>). In Kubernetes, these will be injected using a <strong>ConfigMap</strong> or <strong>Secret</strong> into the Pod specification.
          </div>
        </div>
      </div>
    </section>
  );
}
