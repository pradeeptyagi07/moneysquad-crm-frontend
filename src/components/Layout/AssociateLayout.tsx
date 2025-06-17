"use client";

import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

const AssociateLayout = () => {
  const { userName } = useAuth();

  const menuItems = [
    { text: "Overview", icon: "Dashboard", path: "/associate/overview" },
    { text: "Leads", icon: "People", path: "/associate/leads" },
    { text: "Offers", icon: "LocalOffer", path: "/associate/offers" },
    { text: "Settings", icon: "Settings", path: "/associate/settings" },
      { text: "Help & Support", icon: "Help", path: "/help-support" }, // ✅ Add this

  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userRole="Associate"
      userName={userName}
    >
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </DashboardLayout>
  );
};

export default AssociateLayout;
