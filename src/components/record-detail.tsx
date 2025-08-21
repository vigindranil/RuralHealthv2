"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"
import { Badge } from "../components/badge"
import { Textarea } from "../components/textarea"
import { Separator } from "../components/separator"
import { X, Phone, MessageSquare, Calendar, CheckCircle, User, FileText, Edit } from "lucide-react"

interface RecordDetailProps {
  record: any
  onClose: () => void
}

export function RecordDetail({ record, onClose }: RecordDetailProps) {
  return (
    <div className="h-full flex flex-col bg-white/90">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Record Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {/* <X className="h-4 w-4" /> */}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Information */}
        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium">{record.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Age:</span>
                <p className="font-medium">{record.age}</p>
              </div>
              <div>
                <span className="text-gray-500">Father/Husband:</span>
                <p className="font-medium">{record.fatherName || record.husbandName}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <p className="font-medium">{record.phone}</p>
              </div>
              <div>
                <span className="text-gray-500">Village:</span>
                <p className="font-medium">{record.village}</p>
              </div>
              <div>
                <span className="text-gray-500">GP:</span>
                <p className="font-medium">{record.gp}</p>
              </div>
              <div>
                <span className="text-gray-500">Block:</span>
                <p className="font-medium">{record.block}</p>
              </div>
              <div>
                <span className="text-gray-500">ICDS Center:</span>
                <p className="font-medium">{record.icdsCenter}</p>
              </div>
              <div>
                <span className="text-gray-500">Health Center:</span>
                <p className="font-medium">{record.healthCenter}</p>
              </div>
            </div>
            {record.weight && (
              <div className="pt-2 border-t">
                <span className="text-gray-500">Current Weight:</span>
                <p className="font-medium text-lg">{record.weight}</p>
              </div>
            )}
            {record.reason && (
              <div className="pt-2 border-t">
                <span className="text-gray-500">Reason:</span>
                <p className="font-medium">{record.reason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status & Actions */}
        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base">Status & Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Status:</span>
              <Badge variant={record.status === "Active" ? "destructive" : "secondary"}>{record.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Last Contact:</span>
              <span className="text-sm font-medium">{record.lastContact}</span>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full bg-white/80 border-gray-200/50">
                <Phone className="h-3 w-3 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-white/80 border-gray-200/50">
                <MessageSquare className="h-3 w-3 mr-2" />
                SMS
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-white/80 border-gray-200/50">
                <Calendar className="h-3 w-3 mr-2" />
                Schedule Visit
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-white/80 border-gray-200/50">
                <CheckCircle className="h-3 w-3 mr-2" />
                Mark Follow-up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History & Notes */}
        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base">History & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Initial Assessment</span>
                    <span className="text-gray-500">2025-08-10</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Child identified as malnourished during routine screening. Weight: {record.weight || "10kg"} (below
                    normal for age).
                  </p>
                  <span className="text-xs text-gray-500">by ANM Priya Sharma</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Follow-up Call</span>
                    <span className="text-gray-500">2025-08-12</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Contacted family. Mother agreed to bring child for nutrition counseling.
                  </p>
                  <span className="text-xs text-gray-500">by CHO Rajesh Kumar</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Home Visit Scheduled</span>
                    <span className="text-gray-500">2025-08-15</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Scheduled home visit for nutrition assessment and family counseling.
                  </p>
                  <span className="text-xs text-gray-500">by ANM Meera Devi</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Add Note:</label>
              <Textarea
                placeholder="Enter follow-up notes, observations, or action items..."
                className="min-h-[80px] bg-white/80 border-gray-200/50"
              />
              <Button size="sm" className="w-full">
                <Edit className="h-3 w-3 mr-2" />
                Save Note
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base">Attachments & Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded bg-white/50">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Growth Chart - Aug 2025</span>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 border rounded bg-white/50">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Medical Assessment</span>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2 bg-white/80 border-gray-200/50">
                Upload Document
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base">Case Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Assigned to:</span>
              <span className="text-sm font-medium">ANM Priya Sharma</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Priority:</span>
              <Badge variant="destructive">High</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Next Follow-up:</span>
              <span className="text-sm font-medium">2025-08-20</span>
            </div>
            <Button variant="outline" size="sm" className="w-full bg-white/80 border-gray-200/50">
              <User className="h-3 w-3 mr-2" />
              Reassign Case
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as Resolved
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="bg-white/80 border-gray-200/50">
            <Calendar className="h-3 w-3 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="bg-white/80 border-gray-200/50">
            <FileText className="h-3 w-3 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  )
}
