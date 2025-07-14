import React from 'react';
import { useSupabaseUsage } from '../hooks/useSupabaseUsage';
import { 
  Activity, 
  Database, 
  Users, 
  Server, 
  HardDrive, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  FileText
} from 'lucide-react';

export function Usage() {
  const {
    usageData,
    planInfo,
    loading,
    error,
    lastUpdated,
    refreshUsage,
    getUsagePercentage,
    getUsageColor,
    formatNumber,
    getUsageStatus
  } = useSupabaseUsage();

  // Show error message if there's an error
  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Usage Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={refreshUsage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const UsageCard = ({ title, icon: Icon, children, status = 'normal' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            status === 'warning' ? 'bg-yellow-100' : 
            status === 'danger' ? 'bg-red-100' : 
            'bg-blue-100'
          }`}>
            <Icon className={`w-5 h-5 ${
              status === 'warning' ? 'text-yellow-600' : 
              status === 'danger' ? 'text-red-600' : 
              'text-blue-600'
            }`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
        {status === 'danger' && <AlertCircle className="w-5 h-5 text-red-500" />}
        {status === 'normal' && <CheckCircle className="w-5 h-5 text-green-500" />}
      </div>
      {children}
    </div>
  );

  const ProgressBar = ({ value, max, label, color }) => {
    const percentage = getUsagePercentage(value, max);
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="text-gray-900 font-medium">
            {formatNumber(value)} / {formatNumber(max)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color || getUsageColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500">
          {percentage.toFixed(1)}% used
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading usage data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Usage Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your personal plan usage and limits</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button 
            onClick={refreshUsage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Database Usage */}
        <UsageCard 
          title="Database" 
          icon={Database}
          status={getUsagePercentage(usageData.database.size, usageData.database.maxSize) > 80 ? 'warning' : 'normal'}
        >
          <div className="space-y-4">
            <ProgressBar 
              value={usageData.database.size} 
              max={usageData.database.maxSize}
              label="Storage Used (MB)"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tables</span>
                <p className="text-xl font-semibold text-gray-900">{usageData.database.tables}</p>
              </div>
              <div>
                <span className="text-gray-600">Rows</span>
                <p className="text-xl font-semibold text-gray-900">{formatNumber(usageData.database.rows)}</p>
              </div>
            </div>
          </div>
        </UsageCard>

        {/* Account Status */}
        <UsageCard 
          title="Account Status" 
          icon={Users}
          status="normal"
        >
          <div className="space-y-4">
            <div className="text-sm">
              <span className="text-gray-600">Account Status</span>
              <p className="text-xl font-semibold text-green-600">Active</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Monthly Sessions</span>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(usageData.auth.monthlyActiveUsers)}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Plan Limit</span>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(usageData.auth.maxUsers)} users</p>
            </div>
          </div>
        </UsageCard>

        {/* Storage Usage */}
        <UsageCard 
          title="Storage" 
          icon={HardDrive}
          status={getUsagePercentage(usageData.storage.used, usageData.storage.total) > 80 ? 'warning' : 'normal'}
        >
          <div className="space-y-4">
            <ProgressBar 
              value={usageData.storage.used} 
              max={usageData.storage.total}
              label="Storage Used (MB)"
            />
            <div className="text-sm">
              <span className="text-gray-600">Files</span>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(usageData.storage.files)}</p>
            </div>
          </div>
        </UsageCard>

        {/* API Usage */}
        <UsageCard 
          title="API Requests" 
          icon={Server}
          status={getUsagePercentage(usageData.api.requests, usageData.api.maxRequests) > 80 ? 'warning' : 'normal'}
        >
          <div className="space-y-4">
            <ProgressBar 
              value={usageData.api.requests} 
              max={usageData.api.maxRequests}
              label="Requests This Month"
            />
            <div className="text-sm">
              <span className="text-gray-600">Remaining</span>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(usageData.api.remainingRequests)}</p>
            </div>
          </div>
        </UsageCard>

        {/* Realtime Usage */}
        <UsageCard 
          title="Realtime" 
          icon={Activity}
          status={getUsagePercentage(usageData.realtime.connections, usageData.realtime.maxConnections) > 80 ? 'warning' : 'normal'}
        >
          <div className="space-y-4">
            <ProgressBar 
              value={usageData.realtime.connections} 
              max={usageData.realtime.maxConnections}
              label="Concurrent Connections"
            />
            <div className="text-sm">
              <span className="text-gray-600">Messages This Month</span>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(usageData.realtime.messagesPerMonth)}</p>
            </div>
          </div>
        </UsageCard>

        {/* Plan Information */}
        <UsageCard title="My Plan" icon={FileText}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Plan</span>
              <span className="font-medium text-gray-900">{planInfo.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Period</span>
              <span className="font-medium text-gray-900">{planInfo.planType}</span>
            </div>
            {planInfo.expiresAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Expires</span>
                <span className="font-medium text-gray-900">
                  {new Date(planInfo.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage Plan
            </button>
          </div>
        </UsageCard>
      </div>

      {/* My Usage Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">My Usage Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Database className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Database</p>
            <p className="text-lg font-semibold text-gray-900">{getUsagePercentage(usageData.database.size, usageData.database.maxSize).toFixed(1)}%</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <HardDrive className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Storage</p>
            <p className="text-lg font-semibold text-gray-900">{getUsagePercentage(usageData.storage.used, usageData.storage.total).toFixed(1)}%</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Server className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">API Requests</p>
            <p className="text-lg font-semibold text-gray-900">{getUsagePercentage(usageData.api.requests, usageData.api.maxRequests).toFixed(1)}%</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Activity className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Realtime</p>
            <p className="text-lg font-semibold text-gray-900">{getUsagePercentage(usageData.realtime.connections, usageData.realtime.maxConnections).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
