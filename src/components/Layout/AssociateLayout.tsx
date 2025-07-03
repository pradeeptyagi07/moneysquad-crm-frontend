"use client"

import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import DashboardLayout from "./DashboardLayout"
import { useAuth } from "../../hooks/useAuth"
import Footer from "./Footer"

const AssociateLayout = () => {
  const { userName } = useAuth()

  const menuItems = [
    { text: "Overview", icon: "Dashboard", path: "/associate/overview" },
    { text: "Leads", icon: "People", path: "/associate/leads" },
    { text: "Offers", icon: "LocalOffer", path: "/associate/offers" },
    {
      text: "Training & Resources",
      icon: "TrainingResources",
      path: "/associate/training-resorces",
    }, // ✅ Add this

    { text: "Settings", icon: "Settings", path: "/associate/settings" },
    { text: "Help & Support", icon: "Help", path: "/associate/help-support" }, // ✅ Add this
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <DashboardLayout menuItems={menuItems} userRole="Associate" userName={userName}>
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </DashboardLayout>
    </Box>
  )
}

export default AssociateLayout
