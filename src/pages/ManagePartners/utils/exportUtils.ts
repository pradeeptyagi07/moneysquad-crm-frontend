import * as XLSX from "xlsx"
import { Partner } from "../../../store/slices/leadSLice"

export interface ExportablePartner {
  "Partner Name": string
  "Partner ID": string
  Email: string
  Mobile: string
  "Registration Type": string
  "Commission Plan": string
  Role: string
  Status: string
  "Joined Date": string
  "Change Requests": number
}

export const exportPartnersToExcel = (partners: Partner[], filename = "partners_data") => {
  try {
    // Transform partners data to exportable format
    const exportData: ExportablePartner[] = partners.map((partner) => ({
      "Partner Name": partner.basicInfo.fullName,
      "Partner ID": partner.partnerId,
      Email: partner.basicInfo.email,
      Mobile: partner.basicInfo.mobile,
      "Registration Type": partner.basicInfo.registeringAs,
      "Commission Plan": partner.commissionPlan || "N/A",
      Role: partner.personalInfo.roleSelection === "leadSharing" ? "Lead Sharing" : "File Sharing",
      Status: partner.status === "active" ? "Active" : "Inactive",
      "Joined Date": new Date(partner.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      "Change Requests": partner.pendingChangeRequestCount,
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const columnWidths = [
      { wch: 25 }, // Partner Name
      { wch: 15 }, // Partner ID
      { wch: 30 }, // Email
      { wch: 15 }, // Mobile
      { wch: 20 }, // Registration Type
      { wch: 18 }, // Commission Plan
      { wch: 15 }, // Role
      { wch: 12 }, // Status
      { wch: 15 }, // Joined Date
      { wch: 18 }, // Change Requests
    ]
    worksheet["!cols"] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Partners")

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const finalFilename = `${filename}_${timestamp}.xlsx`

    // Write and download file
    XLSX.writeFile(workbook, finalFilename)

    return { success: true, filename: finalFilename }
  } catch (error) {
    console.error("Error exporting partners to Excel:", error)
    return { success: false, error: "Failed to export data" }
  }
}

export const exportPartnersToCSV = (partners: Partner[], filename = "partners_data") => {
  try {
    // Transform partners data to exportable format
    const exportData: ExportablePartner[] = partners.map((partner) => ({
      "Partner Name": partner.basicInfo.fullName,
      "Partner ID": partner.partnerId,
      Email: partner.basicInfo.email,
      Mobile: partner.basicInfo.mobile,
      "Registration Type": partner.basicInfo.registeringAs,
      "Commission Plan": partner.commissionPlan || "N/A",
      Role: partner.personalInfo.roleSelection === "leadSharing" ? "Lead Sharing" : "File Sharing",
      Status: partner.status === "active" ? "Active" : "Inactive",
      "Joined Date": new Date(partner.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      "Change Requests": partner.pendingChangeRequestCount,
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Partners")

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const finalFilename = `${filename}_${timestamp}.csv`

    // Write and download file as CSV
    XLSX.writeFile(workbook, finalFilename, { bookType: "csv" })

    return { success: true, filename: finalFilename }
  } catch (error) {
    console.error("Error exporting partners to CSV:", error)
    return { success: false, error: "Failed to export data" }
  }
}
