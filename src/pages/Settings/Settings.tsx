"use client"

import type React from "react"
import { useState } from "react"
import AdminSettings from "./AdminSettings"
import PartnerSettings from "./PartnerSettings"
import ManagerSettings from "./ManagerSettings"
import { Typography, Container, Paper, Tabs, Tab } from "@mui/material"
import { Person, Business, SupervisorAccount } from "@mui/icons-material"

// Mock user data to prevent TypeScript errors
const mockUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  location: "Mumbai",
  bio: "Experienced professional with expertise in sales and marketing.",
  profileImage: "/placeholder-kgkar.png",
  bankDetails: {
    accountHolderName: "John Doe",
    accountNumber: "XXXX-XXXX-XXXX-1234",
    bankName: "HDFC Bank",
    ifscCode: "HDFC0001234",
    accountType: "Savings",
    panNumber: "ABCDE1234F",
    gstNumber: "22AAAAA0000A1Z5",
  },
  notifications: {
    email: true,
    sms: false,
    leadUpdates: true,
    commissionPayouts: true,
    partnerRequests: true,
    systemUpdates: false,
    marketingEmails: false,
  },
  security: {
    twoFactorEnabled: false,
    lastLoginIp: "192.168.1.1",
  },
  dateOfBirth: "1990-01-01",
  gender: "Male",
  nationality: "Indian",
  idType: "Aadhar",
  idNumber: "XXXX-XXXX-XXXX",
  emergencyContactName: "Jane Doe",
  emergencyContactRelation: "Spouse",
  emergencyContactPhone: "+91 9876543211",
  addressType: "Residential",
  addressLine1: "123 Partner Street",
  addressLine2: "Andheri East",
  landmark: "Near Metro Station",
  city: "Mumbai",
  state: "Maharashtra",
  postalCode: "400069",
  country: "India",
}

const Settings: React.FC = () => {
  // For demo purposes, let's add a role selector
  const [userRole, setUserRole] = useState<"admin" | "manager" | "partner">("admin")

  const handleRoleChange = (event: React.SyntheticEvent, newValue: "admin" | "manager" | "partner") => {
    setUserRole(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(145deg, #f8fafc, #ffffff)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#0f172a" }}>
          Demo Mode: Select User Role
        </Typography>
        <Tabs
          value={userRole}
          onChange={handleRoleChange}
          aria-label="role tabs"
          sx={{
            "& .MuiTab-root": {
              minHeight: 64,
              fontWeight: 500,
            },
            "& .Mui-selected": {
              color: "#0f766e",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#0f766e",
              height: 3,
            },
          }}
        >
          <Tab icon={<Person />} label="Admin" value="admin" iconPosition="start" />
          <Tab icon={<SupervisorAccount />} label="Manager" value="manager" iconPosition="start" />
          <Tab icon={<Business />} label="Partner" value="partner" iconPosition="start" />
        </Tabs>
      </Paper>

      {userRole === "admin" && <AdminSettings user={mockUserData} />}
      {userRole === "manager" && <ManagerSettings user={mockUserData} />}
      {userRole === "partner" && <PartnerSettings user={mockUserData} />}
    </Container>
  )
}

export default Settings
