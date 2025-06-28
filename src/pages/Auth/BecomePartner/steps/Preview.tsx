import type React from "react"
import { Box, Grid, Typography, Divider, Paper, Chip, List, ListItem, ListItemText, ListItemIcon } from "@mui/material"
import { Person, LocationOn, Work, AccountBalance, InsertDriveFile } from "@mui/icons-material"
import type { PartnerFormData } from "../index"

interface PreviewProps {
  formData: PartnerFormData
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "primary.light",
            color: "white",
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  )
}

const Preview: React.FC<PreviewProps> = ({ formData }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not provided"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Please review your information before submitting
      </Typography>

      <Section title="Basic Information" icon={<Person />}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body1">{formData.fullName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Mobile Number
            </Typography>
            <Typography variant="body1">+91 {formData.mobileNumber}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
              {formData.otpVerified && <Chip label="Verified" color="success" size="small" sx={{ ml: 1 }} />}
            </Typography>
            <Typography variant="body1">{formData.email}</Typography>
          </Grid>
         
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Registration Type
            </Typography>
            <Typography variant="body1">{formData.registrationType}</Typography>
          </Grid>
          {formData.teamStrength && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Team Strength
              </Typography>
              <Typography variant="body1">{formData.teamStrength}</Typography>
            </Grid>
          )}
        </Grid>
      </Section>

      <Section title="Personal Details" icon={<Work />}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body1">{formatDate(formData.dateOfBirth)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Profession
            </Typography>
            <Typography variant="body1">{formData.employmentType}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Emergency Contact
            </Typography>
            <Typography variant="body1">+91 {formData.emergencyContact}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Focus Product
            </Typography>
            <Typography variant="body1">{formData.focusProduct}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1">{formData.role === "leadSharing" ? "Lead Sharing" : "File Sharing"}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Experience in Selling Loans
            </Typography>
            <Typography variant="body1">{formData.experienceInSellingLoans}</Typography>
          </Grid>
        </Grid>
      </Section>

      <Section title="Address Details" icon={<LocationOn />}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              {formData.registrationType === "Individual" ? "Residence Address" : "Work Address"}
            </Typography>
            <Typography variant="body1">
              {formData.addressLine1}
              {formData.addressLine2 && `, ${formData.addressLine2}`}
              {formData.landmark && `, Near ${formData.landmark}`}
            </Typography>
            <Typography variant="body1">
              {formData.city}, {formData.addressPincode}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Address Type
            </Typography>
            <Typography variant="body1">{formData.addressType}</Typography>
          </Grid>
        </Grid>
      </Section>

      <Section title="Bank Details" icon={<AccountBalance />}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Account Holder Name
            </Typography>
            <Typography variant="body1">{formData.accountHolderName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Account Type
            </Typography>
            <Typography variant="body1">{formData.accountType}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Relationship with Account Holder
            </Typography>
            <Typography variant="body1">{formData.relationshipWithAccountHolder}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Bank Name
            </Typography>
            <Typography variant="body1">{formData.bankName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Account Number
            </Typography>
            <Typography variant="body1">
              {"•".repeat(formData.accountNumber.length - 4) + formData.accountNumber.slice(-4)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              IFSC Code
            </Typography>
            <Typography variant="body1">{formData.ifscCode}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Branch Name
            </Typography>
            <Typography variant="body1">{formData.branchName}</Typography>
          </Grid>
          {formData.isGstBillingApplicable && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                GST Billing Applicable
              </Typography>
              <Typography variant="body1">{formData.isGstBillingApplicable}</Typography>
            </Grid>
          )}
        </Grid>
      </Section>

      <Section title="Uploaded Documents" icon={<InsertDriveFile />}>
        <List>
          {[
            {
              name: "Profile Photo",
              file: formData.profilePhoto,
              required: false,
            },
            { name: "PAN Card", file: formData.panCard, required: true },
            {
              name: "Aadhar Card (Front)",
              file: formData.aadharFront,
              required: true,
            },
            {
              name: "Aadhar Card (Back)",
              file: formData.aadharBack,
              required: true,
            },
            {
              name: "Cancelled Cheque",
              file: formData.cancelledCheque,
              required: false,
            },
            {
              name: "GST Certificate",
              file: formData.gstCertificate,
              required: false,
            },
          ].map((doc, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon>
                <InsertDriveFile color={doc.file ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {doc.name}
                    {doc.required && !doc.file && <Chip label="Required" color="warning" size="small" sx={{ ml: 1 }} />}
                  </Box>
                }
                secondary={doc.file ? `${doc.file.name} (${(doc.file.size / 1024).toFixed(1)} KB)` : "Not uploaded"}
              />
            </ListItem>
          ))}

          {formData.otherDocuments && formData.otherDocuments.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Additional Documents
              </Typography>
              {formData.otherDocuments.map((doc, index) => (
                <ListItem key={`other-${index}`} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <InsertDriveFile color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={doc.name} secondary={`${(doc.size / 1024).toFixed(1)} KB`} />
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Section>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          By submitting this form, you agree to our Terms of Service and Privacy Policy. Your information will be
          verified before your account is activated.
        </Typography>
      </Box>
    </Box>
  )
}

export default Preview
