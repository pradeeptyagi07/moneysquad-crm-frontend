"use client"

import React from "react"
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material"

interface GridRow {
  lenderName: string
  termLoan: string
  overdraft: string
  remarks?: string
}

interface Props {
  data: GridRow[]
  title?: string
}

const CommissionRateTable: React.FC<Props> = ({ data, title }) => {
  return (
    <Box>
      {title && (
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          {title}
        </Typography>
      )}
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
              <TableCell>Lender Name</TableCell>
              <TableCell>Term Loan %</TableCell>
              <TableCell>Overdraft %</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell>{row.lenderName}</TableCell>
                <TableCell>{row.termLoan}%</TableCell>
                <TableCell>{row.overdraft}%</TableCell>
                <TableCell>{row.remarks || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CommissionRateTable
