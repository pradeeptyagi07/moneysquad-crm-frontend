export const snapshotData = {
  totalDisbursal: { current: 1200000, previous: 1100000, deltaPercent: 9.09 },
  activeLeads: { count: 80, unique: 60 },
  approvalRate: { currentPercent: 65, previousPercent: 62, deltaPercent: 3 },
  rejectionRate: { currentPercent: 12.5, previousPercent: 15, deltaPercent: -2.5 },
  commissionEarned: { current: 50000, previous: 45000, deltaValue: 5000 }
};

export const funnelData = [
  { stage: "Added", value: 1247, conversion: 100, color: "#5569FF" },
  { stage: "Login", value: 856, conversion: 68.7, color: "#FF1943" },
  { stage: "Approved", value: 487, conversion: 56.9, color: "#57CA22" },
  { stage: "Disbursed", value: 324, conversion: 66.5, color: "#FFA319" }
];

export const rejectionReasonsData = [
  { reason: "Insufficient Income", count: 145, percentage: 32.1 },
  { reason: "Poor Credit Score", count: 98, percentage: 21.7 },
  { reason: "Invalid Documents", count: 76, percentage: 16.8 },
  { reason: "Employment Issues", count: 54, percentage: 12.0 },
  { reason: "High DTI Ratio", count: 43, percentage: 9.5 },
  { reason: "Incomplete KYC", count: 35, percentage: 7.9 }
];

export const performanceData = {
  disbursalRate: { value: 78.5, target: 85.0, delta: 4.2 },
  avgTAT: { value: 4.2, target: 3.5, delta: -0.8 },
  avgLoanAmount: { value: 185000, delta: 12.5 },
  targetAchieved: { value: 92.3, target: 100.0, delta: 8.7 }
};

export const trendsData = {
  months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  leadsAdded: [1120, 1280, 1450, 1380, 1520, 1680],
  disbursals: [165, 198, 245, 220, 268, 295],
  payouts: [82400, 99200, 122500, 110000, 134000, 147500]
};