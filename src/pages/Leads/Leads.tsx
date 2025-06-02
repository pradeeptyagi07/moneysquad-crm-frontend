"use client"

import { useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import AdminLeads from "./AdminLeads"

import { fetchAllLeads } from "../../store/slices/leadSLice"

const Leads: React.FC = () => {
  const { userRole } = useAuth()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAllLeads())
  }, [dispatch])

  switch (userRole) {
    case "admin":
      return <AdminLeads />
    case "manager":
      return <AdminLeads />
    case "partner":
      return <AdminLeads />
    default:
      return <div>Unauthorized</div>
  }
}

export default Leads
