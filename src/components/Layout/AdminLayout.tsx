"use client"

import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import DashboardLayout from "./DashboardLayout"
import { useAuth } from "../../hooks/useAuth"
import Footer from "./Footer"

const AdminLayout = () => {
  const { userName } = useAuth()

  const menuItems = [
    { text: "Overview", icon: "Dashboard", path: "/admin/overview" },
    { text: "Leads", icon: "People", path: "/admin/leads" },
    { text: "Offers", icon: "LocalOffer", path: "/admin/offers" },
    { text: "Commissions", icon: "AttachMoney", path: "/admin/commissions" },
    {
      text: "Partner Management",
      icon: "GroupWork",
      path: "/admin/manage-partners",
    },

    { text: "Team Management", icon: "Groups", path: "/admin/team-management" },
    {
      text: "Training & Resources",
      icon: "TrainingResources",
      path: "/admin/training-resorces",
    }, // ✅ Add this

    { text: "Settings", icon: "Settings", path: "/admin/settings" },
    { text: "Help & Support", icon: "Help", path: "/admin/help-support" }, // ✅ Add this
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <DashboardLayout menuItems={menuItems} userRole="Admin" userName={userName}>
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </DashboardLayout>
      {/* <Footer /> */}
    </Box>
  )
}

export default AdminLayout
