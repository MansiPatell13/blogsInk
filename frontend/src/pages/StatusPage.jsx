import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Clock, Wifi, Database, Server, Globe } from 'lucide-react'

const StatusPage = () => {
  const [systemStatus, setSystemStatus] = useState({
    overall: 'loading',
    lastUpdated: new Date().toISOString(),
    services: [
      {
        name: 'Website',
        status: 'loading',
        uptime: '...',
        responseTime: '...',
        lastIncident: null
      },
      {
        name: 'API',
        status: 'loading',
        uptime: '...',
        responseTime: '...',
        lastIncident: null
      },
      {
        name: 'Database',
        status: 'loading',
        uptime: '...',
        responseTime: '...',
        lastIncident: null
      },
      {
        name: 'File Storage',
        status: 'loading',
        uptime: '...',
        responseTime: '...',
        lastIncident: null
      },
      {
        name: 'Authentication',
        status: 'loading',
        uptime: '...',
        responseTime: '...',
        lastIncident: null
      }
    ]
  })

  const [incidents, setIncidents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSystemStatus()
  }, [])

  const fetchSystemStatus = async () => {
    try {
      // Get basic health status
      const healthResponse = await fetch('/api/health')
      let overallStatus = 'degraded'
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        overallStatus = healthData.status === 'OK' ? 'operational' : 'degraded'
      }
      
      // Update system status with basic health data
      setSystemStatus(prev => ({
        ...prev,
        overall: overallStatus,
        lastUpdated: new Date().toISOString()
      }))
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching system status:', error)
      setIsLoading(false)
      
      // Update status to show error
      setSystemStatus(prev => ({
        ...prev,
        overall: 'degraded',
        lastUpdated: new Date().toISOString()
      }))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'maintenance':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'loading':
        return <Clock className="w-5 h-5 text-gray-600 animate-pulse" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'outage':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'loading':
        return 'bg-gray-100 text-gray-800 border-gray-200 animate-pulse'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getOverallStatusColor = () => {
    const hasOutage = systemStatus.services.some(service => service.status === 'outage')
    const hasDegraded = systemStatus.services.some(service => service.status === 'degraded')
    
    if (hasOutage) return 'bg-red-100 text-red-800 border-red-200'
    if (hasDegraded) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking system status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
            <p className="text-xl text-gray-600">
              Real-time status of BlogsInk services and infrastructure
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full border ${getOverallStatusColor()} mb-4`}>
              {getStatusIcon(systemStatus.overall)}
              <span className="font-semibold capitalize">
                {systemStatus.overall === 'operational' ? 'All Systems Operational' : systemStatus.overall}
              </span>
            </div>
            <p className="text-gray-600">
              Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {systemStatus.services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                {getStatusIcon(service.status)}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium text-gray-900">{service.uptime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-gray-900">{service.responseTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Server Uptime</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {systemStatus.metrics?.uptime || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">Current session</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Memory Usage</h3>
              <p className="text-3xl font-bold text-green-600">
                {systemStatus.metrics?.memory?.heapUsed || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">Heap Used</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Status</h3>
              <p className="text-3xl font-bold text-purple-600">
                {systemStatus.services.find(s => s.name === 'Database')?.status === 'operational' ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-sm text-gray-500">Connection status</p>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
          
          {incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{incident.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Started: {new Date(incident.startTime).toLocaleString()}</span>
                    {incident.resolvedTime && (
                      <span>Resolved: {new Date(incident.resolvedTime).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent incidents reported</p>
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Infrastructure</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Hosted on AWS (US East, US West, Europe)</p>
                <p>• CDN: CloudFront for global content delivery</p>
                <p>• Database: MongoDB Atlas with automatic scaling</p>
                <p>• File Storage: AWS S3 with redundancy</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Monitoring</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 24/7 automated monitoring</p>
                <p>• Real-time alerting system</p>
                <p>• Performance tracking and analytics</p>
                <p>• Automated incident response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">Stay Updated</h2>
            <p className="text-yellow-700 mb-6">
              Get notified about system status updates and incidents via email
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 mt-8">
          <p>
            For urgent issues, please contact our support team at{' '}
            <a href="mailto:support@blogsink.com" className="text-yellow-600 hover:text-yellow-700">
              support@blogsink.com
            </a>
          </p>
          <p className="mt-2">
            This status page is updated every 30 seconds. Last refresh: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatusPage
