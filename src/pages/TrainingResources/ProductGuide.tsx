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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const initialGuide = [
  ["PL -- Term Loan", "10.5% - 18%", "4999 - 1%", "₹1L - ₹1Cr", "1-8 years"],
  ["PL -- Overdraft", "13.5% - 16%", "1% - 2%", "₹1L - ₹1Cr", "1-8 years"],
  ["BL -- Term Loan", "14% - 24%", "1% - 2%", "₹5L - ₹5Cr", "1-5 years"],
  ["BL -- Overdraft", "15% - 19%", "1.5% - 2%", "₹10L - ₹3Cr", "1-5 years"],
  ["SEP -- Term Loan", "10.5% - 14%", "9999 - 2%", "₹5L - ₹3Cr", "1-5 years"],
  ["SEP -- Overdraft", "11.5% - 15%", "1% - 2%", "₹5L - ₹2Cr", "1-5 years"],
];

const ProductGuide = () => {
  const [open, setOpen] = useState(false);
  const [guide, setGuide] = useState(initialGuide);
  const [temp, setTemp] = useState(initialGuide);

  const handleSave = () => {
    setGuide(temp);
    setOpen(false);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Product Guide
          <IconButton onClick={() => setOpen(true)} sx={{ float: "right" }}>
            <EditIcon />
          </IconButton>
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loan Type</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Processing Fees</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Tenure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guide.map((row, idx) => (
              <TableRow key={idx}>
                {row.map((cell, i) => (
                  <TableCell key={i}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Product Guide</DialogTitle>
          <DialogContent>
            {temp.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {row.map((value, colIndex) => (
                  <input
                    key={colIndex}
                    value={value}
                    onChange={(e) => {
                      const updated = [...temp];
                      updated[rowIndex][colIndex] = e.target.value;
                      setTemp(updated);
                    }}
                    style={{ flex: 1, padding: 8 }}
                  />
                ))}
              </div>
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

export default ProductGuide;
