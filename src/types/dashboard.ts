export interface DashboardResponse {
    status: number;
    message: string;
    data: {
      gp: {
        name: string;
        block: string;
        role: string;
        month: string;
      };
      summary: {
        totalRecords: number;
        monthlySummary: {
          totalCases: number;
          criticalCases: number;
          childrenAtRisk: number;
          socialIssues: number;
          totalBirths: number;
          totalUnderAgeMarriages: number;
          totalChildrenLowBirthWeight: number;
          totalUnderTwentyPregnantMothers: number;
          totalHighRiskPregnantWomen: number;
          totalMalnourishedChildren: number;
          totalInfectiousDiseases: number;
          totalTbLeprosyPatients: number;
        };
      };
      healthIndicators: Array<{
        id: number,
        title: string;
        count: number;
        change: number;
        icon: string; // Use string to allow for emoji or icon names
        color: string;
        trending: string; // Use string literals for trending direction
      }>;
      charts: {
        healthIssuesByCategory: {
          title: string;
          labels: string[];
          data: number[];
          datasetLabel: string;
          color: string;
        };
        vulnerableGroupsMonitoring: {
          title: string;
          labels: string[];
          data: number[];
          datasetLabel: string;
          color: string;
        };
      };
      recentDataEntries: Array<{
        module: string;
        count: number;
        time: string;
        data: any;
      }>;
      actions: {
        addRecordUrl: string;
        viewReportsUrl: string;
      };
    };
  }
  
  export interface User {
    id: string;
    name: string;
    role: string;
    district: string;
    block: string;
    gpName: string;
    centreName?: string;
    centreId?: string;
  }