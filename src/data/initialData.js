// Helper to format timestamps consistently (HH:MM:SS)
export const formatTime = (date = new Date()) => {
  return date.toTimeString().split(' ')[0];
};

// Generate a realistic Kubernetes Pod ID (e.g. kubepulse-7d84b6f89-8w2zk)
export const generatePodId = () => {
  const hash = Math.random().toString(36).substring(2, 11);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `kubepulse-${hash}-${suffix}`;
};

// Cached instance ID for this session (simulating container hostname)
const cachedInstanceId = generatePodId();

export const getAppConfig = () => {
  const runtimeConfig = (typeof window !== 'undefined' && window.__CONFIG__) || {};
  return {
    appName: runtimeConfig.APP_NAME || import.meta.env.VITE_APP_NAME || 'KubePulse',
    appVersion: runtimeConfig.APP_VERSION || import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: runtimeConfig.ENVIRONMENT || import.meta.env.VITE_ENVIRONMENT || 'development',
    region: runtimeConfig.REGION || import.meta.env.VITE_REGION || 'local',
    containerId: runtimeConfig.POD_NAME || runtimeConfig.CONTAINER_ID || cachedInstanceId,
  };
};

export const getInitialMetrics = () => ({
  status: 'Running',
  requests: 1248,
  cpuUsage: 14,
  memoryUsage: 28,
  memoryMb: 36,
});

export const getInitialEvents = () => {
  const now = new Date();
  const t = (offsetSeconds) => {
    const d = new Date(now.getTime() - offsetSeconds * 1000);
    return formatTime(d);
  };

  return [
    {
      id: 1,
      timestamp: t(45),
      type: 'INFO',
      message: 'Application started - KubePulse dashboard initialized',
    },
    {
      id: 2,
      timestamp: t(32),
      type: 'INFO',
      message: 'Configuration loaded from environment variables',
    },
    {
      id: 3,
      timestamp: t(20),
      type: 'SUCCESS',
      message: 'Health check passed (GET /health -> 200 OK)',
    },
    {
      id: 4,
      timestamp: t(10),
      type: 'INFO',
      message: 'HTTP request received - GET / HTTP/1.1 (200 OK)',
    },
    {
      id: 5,
      timestamp: t(3),
      type: 'WARN',
      message: 'Container restarted (simulated previous crash loop recovery)',
    },
  ];
};
