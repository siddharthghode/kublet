import React from 'react';
import OverviewCards from '../components/OverviewCards';
import ContainerInfo from '../components/ContainerInfo';
import EventLog from '../components/EventLog';

export default function Dashboard({ metrics, config, events, onRefresh, isRefreshing, navigate }) {
  return (
    <div>
      {/* Overview Cards (Status, Requests, CPU, Memory) */}
      <OverviewCards metrics={metrics} />

      {/* Container Information (App Name, Env, Version, Instance ID, Region) */}
      <ContainerInfo config={config} />

      {/* Activity and Event Log */}
      <EventLog events={events} />
    </div>
  );
}
