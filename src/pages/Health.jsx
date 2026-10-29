import React, { useState } from 'react';

export default function Health({ navigate }) {
  const [copied, setCopied] = useState(false);

  const healthPayload = {
    status: 'healthy',
  };

  const jsonString = JSON.stringify(healthPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="health-page">
      <div className="health-card">
        <div className="health-header">
          <div>
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Health Check Route (<code>/health</code>)
            </h2>
            <span className="section-subtitle">
              Simulated health probe endpoint for Kubernetes kubelet
            </span>
          </div>
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span>200 OK</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Response Body (<code>application/json</code>):
        </p>

        {/* Displays the required JSON payload */}
        <pre className="json-display">
          <code>{jsonString}</code>
        </pre>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={handleCopy}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
          </button>

          <button type="button" className="btn-primary" onClick={() => navigate('/')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="health-info-box">
          <strong>Kubernetes Probe Configuration:</strong>
          <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
            When you configure <code>livenessProbe</code> and <code>readinessProbe</code> in your Kubernetes Pod or Deployment manifest, kubelet periodically issues an HTTP GET to this endpoint. Any HTTP response code between 200 and 399 confirms the pod is alive and ready to receive service traffic.
          </p>
        </div>
      </div>
    </div>
  );
}
