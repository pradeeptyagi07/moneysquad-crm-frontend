"use client"

import React from "react"
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  
} from "@mui/material"
import { useAuth } from "../../../hooks/useAuth"

const FiltersBar: React.FC = () => {
  const { userRole } = useAuth()
  const isAdmin = userRole === "admin"
  const isPartner = userRole === "partner"

  return (
    <Box mb={2} px={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Month</InputLabel>
            <Select value="jun25" label="Month">
              <MenuItem value="jun25">Jun'25</MenuItem>
              <MenuItem value="may25">May'25</MenuItem>
              <MenuItem value="apr25">Apr'25</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Payout Status</InputLabel>
            <Select value="all" label="Payout Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Lender</InputLabel>
            <Select value="all" label="Lender">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="axis">AXIS BANK</MenuItem>
              <MenuItem value="hdfc">HDFC</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {isAdmin && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Partner</InputLabel>
              <Select value="all" label="Partner">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="p1">Ravi Patel</MenuItem>
                <MenuItem value="p2">Nidhi Sharma</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {isPartner && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Associate</InputLabel>
              <Select value="all" label="Associate">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="a1">Amit Chauhan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default FiltersBar
