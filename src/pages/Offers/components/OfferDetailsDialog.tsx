"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Slide,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material"
import type { TransitionProps } from "@mui/material/transitions"
import { Close, Person, AttachMoney, Work, CreditScore, Edit, CheckCircle, ContentCopy } from "@mui/icons-material"
import CreateOfferDialog from "./CreateOfferDialog"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { fetchOfferById, setSelectedOffer } from "../../../store/slices/offersSlice"

// Slide-up transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

// Summary section with premium border accent
const SummarySection: React.FC<{ rate: number; fee: number; valid?: string }> = ({ rate, fee, valid }) => (
  <Card
    elevation={3}
    sx={{
      borderRadius: 2,
      mb: 3,
      borderLeft: "4px solid #5E17EB", // primary accent
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}
  >
    <CardContent>
      <Grid container justifyContent="space-around" sx={{ textAlign: "center" }}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Interest Rate
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {rate}%
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Processing Fee
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            ₹{fee}
          </Typography>
        </Grid>
        {valid && (
          <Grid item xs={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Valid Till
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {valid}
            </Typography>
          </Grid>
        )}
      </Grid>
    </CardContent>
  </Card>
)

// Premium Feature tags with glow effect
const FeatureSection: React.FC<{ features: string[] }> = ({ features }) => (
  <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Key Features
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {features.map((feature, i) => (
          <Chip
            key={i}
            label={feature}
            variant="outlined"
            sx={{
              maxWidth: 200,
              whiteSpace: "normal",
              wordBreak: "break-word",
              borderColor: "#5E17EB",
              boxShadow: "0 0 8px rgba(94,23,235,0.3)",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0 0 12px rgba(94,23,235,0.5)",
              },
            }}
          />
        ))}
      </Box>
    </CardContent>
  </Card>
)

// Eligibility list, only render if data exists
const EligibilitySection: React.FC<{ eligibility: any }> = ({ eligibility }) => {
  const hasEligibility =
    eligibility &&
    (eligibility.minAge || eligibility.minIncome || eligibility.employmentType || eligibility.maxCreditScore)
  if (!hasEligibility) return null
  return (
    <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Eligibility & Requirements
        </Typography>
        <List>
          {eligibility.minAge && (
            <ListItem>
              <ListItemIcon>
                <Person fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body2">
                Age: {eligibility.minAge} – {eligibility.maxAge} years
              </Typography>
            </ListItem>
          )}
          {eligibility.minIncome && (
            <ListItem>
              <ListItemIcon>
                <AttachMoney fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body2">Min Income: ₹{eligibility.minIncome}</Typography>
            </ListItem>
          )}
          {eligibility.employmentType && (
            <ListItem>
              <ListItemIcon>
                <Work fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body2">Employment: {eligibility.employmentType}</Typography>
            </ListItem>
          )}
          {eligibility.maxCreditScore && (
            <ListItem>
              <ListItemIcon>
                <CreditScore fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body2">Max Credit Score: {eligibility.maxCreditScore}</Typography>
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  )
}

// Terms & conditions
const TermsSection: React.FC = () => (
  <Card elevation={1} sx={{ mx: 3, p: 2, bgcolor: "grey.50" }}>
    <Typography variant="body2" align="center">
      The offer is subject to change without prior notice at the sole discretion of the Lender. Kindly contact your
      relationship manager for more details.
    </Typography>
  </Card>
)

interface OfferDetailsDialogProps {
  open: boolean
  onClose: () => void
  offerId: string
  userRole: string
}

const OfferDetailsDialog: React.FC<OfferDetailsDialogProps> = ({ open, onClose, offerId, userRole }) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied">("idle")

  const handleShareOffer = async () => {
    if (!selectedOffer) return

    setCopyState("copying")

    try {
      // Generate shareable link
      const shareableLink = `${window.location.origin}/offers/share/${selectedOffer.bankName.toLowerCase().replace(/\s+/g, "-")}-${selectedOffer.loanType?.toLowerCase().replace(/\s+/g, "-") || "loan"}-${selectedOffer.interestRate}-${selectedOffer._id}`

      // Create rich text format
      const validTill = selectedOffer?.offerValidity
        ? new Date(selectedOffer.offerValidity).toLocaleDateString()
        : undefined

      let richText = `🏦 ${selectedOffer.bankName} - ${selectedOffer.loanType || "Loan"}
💰 Interest Rate: ${selectedOffer.interestRate}%
💳 Processing Fee: ₹${selectedOffer.processingFee}${
        validTill
          ? `
⏰ Valid until: ${validTill}`
          : ""
      }

${selectedOffer.offerHeadline || "Great loan offer with competitive rates!"}`

      // Add key features if available
      if (selectedOffer.keyFeatures && selectedOffer.keyFeatures.length > 0) {
        richText += `

✨ Key Features:
${selectedOffer.keyFeatures.map((feature) => `• ${feature}`).join("\n")}`
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(richText)

      setCopyState("copied")

      // Reset after 2 seconds
      setTimeout(() => {
        setCopyState("idle")
      }, 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      // Fallback for older browsers
      const shareableLink = `${window.location.origin}/offers/share/${selectedOffer.bankName.toLowerCase().replace(/\s+/g, "-")}-${selectedOffer.loanType?.toLowerCase().replace(/\s+/g, "-") || "loan"}-${selectedOffer.interestRate}-${selectedOffer._id}`
      const validTill = selectedOffer?.offerValidity
        ? new Date(selectedOffer.offerValidity).toLocaleDateString()
        : undefined

      let richText = `🏦 ${selectedOffer.bankName} - ${selectedOffer.loanType || "Loan"}
💰 Interest Rate: ${selectedOffer.interestRate}%
💳 Processing Fee: ₹${selectedOffer.processingFee}${
        validTill
          ? `
⏰ Valid until: ${validTill}`
          : ""
      }

${selectedOffer.offerHeadline || "Great loan offer with competitive rates!"}`

      // Add key features if available
      if (selectedOffer.keyFeatures && selectedOffer.keyFeatures.length > 0) {
        richText += `

✨ Key Features:
${selectedOffer.keyFeatures.map((feature) => `• ${feature}`).join("\n")}`
      }
      const textArea = document.createElement("textarea")
      textArea.value = richText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      setCopyState("copied")
      setTimeout(() => {
        setCopyState("idle")
      }, 2000)
    }
  }
  const dispatch = useAppDispatch()
  const { selectedOffer, detailsLoading, error } = useAppSelector((state) => state.offers)

  useEffect(() => {
    if (open && offerId) dispatch(fetchOfferById(offerId))
    return () => {
      if (!open) dispatch(setSelectedOffer(null))
    }
  }, [open, offerId, dispatch])

  const validTill = selectedOffer?.offerValidity
    ? new Date(selectedOffer.offerValidity).toLocaleDateString()
    : undefined

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Transition}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {detailsLoading ? "Loading…" : selectedOffer?.bankName || "Offer Details"}
            </Typography>
            <Box>
              {userRole === "admin" && selectedOffer && (
                <IconButton onClick={() => setOpenEdit(true)} sx={{ mr: 1 }}>
                  <Edit />
                </IconButton>
              )}
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {detailsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="error">{error}</Typography>
              <Button onClick={onClose} sx={{ mt: 2 }}>
                Close
              </Button>
            </Box>
          ) : selectedOffer ? (
            <>
              {/* Banner with animated featured border */}
              <Box sx={{ position: "relative", mx: 3, mt: 2, borderRadius: 2, overflow: "hidden" }}>
                <Box
                  component="img"
                  src={selectedOffer.bankImage}
                  alt={selectedOffer.bankName}
                  sx={{ width: "100%", height: 240, objectFit: "cover" }}
                />
                {selectedOffer.isFeatured && (
                  <Chip
                    label="Featured"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "warning.main",
                      color: "common.white",
                      borderRadius: 1,
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": { boxShadow: "0 0 0 0 rgba(255, 170, 0, 0.7)" },
                        "70%": { boxShadow: "0 0 0 8px rgba(255, 170, 0, 0)" },
                        "100%": { boxShadow: "0 0 0 0 rgba(255, 170, 0, 0)" },
                      },
                    }}
                  />
                )}
              </Box>

              {/* Content Sections */}
              <Box sx={{ px: 3, pt: 2 }}>
                <SummarySection rate={selectedOffer.interestRate} fee={selectedOffer.processingFee} valid={validTill} />
                {selectedOffer.keyFeatures?.length > 0 && <FeatureSection features={selectedOffer.keyFeatures} />}
                <EligibilitySection eligibility={selectedOffer.eligibility} />
              </Box>

              {/* Terms & Actions */}
              <TermsSection />
            </>
          ) : null}
        </DialogContent>

        {selectedOffer && (
          <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
            <Button
              startIcon={
                copyState === "copying" ? (
                  <CircularProgress size={16} sx={{ color: "inherit" }} />
                ) : copyState === "copied" ? (
                  <CheckCircle />
                ) : (
                  <ContentCopy />
                )
              }
              onClick={handleShareOffer}
              disabled={copyState === "copying"}
              sx={{
                textTransform: "none",
                color: copyState === "copied" ? "success.main" : "inherit",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: copyState === "copied" ? "success.light" : "action.hover",
                },
              }}
            >
              {copyState === "copying" ? "Copying..." : copyState === "copied" ? "Copied!" : "Share Offer"}
            </Button>
            {userRole !== "partner" && (
              <Button variant="contained" sx={{ borderRadius: 3, fontWeight: 600 }}>
                Apply Now
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>

      {/* Edit Dialog */}
      {userRole === "admin" && selectedOffer && (
        <CreateOfferDialog open={openEdit} onClose={() => setOpenEdit(false)} editOffer={selectedOffer} />
      )}
    </>
  )
}

export default OfferDetailsDialog
