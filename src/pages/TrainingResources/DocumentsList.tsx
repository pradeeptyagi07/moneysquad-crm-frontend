import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const initialDocs = {
  "PL - Term Loan/Overdraft": [
    "PAN, Aadhar, Photo (Applicant KYC)*",
    "Latest 3 Payslips",
    "Salary A/C Bank Statement (Last 3 Months)*",
    "Latest Form-16 (optional)",
  ],
  "BL - Proprietorship": [
    "PAN, Aadhar, Photo (Proprietor KYC)*",
    "GST Certificate, Udyam Certificate*",
    "Bank Statement (Last 6 Months)*",
    "Latest E Bill (Proof of Ownership)",
  ],
  "SEP - Doctor": [
    "PAN, Aadhar, Photo (Applicant KYC)*",
    "Doctor Degree Certificate*",
    "Medical Council Certificate*",
    "Hospital/Clinic Address Proof",
    "Bank Statement (Last 6 Months)*",
  ],
};

const DocumentsList = () => {
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState(initialDocs);
  const [temp, setTemp] = useState(initialDocs);

  const handleSave = () => {
    setDocs(temp);
    setOpen(false);
  };

  const handleChange = (category: string, index: number, value: string) => {
    const updated = { ...temp };
    updated[category][index] = value;
    setTemp(updated);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Documents Required
          <IconButton onClick={() => setOpen(true)} sx={{ float: "right" }}>
            <EditIcon />
          </IconButton>
        </Typography>
        {Object.entries(docs).map(([section, items], idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography fontWeight={600}>{section}</Typography>
            <ul style={{ marginLeft: "1rem" }}>
              {items.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </Box>
        ))}

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Documents</DialogTitle>
          <DialogContent>
            {Object.entries(temp).map(([category, list], i) => (
              <Box key={i} sx={{ my: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {category}
                </Typography>
                {list.map((doc, j) => (
                  <TextField
                    key={j}
                    fullWidth
                    sx={{ mb: 1 }}
                    value={doc}
                    onChange={(e) =>
                      handleChange(category, j, e.target.value)
                    }
                  />
                ))}
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
