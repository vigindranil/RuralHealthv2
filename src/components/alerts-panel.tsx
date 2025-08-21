"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"
import { Badge } from "../components/badge"
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, User, MapPin } from "lucide-react"

// Update alerts with actual locations from the master record

const alerts = [
  {
    id: 1,
    severity: "critical",
    title: "Malnourished Children Spike",
    description: "Maynaguri Block shows 45% increase in malnourished children cases this month",
    area: "Maynaguri Block → Amguri GP",
    value: "38 cases",
    threshold: "25 cases",
    timestamp: "2025-08-16 09:30",
    assignedTo: "Dr. Sunita Ghosh",
    status: "active",
  },
  {
    id: 2,
    severity: "warning",
    title: "No Immunization Threshold Breach",
    description: "Jalpaiguri Block has exceeded the monthly threshold for unimmunized children",
    area: "Jalpaiguri Block → Kharia GP",
    value: "22 cases",
    threshold: "18 cases",
    timestamp: "2025-08-15 14:20",
    assignedTo: "ANM Ruma Das",
    status: "acknowledged",
  },
  {
    id: 3,
    severity: "critical",
    title: "Multiple Teenage Pregnancies",
    description: "Unusual spike in teenage pregnancy reports in Rajganj Block",
    area: "Rajganj Block → Dabgram–I GP",
    value: "12 cases",
    threshold: "8 cases",
    timestamp: "2025-08-14 11:45",
    assignedTo: "Social Worker Mamata Roy",
    status: "active",
  },
  {
    id: 4,
    severity: "info",
    title: "Immunization Drive Success",
    description: "Kranti Block achieved 94% immunization coverage this month",
    area: "Kranti Block → Lataguri GP",
    value: "94%",
    threshold: "85%",
    timestamp: "2025-08-13 16:00",
    assignedTo: "CHO Bijoy Sarkar",
    status: "resolved",
  },
  {
    id: 5,
    severity: "warning",
    title: "High Malnutrition in Forest Areas",
    description: "Mantadari & Junglee Mohal Forest Area showing concerning malnutrition rates",
    area: "Rajganj Block → Mantadari & Junglee Mohal Forest Area GP",
    value: "15 cases",
    threshold: "10 cases",
    timestamp: "2025-08-12 10:15",
    assignedTo: "Field Worker Tapan Das",
    status: "active",
  },
]

export function AlertsPanel() {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Info
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "acknowledged":
        return <Badge variant="secondary">Acknowledged</Badge>
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-gray-200/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Active Alerts & Monitoring
            </CardTitle>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Badge variant="destructive">2 Critical</Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                2 Warning
              </Badge>
              <Button variant="outline" size="sm" className="bg-white/80 border-gray-200/50 text-sm">
                Configure Thresholds
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3 bg-white/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3 flex-grow">
                    {getSeverityIcon(alert.severity)}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="font-semibold">{alert.title}</h4>
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                      </div>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <div className="flex flex-wrap items-center space-x-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{alert.area}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{alert.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right space-y-1 flex-shrink-0">
                    <div className="text-sm font-medium">
                      Value: <span className="text-red-600">{alert.value}</span>
                    </div>
                    <div className="text-xs text-gray-500">Threshold: {alert.threshold}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    {alert.status === "active" && (
                      <>
                        <Button variant="outline" size="sm" className="bg-white/80 border-gray-200/50 text-sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white/80 border-gray-200/50 text-sm">
                          <User className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </>
                    )}
                    {alert.status === "acknowledged" && (
                      <Button variant="outline" size="sm" className="bg-white/80 border-gray-200/50 text-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                    {alert.status === "resolved" && (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-lg">Alert Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Malnourished Children</h4>
                <p className="text-sm text-gray-600">Alert when GP exceeds 25 cases/month</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Threshold:</span>
                  <Badge variant="outline">25 cases</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">No Immunization</h4>
                <p className="text-sm text-gray-600">Alert when GP exceeds 15 cases/month</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Threshold:</span>
                  <Badge variant="outline">15 cases</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Teenage Pregnancies</h4>
                <p className="text-sm text-gray-600">Alert when GP exceeds 5 cases/month</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Threshold:</span>
                  <Badge variant="outline">5 cases</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Severely Underweight</h4>
                <p className="text-sm text-gray-600">Alert when GP exceeds 8 cases/month</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Threshold:</span>
                  <Badge variant="outline">8 cases</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
