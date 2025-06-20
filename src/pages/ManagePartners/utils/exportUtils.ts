import * as XLSX from "xlsx"

export interface PartnerExportData {
  partnerId: string
  fullName: string
  email: string
  mobile: string
  registeringAs: string
  currentProfession: string
  roleSelection: string
  focusProduct: string
  dateOfBirth: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolderName: string
  branchName: string
  panCardUrl: string
  aadharCardUrl: string
  bankPassbookUrl: string
  profilePhotoUrl: string
  status: string
  commissionPlan: string
  createdAt: string
  updatedAt: string
}

export const formatPartnerForExport = (partner: any): PartnerExportData => {
  return {
    // Basic Info
    partnerId: partner.partnerId || "",
    fullName: partner.basicInfo?.fullName || "",
    email: partner.email || "",
    mobile: partner.mobile || "",
    registeringAs: partner.basicInfo?.registeringAs || "",

    // Personal Info
    currentProfession: partner.personalInfo?.currentProfession || "",
    roleSelection: partner.personalInfo?.roleSelection || "",
    focusProduct: partner.personalInfo?.focusProduct || "",
    dateOfBirth: partner.personalInfo?.dateOfBirth || "",

    // Address Details
    addressLine1: partner.addressDetails?.addressLine1 || "",
    addressLine2: partner.addressDetails?.addressLine2 || "",
    city: partner.addressDetails?.city || "",
    state: partner.addressDetails?.state || "",
    pincode: partner.addressDetails?.pincode || "",

    // Bank Details
    bankName: partner.bankDetails?.bankName || "",
    accountNumber: partner.bankDetails?.accountNumber || "",
    ifscCode: partner.bankDetails?.ifscCode || "",
    accountHolderName: partner.bankDetails?.accountHolderName || "",
    branchName: partner.bankDetails?.branchName || "",

    // Documents (URLs)
    panCardUrl: partner.documents?.panCard || "",
    aadharCardUrl: partner.documents?.aadharCard || "",
    bankPassbookUrl: partner.documents?.bankPassbook || "",
    profilePhotoUrl: partner.documents?.profilePhoto || "",

    // Status and Commission
    status: partner.status || "",
    commissionPlan: partner.commissionPlan || partner.commission || "",

    // Timestamps
    createdAt: partner.createdAt ? new Date(partner.createdAt).toLocaleDateString("en-IN") : "",
    updatedAt: partner.updatedAt ? new Date(partner.updatedAt).toLocaleDateString("en-IN") : "",
  }
}

export const exportToCSV = (data: PartnerExportData[], filename = "partners") => {
  const headers = [
    "Partner ID",
    "Full Name",
    "Email",
    "Mobile",
    "Registering As",
    "Current Profession",
    "Role Selection",
    "Focus Product",
    "Date of Birth",
    "Address Line 1",
    "Address Line 2",
    "City",
    "State",
    "Pincode",
    "Bank Name",
    "Account Number",
    "IFSC Code",
    "Account Holder Name",
    "Branch Name",
    "PAN Card URL",
    "Aadhar Card URL",
    "Bank Passbook URL",
    "Profile Photo URL",
    "Status",
    "Commission Plan",
    "Created At",
    "Updated At",
  ]

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.partnerId,
        `"${row.fullName}"`,
        row.email,
        row.mobile,
        `"${row.registeringAs}"`,
        `"${row.currentProfession}"`,
        row.roleSelection,
        `"${row.focusProduct}"`,
        row.dateOfBirth,
        `"${row.addressLine1}"`,
        `"${row.addressLine2}"`,
        `"${row.city}"`,
        `"${row.state}"`,
        row.pincode,
        `"${row.bankName}"`,
        row.accountNumber,
        row.ifscCode,
        `"${row.accountHolderName}"`,
        `"${row.branchName}"`,
        row.panCardUrl,
        row.aadharCardUrl,
        row.bankPassbookUrl,
        row.profilePhotoUrl,
        row.status,
        `"${row.commissionPlan}"`,
        row.createdAt,
        row.updatedAt,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToExcel = (data: PartnerExportData[], filename = "partners") => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((partner) => ({
      "Partner ID": partner.partnerId,
      "Full Name": partner.fullName,
      Email: partner.email,
      Mobile: partner.mobile,
      "Registering As": partner.registeringAs,
      "Current Profession": partner.currentProfession,
      "Role Selection": partner.roleSelection,
      "Focus Product": partner.focusProduct,
      "Date of Birth": partner.dateOfBirth,
      "Address Line 1": partner.addressLine1,
      "Address Line 2": partner.addressLine2,
      City: partner.city,
      State: partner.state,
      Pincode: partner.pincode,
      "Bank Name": partner.bankName,
      "Account Number": partner.accountNumber,
      "IFSC Code": partner.ifscCode,
      "Account Holder Name": partner.accountHolderName,
      "Branch Name": partner.branchName,
      "PAN Card URL": partner.panCardUrl,
      "Aadhar Card URL": partner.aadharCardUrl,
      "Bank Passbook URL": partner.bankPassbookUrl,
      "Profile Photo URL": partner.profilePhotoUrl,
      Status: partner.status,
      "Commission Plan": partner.commissionPlan,
      "Created At": partner.createdAt,
      "Updated At": partner.updatedAt,
    })),
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Partners")

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export const exportSinglePartnerToCSV = (partner: any, filename?: string) => {
  const formattedData = formatPartnerForExport(partner)
  const exportFilename = filename || `partner_${partner.partnerId || "data"}`
  exportToCSV([formattedData], exportFilename)
}

export const exportSinglePartnerToExcel = (partner: any, filename?: string) => {
  const formattedData = formatPartnerForExport(partner)
  const exportFilename = filename || `partner_${partner.partnerId || "data"}`
  exportToExcel([formattedData], exportFilename)
}

// Utility function for bulk export (can be used later)
export const exportMultiplePartnersToCSV = (partners: any[], filename = "partners_bulk") => {
  const formattedData = partners.map(formatPartnerForExport)
  exportToCSV(formattedData, filename)
}

export const exportMultiplePartnersToExcel = (partners: any[], filename = "partners_bulk") => {
  const formattedData = partners.map(formatPartnerForExport)
  exportToExcel(formattedData, filename)
}
