"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Badge } from "../components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table"
import { Phone, MapPin, Calendar, FileText, CheckCircle, AlertCircle } from "lucide-react"

// Update the data tables with actual village/GP names from the master record

const malnourishedData = [
  {
    id: 1,
    name: "Ruma Das",
    age: "3 years",
    fatherName: "Bijoy Das",
    village: "Kharia",
    gp: "Kharia GP",
    block: "Jalpaiguri Block",
    phone: "9832145678",
    icdsCenter: "ICDS Center Kharia",
    healthCenter: "PHC Kharia",
    weight: "9.5 kg",
    status: "Active",
    lastContact: "2025-08-15",
  },
  {
    id: 2,
    name: "Anita Roy",
    age: "2.5 years",
    fatherName: "Subhas Roy",
    village: "Arabinda",
    gp: "Arabinda GP",
    block: "Jalpaiguri Block",
    phone: "9832145679",
    icdsCenter: "ICDS Center Arabinda",
    healthCenter: "PHC Arabinda",
    weight: "8.2 kg",
    status: "Follow-up",
    lastContact: "2025-08-12",
  },
  {
    id: 3,
    name: "Soham Barman",
    age: "4 years",
    fatherName: "Tapan Barman",
    village: "Amguri",
    gp: "Amguri GP",
    block: "Maynaguri Block",
    phone: "9832145680",
    icdsCenter: "ICDS Center Amguri",
    healthCenter: "PHC Amguri",
    weight: "11.5 kg",
    status: "Resolved",
    lastContact: "2025-08-10",
  },
  {
    id: 4,
    name: "Priya Sarkar",
    age: "3.5 years",
    fatherName: "Ratan Sarkar",
    village: "Dabgram",
    gp: "Dabgram–I GP",
    block: "Rajganj Block",
    phone: "9832145681",
    icdsCenter: "ICDS Center Dabgram",
    healthCenter: "PHC Dabgram",
    weight: "9.8 kg",
    status: "Active",
    lastContact: "2025-08-14",
  },
  {
    id: 5,
    name: "Rahul Ghosh",
    age: "2 years",
    fatherName: "Pradip Ghosh",
    village: "Barogharia",
    gp: "Barogharia GP",
    block: "Dhupguri Block",
    phone: "9832145682",
    icdsCenter: "ICDS Center Barogharia",
    healthCenter: "PHC Barogharia",
    weight: "7.8 kg",
    status: "Follow-up",
    lastContact: "2025-08-13",
  },
  {
    id: 6,
    name: "Sneha Mondal",
    age: "3 years",
    fatherName: "Kartik Mondal",
    village: "Sakoajhora",
    gp: "Sakoajhora–I GP",
    block: "Banarhat Block",
    phone: "9832145683",
    icdsCenter: "ICDS Center Sakoajhora",
    healthCenter: "PHC Sakoajhora",
    weight: "9.2 kg",
    status: "Active",
    lastContact: "2025-08-16",
  },
  {
    id: 7,
    name: "Arjun Saha",
    age: "2.5 years",
    fatherName: "Dilip Saha",
    village: "Bagrakot",
    gp: "Bagrakot GP",
    block: "Mal Block",
    phone: "9832145684",
    icdsCenter: "ICDS Center Bagrakot",
    healthCenter: "PHC Bagrakot",
    weight: "8.5 kg",
    status: "Follow-up",
    lastContact: "2025-08-14",
  },
]

const noImmunizationData = [
  {
    id: 8,
    name: "Ravi Chakraborty",
    age: "1 year",
    fatherName: "Ashok Chakraborty",
    village: "Bidhannagar",
    gp: "Bidhannagar GP",
    block: "Matiali Block",
    phone: "9832145685",
    icdsCenter: "ICDS Center Bidhannagar",
    healthCenter: "PHC Bidhannagar",
    reason: "Parents refused",
    status: "Pending",
    lastContact: "2025-08-14",
  },
  {
    id: 9,
    name: "Kavya Singh",
    age: "8 months",
    fatherName: "Rajesh Singh",
    village: "Champaguri",
    gp: "Champaguri GP",
    block: "Nagrakata Block",
    phone: "9832145686",
    icdsCenter: "ICDS Center Champaguri",
    healthCenter: "PHC Champaguri",
    reason: "Missed appointment",
    status: "Scheduled",
    lastContact: "2025-08-13",
  },
  {
    id: 10,
    name: "Amit Gupta",
    age: "6 months",
    fatherName: "Vikash Gupta",
    village: "Lataguri",
    gp: "Lataguri GP",
    block: "Kranti Block",
    phone: "9832145687",
    icdsCenter: "ICDS Center Lataguri",
    healthCenter: "PHC Lataguri",
    reason: "Family migration",
    status: "Pending",
    lastContact: "2025-08-12",
  },
]

