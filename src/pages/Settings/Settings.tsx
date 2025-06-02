"use client"

import React from "react"
import AdminSettings from "./AdminSettings"
import PartnerSettings from "./PartnerSettings"
import ManagerSettings from "./ManagerSettings"
import { useAuth } from "../../hooks/useAuth"

const Settings: React.FC = () => {
  const { userRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  if (userRole === "admin") return <AdminSettings />
  if (userRole === "manager") return <ManagerSettings />
  if (userRole === "partner") return <PartnerSettings />

  return null
}

export default Settings
