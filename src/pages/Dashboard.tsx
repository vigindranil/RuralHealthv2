import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
} from "lucide-react";
import * as Icons from "lucide-react";
import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { decodeJwtToken } from "../utils/decodetoken";
import { fetchDashboardData } from "../services/dashboardApi";
import { DashboardResponse, User } from "../types/dashboard";
import { getCurrentMonthDateRange } from "../utils/dateUtils";
import { boundaryDetailsByBoundaryId } from "../api/boundaryDropDown";
import Loader from '../components/Loader';

// Helper function to create a URL-friendly slug from a title
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters but keep spaces and dashes
    .replace(/\s+/g, "-") // Replace spaces with a single dash
    .replace(/-+/g, "-"); // Replace multiple dashes with a single one

// Updated the list of disabled forms
const DISABLED_SAVE_FORMS = [
  "underage-marriage",
  "tb-leprosy",
  "infectious-diseases",
  "anemic-adolescent-girls",
];

interface BoundaryItem {
  InnerBoundaryID: number;
  InnerBoundaryLevelID: number;
  InnerBoundaryName: string;
}

export default function Dashboard() {
  const [user, setUser] = React.useState<User | null>(null);
  const [dashboardData, setDashboardData] = React.useState<
    DashboardResponse["data"] | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const [selectedBlock, setSelectedBlock] = React.useState("All");
  const [selectedGP, setSelectedGP] = React.useState<string | null>(null);
  const [boundaryDetails, setBoundaryDetails] = useState<BoundaryItem[] | null>(null);
  const [boundarySubDetails, setBoundarySubDetails] = useState<BoundaryItem[] | null>(null);
  const token = Cookies.get("authToken");
  const decoded = decodeJwtToken(token);
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const LucideIcon = Icons[iconName as keyof typeof Icons];
    return LucideIcon ? <LucideIcon size={20} /> : null;
  };

  React.useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("authToken");
      if (!token) {
        navigate("/");
        return;
      }

      const decoded = decodeJwtToken(token);
      if (decoded) {
        let mappedRole = "GP"; // Default fallback
        if (
          decoded.UserTypeID === 150 ||
          decoded.UserTypeName === "DistrictAdmin"
        ) {
          mappedRole = "District Admin";
          console.log("Mapped Role isnide if:", mappedRole); // Debug log
        } else if (decoded.UserTypeName === "ICDS") {
          mappedRole = "ICDS Centre";
        } else if (decoded.UserTypeName === "Health") {
          mappedRole = "Health Centre";
        }

        console.log("Mapped Role:", mappedRole); // Debug log

        let block = "eeee"; // Default block value
        let gpName = decoded.BoundaryName;
        console.log("gpName", gpName); // Debug log
        let centreName = "";
        const centreId = decoded.BoundaryID.toString();

        if (mappedRole === "GP") {
          block = "Jalpaiguri Sadar";
          gpName = `GP ${decoded.BoundaryID}`;
        } else if (mappedRole === "ICDS Centre") {
          centreName = `ICDS Centre ${decoded.BoundaryID}`;
        } else if (mappedRole === "Health Centre") {
          centreName = `Health Centre ${decoded.BoundaryID}`;
        } else if (mappedRole === "District Admin") {
          block = "All";
          gpName = "All";
        }

        const userData: User = {
          id: decoded.UserID.toString(),
          name: decoded.UserFullName,
          role: mappedRole,
          district: decoded.BoundaryID
            ? `District ${decoded.BoundaryID}`
            : "Jalpaiguri",
          block,
          gpName,
          centreName,
          centreId,
        };

        setUser(userData);

        try {
          const { fromDate, toDate } = getCurrentMonthDateRange();

          const response = await fetchDashboardData(
            decoded.BoundaryLevelID.toString(),
            decoded.BoundaryID.toString(),
            decoded.UserID.toString(),
            fromDate,
            toDate
          );
          setDashboardData(response.data);
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
          setError("Failed to load dashboard data. Please try again.");
        }
      } else {
        Cookies.remove("authToken");
        Cookies.remove("userTypeID");
        navigate("/");
      }

      setLoading(false);
    };

    initializeDashboard();
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      const { fromDate, toDate } = getCurrentMonthDateRange();

      const token = Cookies.get("authToken");
      const decoded = decodeJwtToken(token);

      try {
        if (user?.role === "District Admin" && selectedGP) {
          const data = JSON?.parse(selectedGP);
          const response = await fetchDashboardData(
            data.InnerBoundaryLevelID.toString(),
            data.InnerBoundaryID.toString(),
            decoded.UserID.toString(),
            fromDate,
            toDate
          );

          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      }
    }

    fetchData();
  }, [selectedGP, user]);

  useEffect(() => {
    if (user?.role === "District Admin") {
      const fetchBoundaryDetails = async () => {
        if (!user) return;
        try {
          const token = Cookies.get("authToken");
          const decoded = decodeJwtToken(token);
          const data = await boundaryDetailsByBoundaryId(
            String(decoded?.BoundaryLevelID ?? ""),
            String(decoded?.BoundaryID ?? ""),
            String(decoded?.UserID ?? "")
          );
          setBoundaryDetails(data?.data);
        } catch (err) {
          console.error("Failed to fetch boundary details:", err);
        }
      };

      fetchBoundaryDetails();
    }
  }, [user]);

  // Dynamically generate stats from the API response without any pre-configuration
  const allStats = useMemo(() => {
    if (!dashboardData?.healthIndicators) {
      return [];
    }

    return dashboardData.healthIndicators.map((indicator) => {
      const moduleId = slugify(indicator.title);
      // More robust check for disabled slugs
      const isDisabled = DISABLED_SAVE_FORMS.some((disabledSlug) =>
        moduleId.replace(/-/g, "").includes(disabledSlug.replace(/-/g, ""))
      );

      // Ensure trending is 'up' | 'down'
      let trending: 'up' | 'down' = 'up';
      if (indicator.trending === 'down') trending = 'down';

      return {
        id: indicator.id,
        title: indicator.title.trim(), // Use the title directly from the API
        value: indicator.count.toString(),
        change: indicator.change > 0 ? `+${indicator.change}%` : "0",
        trending,
        icon: <DynamicIcon iconName={indicator.icon} />, // Use the icon from the API or default to Heart
        color: indicator.color, // Use a generic color for all cards
        moduleId: moduleId, // Generate a moduleId from the title for navigation
        isDisabled: isDisabled,
      };
    });
  }, [dashboardData]);

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 px-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-red-100">
          <div className="flex flex-col items-center mb-2">
            <span className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg mb-4 animate-float">
              <AlertTriangle className="w-10 h-10 text-white" />
            </span>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Something went wrong
            </h2>
          </div>
          <p className="text-yellow-600 mb-6 text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
          <div className="mt-6 text-sm text-gray-500">
            If the problem persists, please contact support.
          </div>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No data available
      </div>
    );
  }

  const isDistrict = user?.role === "District Admin";

  const recentEntries = dashboardData.recentDataEntries || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Block/GP Filter Dropdowns */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          {isDistrict && (
            <>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-blue-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Block
                </label>
                <select
                  value={selectedBlock}
                  onChange={async (e) => {
                    const selectedBlockValue = e.target.value;
                    setSelectedBlock(selectedBlockValue);
                    setSelectedGP(null); // Make the GP blank after selecting block

                    let blockObj;
                    try {
                      blockObj = JSON.parse(selectedBlockValue);
                    } catch {
                      blockObj = JSON.parse(
                        '{"InnerBoundaryLevelID": 0, "InnerBoundaryID": 0, "InnerBoundaryName": "All"}'
                      );
                    }

                    if (
                      blockObj &&
                      blockObj.InnerBoundaryID &&
                      blockObj.InnerBoundaryLevelID &&
                      user
                    ) {
                      try {
                        const data = await boundaryDetailsByBoundaryId(
                          String(blockObj.InnerBoundaryLevelID),
                          String(blockObj.InnerBoundaryID),
                          String(user.id)
                        );
                        setBoundarySubDetails(data?.data);
                      } catch (err) {
                        console.error("Failed to fetch boundary details:", err);
                      }
                    } else {
                      setBoundarySubDetails([]);
                    }
                  }}
                  className="border-2 border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all min-w-[180px]"
                >
                  <option
                    value={
                      "{'InnerBoundaryLevelID': 0,'InnerBoundaryID': 0,'InnerBoundaryName': 'All'}"
                    }
                  >
                    All Block
                  </option>

                  {boundaryDetails?.map((block: BoundaryItem) => (
                    <option
                      key={block.InnerBoundaryID}
                      value={JSON.stringify(block)}
                    >
                      {block.InnerBoundaryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-blue-700 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Gram Panchayat
                </label>
                <select
                  value={selectedGP || ""}
                  onChange={(e) => setSelectedGP(e.target.value)}
                  className="border-2 border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all min-w-[180px]"
                >
                  <option
                    value={
                      "{'InnerBoundaryLevelID': 0,'InnerBoundaryID': 0,'InnerBoundaryName': 'All'}"
                    }
                  >
                    All Gram-Panchayats
                  </option>
                  {boundarySubDetails?.map((gp: BoundaryItem) => (
                    <option key={gp.InnerBoundaryID} value={JSON.stringify(gp)}>
                      {gp.InnerBoundaryName}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Health Monitoring Dashboard
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {decoded && decoded.UserTypeName} | {decoded && decoded.BoundaryName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{dashboardData.gp.month}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {allStats.map((stat) => {
            const { isDisabled, ...restStat } = stat;
            return (
              <div
                key={stat.id}
                className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-2 transition-transform hover:scale-105"
              >
                <StatsCard
                  {...restStat}
                  onClick={
                    isDisabled
                      ? () => navigate(`/details/${stat.moduleId}/${stat.id}`)
                      : () => navigate(`/details/${stat.moduleId}/${stat.id}`)
                  }
                />
              </div>
            );
          })}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-8 ">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6 ">
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6">
              <ChartCard
                title="Health Issues by Category"
                type="bar"
                data={{
                  labels: dashboardData.charts.healthIssuesByCategory.labels,
                  datasets: [
                    {
                      label:
                        dashboardData.charts.healthIssuesByCategory.datasetLabel,
                      data: dashboardData.charts.healthIssuesByCategory.data,
                      color: dashboardData.charts.healthIssuesByCategory.color,
                    },
                  ],
                }}
              />
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6">
              <ChartCard
                title="Vulnerable Groups Monitoring"
                type="line"
                data={{
                  labels: dashboardData.charts.vulnerableGroupsMonitoring.labels,
                  datasets: [
                    {
                      label:
                        dashboardData.charts.vulnerableGroupsMonitoring
                          .datasetLabel,
                      data: dashboardData.charts.vulnerableGroupsMonitoring.data,
                      color: dashboardData.charts.vulnerableGroupsMonitoring.color,
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Data Entries
                </h3>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              {recentEntries.length > 0 ? (
                <div className="space-y-4">
                  {recentEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {entry.module}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {entry.data?.name ||
                            entry.data?.motherName ||
                            entry.data?.patientName ||
                            "New Entry"}
                        </p>
                        <p className="text-xs text-gray-400">{entry.time}</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No data entries yet</p>
                  {user?.role === "GP" && (
                    <p className="text-sm text-blue-600">
                      Start by adding data in the Data Entry section
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200 shadow-lg backdrop-blur-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Cases</span>
                  <span className="font-semibold text-gray-900">
                    {dashboardData.summary.monthlySummary.totalCases}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Critical Cases</span>
                  <span className="font-semibold text-red-600">
                    {dashboardData.summary.monthlySummary.criticalCases}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Children at Risk</span>
                  <span className="font-semibold text-orange-600">
                    {dashboardData.summary.monthlySummary.childrenAtRisk}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Social Issues</span>
                  <span className="font-semibold text-purple-600">
                    {dashboardData.summary.monthlySummary.socialIssues}
                  </span>
                </div>
                <div className="border-t pt-3 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Detailed Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Births</span>
                      <span className="font-medium text-blue-600">
                        {dashboardData.summary.monthlySummary.totalBirths}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Under Age Marriages</span>
                      <span className="font-medium text-red-600">
                        {
                          dashboardData.summary.monthlySummary
                            .totalUnderAgeMarriages
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Low Birth Weight</span>
                      <span className="font-medium text-orange-600">
                        {
                          dashboardData.summary.monthlySummary
                            .totalChildrenLowBirthWeight
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Under 20 Pregnancies</span>
                      <span className="font-medium text-purple-600">
                        {
                          dashboardData.summary.monthlySummary
                            .totalUnderTwentyPregnantMothers
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">High Risk Pregnancies</span>
                      <span className="font-medium text-red-600">
                        {
                          dashboardData.summary.monthlySummary
                            .totalHighRiskPregnantWomen
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Malnourished Children</span>
                      <span className="font-medium text-orange-600">
                        {
                          dashboardData.summary.monthlySummary
                            .totalMalnourishedChildren
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Infectious Diseases</span>
                      <span className="font-medium text-red-600">
                        {
                          dashboardData.summary.monthlySummary
                            .totalInfectiousDiseases
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">TB & Leprosy Patients</span>
                      <span className="font-medium text-blue-600">
                        {
                          dashboardData.summary.monthlySummary
                            .totalTbLeprosyPatients
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            {user?.role === "GP" && (
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    onClick={() => navigate("/data-entry")}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Add New Record</span>
                  </button>
                  <button
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    onClick={() => navigate("/reports")}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>View Reports</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}