import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Product {
  type: string;
  interestRate: string;
  processingFees: string;
  loanAmount: string;
  tenure: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: Product[];
  onSave: (updated: Product[]) => void;
}

const EditProductGuideDialog: React.FC<Props> = ({ open, onClose, data, onSave }) => {
  const [formData, setFormData] = useState<Product[]>(data);

  const handleChange = (index: number, key: keyof Product, value: string) => {
    const updated = [...formData];
    updated[index][key] = value;
    setFormData(updated);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>Edit Product Guide</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {formData.map((item, index) => (
          <Box key={index} mb={4}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              {item.type}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Interest Rate"
                  fullWidth
                  value={item.interestRate}
                  onChange={(e) => handleChange(index, "interestRate", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Processing Fees"
                  fullWidth
                  value={item.processingFees}
                  onChange={(e) => handleChange(index, "processingFees", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Loan Amount"
                  fullWidth
                  value={item.loanAmount}
                  onChange={(e) => handleChange(index, "loanAmount", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tenure"
                  fullWidth
                  value={item.tenure}
                  onChange={(e) => handleChange(index, "tenure", e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductGuideDialog;
