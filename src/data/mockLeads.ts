import { Lead, LeadStatus, ApplicantProfile } from "./leadTypes";

// Mock data for leads
export const mockLeads: Lead[] = [
  {
    id: "LEAD001",
    applicantName: "John Smith",
    applicantProfile: "Salaried",
    mobileNumber: "9876543210",
    email: "john.smith@example.com",
    pincode: "400001",
    loanType: "Personal Loan",
    loanAmount: 500000,
    status: "pending",
    createdBy: "Jane Partner",
    createdAt: "2023-05-15T10:30:00Z",
    assignedTo: "",
    assignedToId: "",
    lender: "",
    comments: "Looking for quick personal loan",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-15T10:30:00Z",
        comment: "Lead created",
        updatedBy: "Jane Partner"
      }
    ]
  },
  {
    id: "LEAD002",
    applicantName: "Sarah Johnson",
    applicantProfile: "Salaried",
    mobileNumber: "9876543211",
    email: "sarah.j@example.com",
    pincode: "400002",
    loanType: "Home Loan",
    loanAmount: 5000000,
    status: "login",
    createdBy: "Jane Partner",
    createdAt: "2023-05-12T11:20:00Z",
    assignedTo: "John Manager",
    assignedToId: "MGR001",
    lender: "HDFC Bank",
    comments: "First-time home buyer",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-12T11:20:00Z",
        comment: "Lead created",
        updatedBy: "Jane Partner"
      },
      {
        status: "assigned",
        timestamp: "2023-05-12T14:30:00Z",
        comment: "Assigned to John Manager",
        updatedBy: "Admin User"
      },
      {
        status: "login",
        timestamp: "2023-05-13T09:15:00Z",
        comment: "Application logged in system",
        updatedBy: "John Manager"
      }
    ]
  },
  {
    id: "LEAD003",
    applicantName: "Michael Brown",
    applicantProfile: "Business",
    businessName: "Brown Enterprises",
    mobileNumber: "9876543212",
    email: "mbrown@example.com",
    pincode: "400003",
    loanType: "Business Loan",
    loanAmount: 2000000,
    status: "approved",
    createdBy: "Jane Partner",
    createdAt: "2023-05-10T09:45:00Z",
    assignedTo: "John Manager",
    assignedToId: "MGR001",
    lender: "ICICI Bank",
    comments: "Expanding business operations",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-10T09:45:00Z",
        comment: "Lead created",
        updatedBy: "Jane Partner"
      },
      {
        status: "assigned",
        timestamp: "2023-05-10T11:30:00Z",
        comment: "Assigned to John Manager",
        updatedBy: "Admin User"
      },
      {
        status: "login",
        timestamp: "2023-05-11T10:15:00Z",
        comment: "Application logged in system",
        updatedBy: "John Manager"
      },
      {
        status: "approved",
        timestamp: "2023-05-14T16:20:00Z",
        comment: "Loan approved for ₹2,000,000",
        updatedBy: "John Manager"
      }
    ]
  },
  {
    id: "LEAD004",
    applicantName: "Emily Davis",
    applicantProfile: "Salaried",
    mobileNumber: "9876543213",
    email: "emily.d@example.com",
    pincode: "400004",
    loanType: "Personal Loan",
    loanAmount: 300000,
    status: "disbursed",
    createdBy: "Tom Partner",
    createdAt: "2023-05-05T14:20:00Z",
    assignedTo: "Mary Manager",
    assignedToId: "MGR002",
    lender: "Axis Bank",
    comments: "Loan for wedding expenses",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-05T14:20:00Z",
        comment: "Lead created",
        updatedBy: "Tom Partner"
      },
      {
        status: "assigned",
        timestamp: "2023-05-05T16:30:00Z",
        comment: "Assigned to Mary Manager",
        updatedBy: "Admin User"
      },
      {
        status: "login",
        timestamp: "2023-05-06T10:15:00Z",
        comment: "Application logged in system",
        updatedBy: "Mary Manager"
      },
      {
        status: "approved",
        timestamp: "2023-05-08T11:20:00Z",
        comment: "Loan approved for ₹300,000",
        updatedBy: "Mary Manager"
      },
      {
        status: "disbursed",
        timestamp: "2023-05-10T15:45:00Z",
        comment: "Loan amount disbursed to customer account",
        updatedBy: "Mary Manager"
      }
    ]
  },
  {
    id: "LEAD005",
    applicantName: "Robert Wilson",
    applicantProfile: "Self-Employed",
    mobileNumber: "9876543214",
    email: "rwilson@example.com",
    pincode: "400005",
    loanType: "Home Loan",
    loanAmount: 7000000,
    status: "rejected",
    createdBy: "Tom Partner",
    createdAt: "2023-05-01T09:30:00Z",
    assignedTo: "John Manager",
    assignedToId: "MGR001",
    lender: "SBI Bank",
    comments: "Looking to refinance existing home loan",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-01T09:30:00Z",
        comment: "Lead created",
        updatedBy: "Tom Partner"
      },
      {
        status: "assigned",
        timestamp: "2023-05-01T11:45:00Z",
        comment: "Assigned to John Manager",
        updatedBy: "Admin User"
      },
      {
        status: "login",
        timestamp: "2023-05-02T14:20:00Z",
        comment: "Application logged in system",
        updatedBy: "John Manager"
      },
      {
        status: "rejected",
        timestamp: "2023-05-07T16:30:00Z",
        comment: "Insufficient income documentation",
        updatedBy: "John Manager"
      }
    ]
  },
  {
    id: "LEAD006",
    applicantName: "Jennifer Lee",
    applicantProfile: "Business",
    businessName: "Lee Consultants",
    mobileNumber: "9876543215",
    email: "jlee@example.com",
    pincode: "400006",
    loanType: "Business Loan",
    loanAmount: 1500000,
    status: "pending",
    createdBy: "Tom Partner",
    createdAt: "2023-05-16T13:15:00Z",
    assignedTo: "",
    assignedToId: "",
    lender: "",
    comments: "Needs working capital for business expansion",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-16T13:15:00Z",
        comment: "Lead created",
        updatedBy: "Tom Partner"
      }
    ]
  },
  {
    id: "LEAD007",
    applicantName: "David Martinez",
    applicantProfile: "Salaried",
    mobileNumber: "9876543216",
    email: "dmartinez@example.com",
    pincode: "400007",
    loanType: "Personal Loan",
    loanAmount: 800000,
    status: "login",
    createdBy: "Jane Partner",
    createdAt: "2023-05-08T10:45:00Z",
    assignedTo: "Mary Manager",
    assignedToId: "MGR002",
    lender: "HDFC Bank",
    comments: "Loan for home renovation",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-08T10:45:00Z",
        comment: "Lead created",
        updatedBy: "Jane Partner"
      },
      {
        status: "assigned",
        timestamp: "2023-05-08T14:30:00Z",
        comment: "Assigned to Mary Manager",
        updatedBy: "Admin User"
      },
      {
        status: "login",
        timestamp: "2023-05-09T11:20:00Z",
        comment: "Application logged in system",
        updatedBy: "Mary Manager"
      }
    ]
  },
  {
    id: "LEAD008",
    applicantName: "Lisa Wang",
    applicantProfile: "Business",
    businessName: "Wang Technologies",
    mobileNumber: "9876543217",
    email: "lwang@example.com",
    pincode: "400008",
    loanType: "Business Loan",
    loanAmount: 3000000,
    status: "pending",
    createdBy: "Tom Partner",
    createdAt: "2023-05-17T09:30:00Z",
    assignedTo: "",
    assignedToId: "",
    lender: "",
    comments: "Tech startup seeking expansion capital",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-17T09:30:00Z",
        comment: "Lead created",
        updatedBy: "Tom Partner"
      }
    ]
  },
  {
    id: "LEAD009",
    applicantName: "Lisa Wang",
    applicantProfile: "Business",
    businessName: "Wang Technologies",
    mobileNumber: "9876543217",
    email: "lwang@example.com",
    pincode: "400008",
    loanType: "Business Loan",
    loanAmount: 3000000,
    status: "pending",
    createdBy: "Tom Partner",
    createdAt: "2023-05-17T09:30:00Z",
    assignedTo: "",
    assignedToId: "",
    lender: "",
    comments: "Tech startup seeking expansion capital",
    timeline: [
      {
        status: "created",
        timestamp: "2023-05-17T09:30:00Z",
        comment: "Lead created",
        updatedBy: "Tom Partner"
      }
    ]
  }
];

// Mock data for managers
export const mockManagers = [
  { id: "MGR001", name: "John Manager", email: "john.m@moneysquad.com" },
  { id: "MGR002", name: "Mary Manager", email: "mary.m@moneysquad.com" }
];

// Mock data for partners
export const mockPartners = [
  { id: "PTR001", name: "Jane Partner", email: "jane.p@moneysquad.com", managerId: "MGR001" },
  { id: "PTR002", name: "Tom Partner", email: "tom.p@moneysquad.com", managerId: "MGR002" }
];
