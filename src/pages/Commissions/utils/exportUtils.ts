// Export utilities for Disbursed Leads Table
import * as XLSX from "xlsx"

export interface ExportableDisbursedLead {
  "Created At": string
  "Lead ID": string
  "Partner Name": string
  "Partner ID": string
  "Associate Name": string
  "Associate ID": string
  "Applicant Name": string
  "Applicant Business": string
  Lender: string
  "Loan Type": string
  "Disbursal Amount": string
  "Commission %": string
  "Gross Payout": string
  "Net Payout": string
  "Payout Status": string
  "Payout Status Updated": string
}

export const exportDisbursedLeadsToExcel = (leads: any[], userRole: string, filename = "disbursed_leads") => {
  try {
    // Transform leads data to exportable format
    const exportData: ExportableDisbursedLead[] = leads.map((lead) => ({
      "Created At": new Date(lead.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      "Lead ID": lead.leadId,
      "Partner Name": lead.partner?.name || "N/A",
      "Partner ID": lead.partner?.partnerId || "N/A",
      "Associate Name": lead.associate?.name || "N/A",
      "Associate ID": lead.associate?.associateDisplayId || "N/A",
      "Applicant Name": lead.applicant?.name || "N/A",
      "Applicant Business": lead.applicant?.business || "N/A",
      Lender: lead.lender?.name || "N/A",
      "Loan Type": lead.lender?.loanType || "N/A",
      "Disbursal Amount": `₹${lead.disbursedAmount?.toLocaleString() || "0"}`,
      "Commission %": `${lead.commission || 0}%`,
      "Gross Payout": `₹${lead.grossPayout?.toLocaleString() || "0"}`,
      "Net Payout": `₹${lead.netPayout?.toLocaleString() || "0"}`,
      "Payout Status": lead.payoutStatus || "N/A",
      "Payout Status Updated": new Date(lead.payoutStatusUpdatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const columnWidths = [
      { wch: 18 }, // Created At
      { wch: 12 }, // Lead ID
      { wch: 20 }, // Partner Name
      { wch: 12 }, // Partner ID
      { wch: 20 }, // Associate Name
      { wch: 12 }, // Associate ID
      { wch: 20 }, // Applicant Name
      { wch: 20 }, // Applicant Business
      { wch: 15 }, // Lender
      { wch: 15 }, // Loan Type
      { wch: 15 }, // Disbursal Amount
      { wch: 12 }, // Commission %
      { wch: 15 }, // Gross Payout
      { wch: 15 }, // Net Payout
      { wch: 12 }, // Payout Status
      { wch: 18 }, // Payout Status Updated
    ]
    worksheet["!cols"] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursed Leads")

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const finalFilename = `${filename}_${timestamp}.xlsx`

    // Write and download file
    XLSX.writeFile(workbook, finalFilename)

    return { success: true, filename: finalFilename }
  } catch (error) {
    console.error("Error exporting disbursed leads to Excel:", error)
    return { success: false, error: "Failed to export data" }
  }
}

export const exportDisbursedLeadsToCSV = (leads: any[], userRole: string, filename = "disbursed_leads") => {
  try {
    // Transform leads data to exportable format
    const exportData: ExportableDisbursedLead[] = leads.map((lead) => ({
      "Created At": new Date(lead.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      "Lead ID": lead.leadId,
      "Partner Name": lead.partner?.name || "N/A",
      "Partner ID": lead.partner?.partnerId || "N/A",
      "Associate Name": lead.associate?.name || "N/A",
      "Associate ID": lead.associate?.associateDisplayId || "N/A",
      "Applicant Name": lead.applicant?.name || "N/A",
      "Applicant Business": lead.applicant?.business || "N/A",
      Lender: lead.lender?.name || "N/A",
      "Loan Type": lead.lender?.loanType || "N/A",
      "Disbursal Amount": `₹${lead.disbursedAmount?.toLocaleString() || "0"}`,
      "Commission %": `${lead.commission || 0}%`,
      "Gross Payout": `₹${lead.grossPayout?.toLocaleString() || "0"}`,
      "Net Payout": `₹${lead.netPayout?.toLocaleString() || "0"}`,
      "Payout Status": lead.payoutStatus || "N/A",
      "Payout Status Updated": new Date(lead.payoutStatusUpdatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursed Leads")

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const finalFilename = `${filename}_${timestamp}.csv`

    // Write and download file as CSV
    XLSX.writeFile(workbook, finalFilename, { bookType: "csv" })

    return { success: true, filename: finalFilename }
  } catch (error) {
    console.error("Error exporting disbursed leads to CSV:", error)
    return { success: false, error: "Failed to export data" }
  }
}
