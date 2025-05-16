// Create a basic Leads component that routes to the appropriate role-specific component
"use client"

import type React from "react"
import { useAuth } from "../../hooks/useAuth"
import AdminLeads from "./AdminLeads"
import ManagerLeads from "./ManagerLeads"
import PartnerLeads from "./PartnerLeads"

const Leads: React.FC = () => {
  const { userRole } = useAuth()

  // Render the appropriate leads component based on user role
  switch (userRole) {
    case "admin":
      return <AdminLeads />
    case "manager":
      return <ManagerLeads />
    case "partner":
      return <PartnerLeads />
    default:
      return <div>Unauthorized</div>
  }
}

export default Leads
