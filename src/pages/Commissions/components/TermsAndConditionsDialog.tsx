"use client"

import type React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import { CheckCircle, Close } from "@mui/icons-material"

interface TermsAndConditionsDialogProps {
  open: boolean
  onClose: () => void
  planType: string
  isPartnerView?: boolean
}

const getTermsAndConditions = (planType: string) => {
  const commonTerms = [
    "Backend/Fulfilment to be done by MoneySquad team, Partner to share the lead & documents only.",
    "Commission rates are subject to change based on bank discretion, same will be updated here.",
    "TDS of 2% to be deducted from these Payouts. GST to be 18% additional if same applicable.",
    "Payouts for current month disbursals to be processed by 10-15th of next month.",
    "Any subvention for Rate/PF/Insurance waivers shall be fully deducted from above payouts.",
    "For post-disbursal-cancelled cases, Partner shall reverse the Payout within 7 days of cancellation.",
    "Any disputes must be raised within 60 days of disbursement or within 30 days of Payouts.",
    "For a few lenders, Commission rates may vary based on tenure (short) and tier-2/3/4 locations",
    "Kindly avoid overleveraging the customers to keep the NPAs low. Tell Applicant to pay first 6 EMIs timely.",
    "Partner to be equally responsible for first 6 EMIs. NPA in first 6 months might attract Payout reversal.",
    "Kindly refer the Partner Service Agreement for more details. Reach out to us in case of any concern.",
  ]

  return commonTerms
}

const TermsAndConditionsDialog: React.FC<TermsAndConditionsDialogProps> = ({
  open,
  onClose,
  planType,
  isPartnerView = false,
}) => {
  const terms = getTermsAndConditions(planType)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {isPartnerView ? "Terms & Conditions" : `Terms & Conditions - ${planType.toUpperCase()}`}
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: "auto", p: 1 }}>
          <Close />
        </Button>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {isPartnerView
              ? "Please read and understand the following terms and conditions for your commission plan:"
              : `Please read and understand the following terms and conditions for the ${planType.toUpperCase()} commission plan:`}
          </Typography>
        </Box>

        <List sx={{ py: 0 }}>
          {terms.map((term, index) => (
            <ListItem key={index} sx={{ py: 1, alignItems: "flex-start" }}>
              <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                <CheckCircle color="primary" sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {term}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box mt={3} p={2} sx={{ backgroundColor: "action.hover", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            <strong>Note:</strong> These terms are applicable to your commission plan and are subject to change. For any
            clarifications or concerns, please contact our support team.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary" fullWidth>
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TermsAndConditionsDialog
