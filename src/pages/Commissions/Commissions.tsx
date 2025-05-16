"use client"

import type React from "react"
import { useAuth } from "../../hooks/useAuth"
import AdminCommissions from "./AdminCommissions"
import PartnerCommissions from "./PartnerCommissions"

const Commissions: React.FC = () => {
  const { userRole } = useAuth()

  // Render different commission views based on user role
  if (userRole === "admin") {
    return <AdminCommissions />
  } else if (userRole === "partner") {
    return <PartnerCommissions />
  } else {
    // For manager role or any other role
    return <AdminCommissions />
  }
}

export default Commissions
