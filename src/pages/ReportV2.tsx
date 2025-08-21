"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Badge } from "../components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select"
import { Bell, Search, Download, MapPin, BarChart3, Map, Activity, TrendingUp, Filter } from "lucide-react"
import { KPICards } from "../components/kpi-cards"
import { ChartsPanel } from "../components/charts-panel"
import { DataTables } from "../components/data-tables"
import { FilterSidebar } from "../components/filter-sidebar"
import { AlertsPanel } from "../components/alerts-panel"
import { RecordDetail } from "../components/record-detail"
import { Sheet, SheetContent } from "../components/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/collapsible" // Import Collapsible

export default function DistrictHealthDashboard() {
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [isFilterSectionOpen, setIsFilterSectionOpen] = useState(false) // State for inline filter section
    const [activeFilters, setActiveFilters] = useState({
        year: "2025",
        month: "August",
        district: "Jalpaiguri District",
        subDivision: "All",
        block: "All",
        gp: "All",
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            {/* Top Navigation Bar */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-30">
                <div className="px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center space-x-3 md:space-x-6 flex-grow">
                            <div className="flex items-center space-x-2 md:space-x-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                    <Activity className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
                                        Jalpaiguri District Health Dashboard
                                    </h1>
                                    <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                                        Real-time Health Monitoring System - West Bengal
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 md:space-x-3 bg-white/80 rounded-lg p-1 md:p-2 border border-gray-200/50">
                                <Select
                                    value={activeFilters.year}
                                    onValueChange={(value) => setActiveFilters({ ...activeFilters, year: value })}
                                >
                                    <SelectTrigger className="w-16 md:w-20 border-0 bg-transparent shadow-none text-xs md:text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="w-px h-5 md:h-6 bg-gray-200"></div>

                                <Select
                                    value={activeFilters.month}
                                    onValueChange={(value) => setActiveFilters({ ...activeFilters, month: value })}
                                >
                                    <SelectTrigger className="w-24 md:w-28 border-0 bg-transparent shadow-none text-xs md:text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="August">August</SelectItem>
                                        <SelectItem value="July">July</SelectItem>
                                        <SelectItem value="June">June</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 md:h-4 md:w-4" />
                                <Input
                                    placeholder="Search person, phone, village..."
                                    className="pl-8 md:pl-10 w-40 md:w-64 lg:w-80 bg-white/80 border-gray-200/50 text-xs md:text-sm"
                                />
                            </div>

                            <Button variant="outline" className="bg-white/80 border-gray-200/50 hidden md:flex">
                                <Bell className="h-4 w-4 mr-2" />
                                Alerts
                                <Badge variant="destructive" className="ml-2">
                                    3
                                </Badge>
                            </Button>

                            <Button variant="outline" className="bg-white/80 border-gray-200/50 hidden md:flex">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Breadcrumb Navigation */}
                    <div className="mt-3 md:mt-4 flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600 overflow-x-auto whitespace-nowrap pb-1">
                        <span className="font-medium">{activeFilters.district}</span>
                        {activeFilters.subDivision !== "All" && (
                            <>
                                <span>→</span>
                                <span className="font-medium">{activeFilters.subDivision}</span>
                            </>
                        )}
                        {activeFilters.block !== "All" && (
                            <>
                                <span>→</span>
                                <span className="font-medium">{activeFilters.block}</span>
                            </>
                        )}
                        {activeFilters.gp !== "All" && (
                            <>
                                <span>→</span>
                                <span className="font-medium">{activeFilters.gp}</span>
                            </>
                        )}
                        <span className="text-gray-400">•</span>
                        <span>
                            {activeFilters.month} {activeFilters.year}
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col">
                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6">
                    <div className="space-y-6">
                        {/* Filter Section (now at the top) */}
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardHeader className="pb-0">
                                <Collapsible open={isFilterSectionOpen} onOpenChange={setIsFilterSectionOpen}>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center text-lg">
                                            <Filter className="h-5 w-5 mr-2 text-blue-600" />
                                            Filters
                                        </CardTitle>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                                {isFilterSectionOpen ? "Hide Filters" : "Show Filters"}
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                    <CollapsibleContent className="pt-4">
                                        <FilterSidebar activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
                                    </CollapsibleContent>
                                </Collapsible>
                            </CardHeader>
                        </Card>

                        {/* KPI Cards */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">Health Metrics Overview</h2>
                                    <p className="text-sm text-gray-600 hidden sm:block">
                                        Key performance indicators for health monitoring
                                    </p>
                                </div>
                                <Button variant="outline" className="bg-white/80 text-sm">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    View Trends
                                </Button>
                            </div>
                            <KPICards />
                        </div>

                        {/* Charts and Visualizations */}
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-white/70 backdrop-blur-md border border-gray-200 rounded-lg p-1 shadow-sm overflow-x-auto whitespace-nowrap">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200 hover:bg-blue-50/80 text-sm px-3 py-1.5"
                                >
                                    📊 Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="blocks"
                                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200 hover:bg-green-50/80 text-sm px-3 py-1.5"
                                >
                                    🏘️ Block Comparison
                                </TabsTrigger>
                                <TabsTrigger
                                    value="trends"
                                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200 hover:bg-purple-50/80 text-sm px-3 py-1.5"
                                >
                                    📈 Trends
                                </TabsTrigger>
                                <TabsTrigger
                                    value="map"
                                    className="data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200 hover:bg-orange-50/80 text-sm px-3 py-1.5"
                                >
                                    🗺️ Geographic
                                </TabsTrigger>
                                <TabsTrigger
                                    value="alerts"
                                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200 hover:bg-red-50/80 text-sm px-3 py-1.5"
                                >
                                    🚨 Alerts
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <ChartsPanel />
                            </TabsContent>

                            <TabsContent value="blocks" className="space-y-6">
                                <Card className="bg-white/80 border-gray-200/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-lg">
                                            <BarChart3 className="h-5 w-5 mr-2" />
                                            Block Comparison - Key Metrics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartsPanel showComparison={true} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="trends" className="space-y-6">
                                <Card className="bg-white/80 border-gray-200/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Monthly Trends - Last 12 Months</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartsPanel showTrends={true} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="map" className="space-y-6">
                                <Card className="bg-white/80 border-gray-200/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-lg">
                                            <Map className="h-5 w-5 mr-2" />
                                            Geographic Hotspot Analysis
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64 md:h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <div className="text-center">
                                                <MapPin className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 text-sm md:text-base">Interactive Map Component</p>
                                                <p className="text-xs md:text-sm text-gray-500 mt-2">
                                                    Choropleth map showing health metrics by GP
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="alerts" className="space-y-6">
                                <AlertsPanel />
                            </TabsContent>
                        </Tabs>

                        {/* Data Tables */}
                        <DataTables onRecordSelect={setSelectedRecord} />
                    </div>
                </main>

                {/* Right Rail / Record Detail (Desktop & Mobile Sheet) */}
                {selectedRecord && (
                    <Sheet open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
                        <SheetContent side="right" className="w-full sm:w-96 p-0 bg-white/90 border-l border-gray-200/50">
                            <RecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} />
                        </SheetContent>
                    </Sheet>
                )}
            </div>
        </div>
    )
}
