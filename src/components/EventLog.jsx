import React from 'react';

export default function EventLog({ events }) {
  const getBadgeClass = (type) => {
    switch (type) {
      case 'SUCCESS':
        return 'event-badge badge-success';
      case 'WARN':
        return 'event-badge badge-warn';
      case 'INFO':
      default:
        return 'event-badge badge-info';
    }
  };

  return (
    <section aria-label="Activity and Event Log">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          Activity & Event Log
        </h2>
        <span className="section-subtitle">
          {events.length} event{events.length === 1 ? '' : 's'} recorded
        </span>
      </div>

      <div className="event-log-card">
        <div className="event-list">
          {events.map((evt) => (
            <div key={evt.id} className="event-row">
              <span className="event-time">[{evt.timestamp}]</span>
              <span className={getBadgeClass(evt.type)}>{evt.type}</span>
              <span className="event-msg">{evt.message}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
