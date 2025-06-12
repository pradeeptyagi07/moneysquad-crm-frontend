// src/components/Leads/LeadsActionMenu.tsx

import React from "react";
import { Menu, MenuItem, Typography, useTheme } from "@mui/material";
import {
  Visibility,
  Edit,
  FileCopy,
  Assignment,
  History,
  AttachMoney,
  Delete,
} from "@mui/icons-material";

export type UserRoleType = "admin" | "manager" | "partner" | "associate";

interface LeadsActionMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
  userRole: UserRoleType;
  currentStatus: string;
  currentStatusUpdatedAt?: string;
  disbursedData?: any;
}

const LeadsActionMenu: React.FC<LeadsActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onSelectAction,
  userRole,
  currentStatus,
  currentStatusUpdatedAt,
  disbursedData,
}) => {
  const theme = useTheme();
  const now = new Date();
  const updatedAt = currentStatusUpdatedAt
    ? new Date(currentStatusUpdatedAt)
    : null;
  const daysSince = updatedAt
    ? (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  let items = [
    { icon: <Visibility />, label: "view" },
    { icon: <Edit />, label: "edit" },
    { icon: <FileCopy />, label: "duplicate" },
    { icon: <Assignment />, label: "assign" },
    { icon: <Edit />, label: "status" },
    { icon: <History />, label: "timeline" },
    { icon: <AttachMoney />, label: "disbursement" },
    { icon: <Delete />, label: "delete" },
  ];

  // Remove "status" action entirely if already rejected or closed
  if (["rejected", "closed","expired"].includes(currentStatus)) {
    items = items.filter((i) => i.label !== "status");
  }

  // Admin: allow all except disbursement if not yet disbursed
  if (userRole === "admin") {
    if (currentStatus !== "disbursed") {
      items = items.filter((i) => i.label !== "disbursement");
    }
  }

  // Manager: remove delete & assign, then apply disbursement/edit rules
  if (userRole === "manager") {
    items = items.filter((i) => i.label !== "delete" && i.label !== "assign");
    if (currentStatus !== "disbursed") {
      items = items.filter((i) => i.label !== "disbursement");
    }
    if (currentStatus !== "pending" || daysSince > 30) {
      items = items.filter((i) => i.label !== "edit");
    }
  }

  // Partner & Associate:
  // - remove duplicate, assign, status, disbursement
  // - only allow edit & delete WHEN status === "new"
  if (userRole === "partner" || userRole === "associate") {
    items = items.filter(
      (i) =>
        !["duplicate", "assign", "status", "disbursement"].includes(i.label)
    );
    if (currentStatus !== "new lead") {
      items = items.filter((i) => !["edit", "delete"].includes(i.label));
    }
  }

  const getLabel = (label: string) => {
    if (label === "disbursement") {
      return disbursedData ? "Edit Disbursement" : "Disbursement";
    }
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      {items.map(({ icon, label }) => (
        <MenuItem
          key={label}
          onClick={() => {
            onSelectAction(label);
            onClose();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          {React.cloneElement(icon as any, {
            sx: { color: theme.palette.primary.main },
          })}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {getLabel(label)}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default LeadsActionMenu;
