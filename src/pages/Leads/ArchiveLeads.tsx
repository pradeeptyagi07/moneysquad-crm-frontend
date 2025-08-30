"use client"

import { useEffect } from "react"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { fetchArchivedLeads } from "../../store/slices/leadSLice"
import LeadsPage from "./LeadComponents/LeadsPage"

const ArchiveLeads: React.FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchArchivedLeads())
  }, [dispatch])

  return (
    <LeadsPage
      dataSource="archived"
      title="Archived Leads"
      hideCreate
      fetchOnMount={false} // don't fetchAllLeads on mount
    />
  )
}

export default ArchiveLeads
