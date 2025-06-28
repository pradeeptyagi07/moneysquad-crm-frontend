"use client"

import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import DashboardLayout from "./DashboardLayout"
import { useAuth } from "../../hooks/useAuth"
import Footer from "./Footer"

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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <DashboardLayout menuItems={menuItems} userRole="Manager" userName={userName}>
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </DashboardLayout>
      <Footer />
    </Box>
  )
}

export default ManagerLayout
