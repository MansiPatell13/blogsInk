"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle, AlertCircle, Clock, Server, Database, Globe } from "lucide-react"
import { authService } from "@/lib/auth"

export default function StatusPage() {
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const services = [
    {
      name: "Web Application",
      status: "operational",
      uptime: "99.9%",
      responseTime: "120ms",
      icon: Globe,
    },
    {
      name: "API Services",
      status: "operational",
      uptime: "99.8%",
      responseTime: "85ms",
      icon: Server,
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.9%",
      responseTime: "45ms",
      icon: Database,
    },
    {
      name: "File Storage",
      status: "operational",
      uptime: "99.7%",
      responseTime: "200ms",
      icon: Server,
    },
  ]

  const incidents = [
    {
      date: "2024-01-15",
      title: "Brief API slowdown resolved",
      status: "resolved",
      description: "API response times were elevated for approximately 15 minutes. Issue has been resolved.",
    },
    {
      date: "2024-01-10",
      title: "Scheduled maintenance completed",
      status: "resolved",
      description: "Routine database maintenance completed successfully with no user impact.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "outage":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return CheckCircle
      case "degraded":
        return AlertCircle
      case "outage":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>
      case "outage":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Outage</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />}

      <main className={`transition-all duration-300 ${user ? (sidebarCollapsed ? "ml-16" : "ml-64") : ""} p-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Activity className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
            <p className="text-lg text-gray-600">Current status of BlogSink services and infrastructure</p>
          </div>

          {/* Overall Status */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">All Systems Operational</h2>
                <p className="text-gray-600">All services are running normally</p>
                <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => {
                  const StatusIcon = getStatusIcon(service.status)
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <service.icon className="h-6 w-6 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Uptime: {service.uptime}</span>
                            <span>Response: {service.responseTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                        {getStatusBadge(service.status)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              {incidents.length > 0 ? (
                <div className="space-y-4">
                  {incidents.map((incident, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{incident.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
                          <span className="text-sm text-gray-500">{incident.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{incident.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No recent incidents to report</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Overall Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">95ms</div>
                  <div className="text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                  <div className="text-gray-600">Major Incidents</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