const teenagePregnancyData = [
  {
    id: 11,
    name: "Mamata Devi",
    age: "17 years",
    husbandName: "Raju Kumar",
    village: "Paharpur",
    gp: "Paharpur GP",
    block: "Jalpaiguri Block",
    phone: "9832145688",
    icdsCenter: "ICDS Center Paharpur",
    healthCenter: "PHC Paharpur",
    status: "High-risk",
    lastContact: "2025-08-16",
  },
  {
    id: 12,
    name: "Sunita Roy",
    age: "16 years",
    husbandName: "Gopal Roy",
    village: "Domohoni",
    gp: "Domohoni–I GP",
    block: "Maynaguri Block",
    phone: "9832145689",
    icdsCenter: "ICDS Center Domohoni",
    healthCenter: "PHC Domohoni",
    status: "Active",
    lastContact: "2025-08-15",
  },
  {
    id: 13,
    name: "Rekha Sharma",
    age: "17 years",
    husbandName: "Suresh Sharma",
    village: "Fulbari",
    gp: "Fulbari–I GP",
    block: "Rajganj Block",
    phone: "9832145690",
    icdsCenter: "ICDS Center Fulbari",
    healthCenter: "PHC Fulbari",
    status: "Active",
    lastContact: "2025-08-14",
  },
]

interface DataTablesProps {
  onRecordSelect: (record: any) => void
}

export function DataTables({ onRecordSelect }: DataTablesProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="destructive">{status}</Badge>
      case "Follow-up":
        return <Badge variant="secondary">{status}</Badge>
      case "Resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {status}
          </Badge>
        )
      case "Pending":
        return <Badge variant="outline">{status}</Badge>
      case "Scheduled":
        return <Badge variant="secondary">{status}</Badge>
      case "High-risk":
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="bg-white/80 border-gray-200/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-lg">Health Records & Case Management</CardTitle>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:w-64 bg-white/80 border-gray-200/50 text-sm"
            />
            <Button variant="outline" size="sm" className="bg-white/80 border-gray-200/50 text-sm">
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="malnourished" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-gradient-to-r from-white via-gray-50/50 to-white border-2 border-gray-100/50 shadow-lg rounded-xl p-1 backdrop-blur-sm overflow-x-auto whitespace-nowrap">
            <TabsTrigger
              value="malnourished"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300 hover:bg-red-50 text-xs"
            >
              👶 Malnourished
            </TabsTrigger>
            <TabsTrigger
              value="immunization"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300 hover:bg-yellow-50 text-xs"
            >
              💉 No Immunization
            </TabsTrigger>
            <TabsTrigger
              value="teenage"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300 hover:bg-purple-50 text-xs"
            >
              👧 Teenage Pregnancy
            </TabsTrigger>
            <TabsTrigger
              value="births"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300 hover:bg-blue-50 text-xs"
            >
              🏥 Childbirths
            </TabsTrigger>
            <TabsTrigger
              value="marriages"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300 hover:bg-green-50 text-xs"
            >
              💒 Under-age Marriage
            </TabsTrigger>
            <TabsTrigger
              value="anemic"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300 hover:bg-pink-50 text-xs"
            >
              🩸 Anemic Girls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="malnourished">
            <div className="rounded-md border border-gray-200/50 bg-white/50 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="min-w-[120px]">Name</TableHead>
                    <TableHead className="min-w-[80px]">Age</TableHead>
                    <TableHead className="min-w-[120px]">Father Name</TableHead>
                    <TableHead className="min-w-[180px]">Location</TableHead>
                    <TableHead className="min-w-[120px]">Contact</TableHead>
                    <TableHead className="min-w-[150px]">ICDS Center</TableHead>
                    <TableHead className="min-w-[100px]">Weight</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {malnourishedData.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-gray-50/50"
                      onClick={() => onRecordSelect(record)}
                    >
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.age}</TableCell>
                      <TableCell>{record.fatherName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{record.village}</span>
                          </div>
                          <div className="text-xs text-gray-500">{record.gp}</div>
                          <div className="text-xs text-gray-400">{record.block}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{record.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.icdsCenter}</TableCell>
                      <TableCell className="font-medium">{record.weight}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="immunization">
            <div className="rounded-md border border-gray-200/50 bg-white/50 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="min-w-[120px]">Name</TableHead>
                    <TableHead className="min-w-[80px]">Age</TableHead>
                    <TableHead className="min-w-[120px]">Father Name</TableHead>
                    <TableHead className="min-w-[180px]">Location</TableHead>
                    <TableHead className="min-w-[120px]">Contact</TableHead>
                    <TableHead className="min-w-[150px]">Reason</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {noImmunizationData.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-gray-50/50"
                      onClick={() => onRecordSelect(record)}
                    >
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.age}</TableCell>
                      <TableCell>{record.fatherName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{record.village}</span>
                          </div>
                          <div className="text-xs text-gray-500">{record.gp}</div>
                          <div className="text-xs text-gray-400">{record.block}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{record.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.reason}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Calendar className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="teenage">
            <div className="rounded-md border border-gray-200/50 bg-white/50 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="min-w-[120px]">Name</TableHead>
                    <TableHead className="min-w-[80px]">Age</TableHead>
                    <TableHead className="min-w-[120px]">Husband Name</TableHead>
                    <TableHead className="min-w-[180px]">Location</TableHead>
                    <TableHead className="min-w-[120px]">Contact</TableHead>
                    <TableHead className="min-w-[150px]">Health Center</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teenagePregnancyData.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-gray-50/50"
                      onClick={() => onRecordSelect(record)}
                    >
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.age}</TableCell>
                      <TableCell>{record.husbandName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{record.village}</span>
                          </div>
                          <div className="text-xs text-gray-500">{record.gp}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{record.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.healthCenter}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <AlertCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="births">
            <div className="p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Childbirths data will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="marriages">
            <div className="p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Under-age marriages data will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="anemic">
            <div className="p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Anemic adolescent girls data will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
