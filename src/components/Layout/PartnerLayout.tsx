"use client"

import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import DashboardLayout from "./DashboardLayout"
import { useAuth } from "../../hooks/useAuth"
import Footer from "./Footer"

const PartnerLayout = () => {
  const { userName } = useAuth()

  const menuItems = [
    { text: "Overview", icon: "Dashboard", path: "/partner/overview" },
    { text: "Leads", icon: "People", path: "/partner/leads" },
    { text: "Offers", icon: "LocalOffer", path: "/partner/offers" },
    { text: "Commissions", icon: "AttachMoney", path: "/partner/commissions" },
    { text: "Team Management", icon: "Groups", path: "/partner/team-management" },
    { text: "Training & Resources", icon: "TrainingResources", path: "/partner/training-resorces" }, // ✅ Add this

    { text: "Settings", icon: "Settings", path: "/partner/settings" },
    { text: "Help & Support", icon: "Help", path: "/partner/help-support" }, // ✅ Add this
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <DashboardLayout menuItems={menuItems} userRole="Partner" userName={userName}>
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </DashboardLayout>
    </Box>
  )
}

export default PartnerLayout
