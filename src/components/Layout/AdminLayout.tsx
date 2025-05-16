"use client"

import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import DashboardLayout from "./DashboardLayout"
import { useAuth } from "../../hooks/useAuth"

const AdminLayout = () => {
  const { userName } = useAuth()

  const menuItems = [
    { text: "Overview", icon: "Dashboard", path: "/admin/overview" },
    { text: "Leads", icon: "People", path: "/admin/leads" },
    { text: "Offers", icon: "LocalOffer", path: "/admin/offers" },
    { text: "Commissions", icon: "AttachMoney", path: "/admin/commissions" },
    { text: "Team Management", icon: "Groups", path: "/admin/team-management" },
    { text: "Manage Partners", icon: "SupervisorAccount", path: "/admin/manage-partners" },
    { text: "Settings", icon: "Settings", path: "/admin/settings" },
  ]

  return (
    <DashboardLayout menuItems={menuItems} userRole="Admin" userName={userName}>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </DashboardLayout>
  )
}

export default AdminLayout
