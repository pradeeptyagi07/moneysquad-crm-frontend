"use client"

import React from "react"
import AdminSettings from "./AdminSettings"
import PartnerSettings from "./PartnerSettings"
import ManagerSettings from "./ManagerSettings"
import { useAuth } from "../../hooks/useAuth"
import AssociateSettings from "./AssociateSettings"

const Settings: React.FC = () => {
  const { userRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  if (userRole === "admin") return <AdminSettings />
  if (userRole === "manager") return <ManagerSettings />
  if (userRole === "partner") return <PartnerSettings />
  if (userRole === "associate") return <AssociateSettings />

  return null
}

export default Settings
