"use client"

import { useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useAppDispatch } from "../../hooks/useAppDispatch"

import { fetchAllLeads } from "../../store/slices/leadSLice"
import LeadsPage from "./LeadComponents/LeadsPage"

const Leads: React.FC = () => {
  const { userRole } = useAuth()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAllLeads())
  }, [dispatch])

  switch (userRole) {
    case "admin":
      return <LeadsPage />
    case "manager":
      return <LeadsPage />
    case "partner":
      return <LeadsPage />
      case "associate":
        return <LeadsPage />
    default:
      return <div>Unauthorized</div>
  }
}

export default Leads
