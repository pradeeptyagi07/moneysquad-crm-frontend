import type React from "react";
import { Box, Typography } from "@mui/material";
import AdminDashboard from "./components/adminComponents/AdminDashboard";

const AdminOverview: React.FC = () => {
  const isAdminDashboardReady = false; // toggle to true when ready

  return (
    <>
      {isAdminDashboardReady ? (
        <AdminDashboard />
      ) : (
        <Box
          sx={{
            height: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Under Active Development
          </Typography>
          <Box
            sx={{
              display: "flex",
              mt: 2,
              gap: 2,
            }}
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#1976d2",
                  animation: `pulse 1.2s infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </Box>
          {/* Keyframes */}
          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(0.8); opacity: 0.5; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(0.8); opacity: 0.5; }
              }
            `}
          </style>
        </Box>
      )}
</>  );
};

export default AdminOverview;
