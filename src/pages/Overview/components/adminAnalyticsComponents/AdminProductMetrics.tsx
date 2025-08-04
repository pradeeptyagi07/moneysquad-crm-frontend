import type React from "react"
import { Card, CardContent, Typography, Box, Grid } from "@mui/material"

interface ProductMetric {
  loanType: string
  shortName: string
  color: string
  leadsVolume: {
    total: number
    unique: number
  }
  approvalRate: number
  disbursalRate: number
  avgTAT: number
  avgTicketSize: number
}

const AdminProductMetrics: React.FC = () => {
  // Mock data - replace with actual API data
  const productMetrics: ProductMetric[] = [
    {
      loanType: "Personal Loan",
      shortName: "PL",
      color: "#3B82F6",
      leadsVolume: { total: 1456, unique: 1234 },
      approvalRate: 68.5,
      disbursalRate: 45.2,
      avgTAT: 7.5,
      avgTicketSize: 285000,
    },
    {
      loanType: "Business Loan",
      shortName: "BL",
      color: "#10B981",
      leadsVolume: { total: 987, unique: 856 },
      approvalRate: 72.3,
      disbursalRate: 52.1,
      avgTAT: 12.3,
      avgTicketSize: 650000,
    },
    {
      loanType: "SEP Loan",
      shortName: "SEP",
      color: "#F59E0B",
      leadsVolume: { total: 654, unique: 598 },
      approvalRate: 75.8,
      disbursalRate: 58.9,
      avgTAT: 5.2,
      avgTicketSize: 125000,
    },
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else {
      return `₹${amount.toLocaleString()}`
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "460px", // Compact fixed height
      }}
    >
      <CardContent sx={{ p: 1, height: "100%" }}>
        {/* Header */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📊 Product Performance
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.75rem" }}>
            Loan type performance metrics
          </Typography>
        </Box>

        {/* Compact Table */}
        <Box sx={{ height: "calc(100% - 50px)", overflow: "hidden" }}>
          {/* Header Row */}
          <Grid container spacing={0.5} sx={{ mb: 1, px: 1 }}>
            <Grid item xs={2}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", fontSize: "0.7rem" }}>
                Product
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#374151", fontSize: "0.7rem", textAlign: "center" }}
              >
                Volume
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#374151", fontSize: "0.7rem", textAlign: "center" }}
              >
                Approval
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#374151", fontSize: "0.7rem", textAlign: "center" }}
              >
                Disbursal
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#374151", fontSize: "0.7rem", textAlign: "center" }}
              >
                Avg TAT
              </Typography>
            </Grid>
            <Grid item xs={2.5}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#374151", fontSize: "0.7rem", textAlign: "center" }}
              >
                Ticket Size
              </Typography>
            </Grid>
          </Grid>

          {/* Data Rows */}
          {productMetrics.map((product, index) => (
            <Card
              key={index}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                border: `1px solid ${product.color}20`,
                backgroundColor: "white",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 3px 8px ${product.color}15`,
                  borderColor: `${product.color}40`,
                },
              }}
            >
              <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                <Grid container spacing={0.5} alignItems="center">
                  {/* Product Name */}
                  <Grid item xs={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: product.color,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#1F2937",
                            fontSize: "0.75rem",
                            lineHeight: 1.1,
                          }}
                        >
                          {product.shortName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6B7280",
                            fontSize: "0.65rem",
                            lineHeight: 1,
                          }}
                        >
                          {product.loanType.split(" ")[0]}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Volume */}
                  <Grid item xs={2}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: product.color,
                          fontSize: "0.8rem",
                          lineHeight: 1.1,
                        }}
                      >
                        {formatNumber(product.leadsVolume.total)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#9CA3AF",
                          fontSize: "0.6rem",
                          lineHeight: 1,
                        }}
                      >
                        {formatNumber(product.leadsVolume.unique)} uniq
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Approval Rate */}
                  <Grid item xs={1.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: product.color,
                        fontSize: "0.8rem",
                        textAlign: "center",
                      }}
                    >
                      {product.approvalRate}%
                    </Typography>
                  </Grid>

                  {/* Disbursal Rate */}
                  <Grid item xs={1.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: product.color,
                        fontSize: "0.8rem",
                        textAlign: "center",
                      }}
                    >
                      {product.disbursalRate}%
                    </Typography>
                  </Grid>

                  {/* Average TAT */}
                  <Grid item xs={1.5}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: product.color,
                          fontSize: "0.8rem",
                          lineHeight: 1.1,
                        }}
                      >
                        {product.avgTAT}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#9CA3AF",
                          fontSize: "0.6rem",
                          lineHeight: 1,
                        }}
                      >
                        days
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Average Ticket Size */}
                  <Grid item xs={2.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: product.color,
                        fontSize: "0.8rem",
                        textAlign: "center",
                      }}
                    >
                      {formatCurrency(product.avgTicketSize)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default AdminProductMetrics
