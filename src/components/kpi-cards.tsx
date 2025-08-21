"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"
import { Users, Baby, Heart, Shield, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area } from "recharts"

const sparklineData = [
  { value: 52, month: 1 },
  { value: 48, month: 2 },
  { value: 55, month: 3 },
  { value: 61, month: 4 },
  { value: 58, month: 5 },
  { value: 64, month: 6 },
]

const kpiData = [
  {
    title: "Malnourished Children",
    value: 415,
    change: +28,
    changePercent: 7.2,
    icon: Users,
    gradient: "from-red-500 to-pink-600",
    iconBg: "bg-red-500",
    shadowColor: "shadow-red-200",
    trend: "up",
    description: "Children under 5 years",
    emoji: "👶",
    sparklineColor: "#ef4444",
  },
  {
    title: "Severely Underweight",
    value: 248,
    change: -15,
    changePercent: -5.7,
    icon: Activity,
    gradient: "from-orange-500 to-amber-600",
    iconBg: "bg-orange-500",
    shadowColor: "shadow-orange-200",
    trend: "down",
    description: "Severe underweight cases",
    emoji: "⚖️",
    sparklineColor: "#f97316",
  },
  {
    title: "No Immunization Cases",
    value: 228,
    change: +35,
    changePercent: 18.1,
    icon: Shield,
    gradient: "from-yellow-500 to-orange-500",
    iconBg: "bg-yellow-500",
    shadowColor: "shadow-yellow-200",
    trend: "up",
    description: "Zero recorded vaccines",
    emoji: "💉",
    sparklineColor: "#eab308",
  },
  {
    title: "Non-Institutional Births",
    value: 142,
    change: -8,
    changePercent: -5.3,
    icon: Baby,
    gradient: "from-blue-500 to-cyan-600",
    iconBg: "bg-blue-500",
    shadowColor: "shadow-blue-200",
    trend: "down",
    description: "Births outside facilities",
    emoji: "🏥",
    sparklineColor: "#3b82f6",
  },
  {
    title: "Teenage Pregnancies",
    value: 107,
    change: +18,
    changePercent: 20.2,
    icon: Heart,
    gradient: "from-purple-500 to-indigo-600",
    iconBg: "bg-purple-500",
    shadowColor: "shadow-purple-200",
    trend: "up",
    description: "Girls under 18 years",
    emoji: "👧",
    sparklineColor: "#8b5cf6",
  },
  {
    title: "High-risk Pregnancies",
    value: 68,
    change: +9,
    changePercent: 15.3,
    icon: AlertTriangle,
    gradient: "from-pink-500 to-rose-600",
    iconBg: "bg-pink-500",
    shadowColor: "shadow-pink-200",
    trend: "up",
    description: "Special monitoring needed",
    emoji: "⚠️",
    sparklineColor: "#ec4899",
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon
        const isOverTarget = kpi.value > (kpi.target || 0) // Ensure target is defined for comparison

        return (
          <Card
            key={index}
            className={`group relative overflow-hidden bg-white border border-gray-200 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:rotate-1 hover:shadow-xl hover:shadow-blue-500/40 hover:border-blue-300 cursor-pointer`}
          >
            <CardHeader
              className={`relative z-10 flex flex-row items-center justify-between space-y-0 p-4 pb-2 rounded-t-md bg-gradient-to-br ${kpi.gradient}`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-lg animate-bounce">{kpi.emoji}</span>
                  <CardTitle className="text-sm font-semibold text-white leading-tight truncate">{kpi.title}</CardTitle>
                </div>
                <p className="text-xs text-gray-100 leading-tight">{kpi.description}</p>
              </div>
              <div
                className={`relative p-2 rounded-md bg-white/20 shadow-sm group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 flex-shrink-0`}
              >
                <Icon className="h-4 w-4 text-white drop-shadow-sm" />
                {kpi.trend === "up" && isOverTarget && (
                  <div className={`absolute inset-0 rounded-md ${kpi.iconBg} animate-ping opacity-75`}></div>
                )}
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-3 p-4 pt-0">
              {/* Main Value with Sparkline */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                      {kpi.value}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">cases</span>
                  </div>
                </div>
                <div className="h-10 w-16 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={kpi.sparklineColor} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={kpi.sparklineColor} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={kpi.sparklineColor}
                        strokeWidth={2}
                        fill={`url(#gradient-${index})`}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Change Indicator */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all duration-300 group-hover:scale-105 ${
                    kpi.trend === "up"
                      ? "bg-red-100 text-red-700 group-hover:bg-red-200"
                      : "bg-green-100 text-green-700 group-hover:bg-green-200"
                  }`}
                >
                  {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  <span className="text-xs font-bold">
                    {kpi.changePercent > 0 ? "+" : ""}
                    {kpi.changePercent}%
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 text-xs text-blue-600 hover:bg-gray-100 hover:text-blue-700 transition-all duration-300 group-hover:scale-105`}
                >
                  View List
                </Button>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500">
                    {kpi.change > 0 ? "+" : ""}
                    {kpi.change} vs last month
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-xs">Live</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
