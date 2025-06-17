import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";

interface EditCalculationDialogProps {
  open: boolean;
  data: Record<string, string[]>;
  onClose: () => void;
  onSave: (updated: Record<string, string[]>) => void;
}

const EditCalculationDialog: React.FC<EditCalculationDialogProps> = ({
  open,
  data,
  onClose,
  onSave,
}) => {
  const [tempData, setTempData] = React.useState(data);

  const handleChange = (key: string, index: number, value: string) => {
    const updated = { ...tempData };
    updated[key][index] = value;
    setTempData(updated);
  };

  const handleSave = () => {
    onSave(tempData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Eligibility Calculation</DialogTitle>
      <DialogContent>
        {Object.entries(tempData).map(([category, points], i) => (
          <Box key={i} sx={{ mb: 3 }}>
            <Typography fontWeight={600} mb={1}>
              {category}
            </Typography>
            {points.map((point, j) => (
              <TextField
                key={j}
                fullWidth
                sx={{ mb: 1 }}
                value={point}
                onChange={(e) => handleChange(category, j, e.target.value)}
              />
            ))}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCalculationDialog;
