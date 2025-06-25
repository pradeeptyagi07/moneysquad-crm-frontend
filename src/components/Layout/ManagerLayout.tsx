"use client"

import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import DashboardLayout from "./DashboardLayout"
import { useAuth } from "../../hooks/useAuth"

const ManagerLayout = () => {
  const { userName } = useAuth()

  const menuItems = [
    { text: "Overview", icon: "Dashboard", path: "/manager/overview" },
    { text: "Leads", icon: "People", path: "/manager/leads" },
        { text: "Offers", icon: "LocalOffer", path: "/manager/offers" },

        {
      text: "Training & Resources",
      icon: "TrainingResources",
      path: "/manager/training-resorces",
    }, // ✅ Add this
    { text: "Settings", icon: "Settings", path: "/manager/settings" },
  ]

  return (
    <DashboardLayout menuItems={menuItems} userRole="Manager" userName={userName}>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </DashboardLayout>
  )
}

export default ManagerLayout
