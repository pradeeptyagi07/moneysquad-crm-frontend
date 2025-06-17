import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const Disclaimer = () => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Disclaimer
        </Typography>
        <Typography>
          Documents marked with * are mandatory to process the loan application.
          Other documents can be required for higher loan amounts, big ticket
          profiles or on a specific lender query.
        </Typography>
        <Typography sx={{ mt: 1 }}>
          For any other profiles like HUFs, Trusts, and other special profiles –
          kindly contact the support team or your relationship manager.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Disclaimer;
