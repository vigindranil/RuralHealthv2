"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts"

// Update the block data with actual Jalpaiguri blocks from the master record

const blockData = [
  { block: "Jalpaiguri Block", malnourished: 58, noImmunization: 32, teenage: 16 },
  { block: "Maynaguri Block", malnourished: 65, noImmunization: 38, teenage: 19 },
  { block: "Rajganj Block", malnourished: 52, noImmunization: 28, teenage: 14 },
  { block: "Dhupguri Block", malnourished: 43, noImmunization: 24, teenage: 11 },
  { block: "Banarhat Block", malnourished: 48, noImmunization: 26, teenage: 13 },
  { block: "Mal Block", malnourished: 39, noImmunization: 21, teenage: 9 },
  { block: "Matiali Block", malnourished: 41, noImmunization: 23, teenage: 10 },
  { block: "Nagrakata Block", malnourished: 36, noImmunization: 19, teenage: 8 },
  { block: "Kranti Block", malnourished: 33, noImmunization: 17, teenage: 7 },
]

// Update scatter data with actual GP names from the master record

const scatterData = [
  { gp: "Kharia GP", noImmunization: 12, malnourished: 25, population: 1200 },
  { gp: "Arabinda GP", noImmunization: 15, malnourished: 28, population: 1350 },
  { gp: "Paharpur GP", noImmunization: 18, malnourished: 32, population: 1450 },
  { gp: "Amguri GP", noImmunization: 14, malnourished: 26, population: 1250 },
  { gp: "Domohoni–I GP", noImmunization: 16, malnourished: 29, population: 1300 },
  { gp: "Dabgram–I GP", noImmunization: 13, malnourished: 24, population: 1150 },
  { gp: "Fulbari–I GP", noImmunization: 17, malnourished: 31, population: 1400 },
  { gp: "Barogharia GP", noImmunization: 11, malnourished: 22, population: 1050 },
  { gp: "Bagrakot GP", noImmunization: 9, malnourished: 19, population: 950 },
  { gp: "Lataguri GP", noImmunization: 8, malnourished: 17, population: 850 },
]

const trendData = [
  { month: "Feb", malnourished: 168, noImmunization: 95, teenage: 28 },
  { month: "Mar", malnourished: 172, noImmunization: 88, teenage: 31 },
  { month: "Apr", malnourished: 165, noImmunization: 92, teenage: 29 },
  { month: "May", malnourished: 178, noImmunization: 86, teenage: 33 },
  { month: "Jun", malnourished: 174, noImmunization: 81, teenage: 30 },
  { month: "Jul", malnourished: 181, noImmunization: 74, teenage: 32 },
  { month: "Aug", malnourished: 189, noImmunization: 78, teenage: 34 },
]

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"]

interface ChartsPanelProps {
  showComparison?: boolean
  showTrends?: boolean
}

export function ChartsPanel({ showComparison = false, showTrends = false }: ChartsPanelProps) {
  if (showTrends) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle>Monthly Trend - Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="malnourished" stroke="#ef4444" strokeWidth={2} name="Malnourished" />
                <Line
                  type="monotone"
                  dataKey="noImmunization"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="No Immunization"
                />
                <Line type="monotone" dataKey="teenage" stroke="#eab308" strokeWidth={2} name="Teenage Pregnancy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle>Growth Rate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="malnourished"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="noImmunization"
                  stackId="1"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showComparison) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle>Block Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={blockData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="block" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="malnourished" fill="#ef4444" name="Malnourished" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle>Multi-Metric Block Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={blockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="block" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="malnourished" fill="#ef4444" name="Malnourished" />
                <Bar dataKey="noImmunization" fill="#f97316" name="No Immunization" />
                <Bar dataKey="teenage" fill="#eab308" name="Teenage Pregnancy" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/80 border-gray-200/50">
        <CardHeader>
          <CardTitle>Malnourished Children by Block</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={blockData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="block" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="malnourished" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/80 border-gray-200/50">
        <CardHeader>
          <CardTitle>GP Health Issues Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={blockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="block" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="malnourished" stackId="a" fill="#ef4444" name="Malnourished" />
              <Bar dataKey="noImmunization" stackId="a" fill="#f97316" name="No Immunization" />
              <Bar dataKey="teenage" stackId="a" fill="#eab308" name="Teenage Pregnancy" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/80 border-gray-200/50">
        <CardHeader>
          <CardTitle>Immunization vs Malnutrition Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="noImmunization" name="No Immunization" />
              <YAxis dataKey="malnourished" name="Malnourished" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter dataKey="malnourished" fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/80 border-gray-200/50">
        <CardHeader>
          <CardTitle>Monthly Trend - Malnourished Children</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="malnourished" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
