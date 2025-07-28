// src/components/Leads/LeadsActionMenu.tsx
"use client";

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
  rowData: any; // Pass entire row data instead of individual props
}

const LeadsActionMenu: React.FC<LeadsActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onSelectAction,
  userRole,
  rowData,
}) => {
  const theme = useTheme();

  // Extract values from rowData
  const currentStatus = rowData?.status || "";
  const currentStatusUpdatedAt = rowData?.lastUpdate;
  const disbursedData = rowData?.disbursedData;
  const lenderType = rowData?.lenderName; // Check if lender name exists

  // Enhanced debugging
  console.log("=== LEADS ACTION MENU DEBUG ===");
  console.log("🔍 Raw rowData:", rowData);
  console.log("👤 userRole:", userRole);
  console.log("🏢 lenderType:", lenderType, "(type:", typeof lenderType, ")");
  console.log(
    "📊 currentStatus:",
    currentStatus,
    "(type:",
    typeof currentStatus,
    ")"
  );
  console.log("💰 disbursedData:", disbursedData);
  console.log("⏰ currentStatusUpdatedAt:", currentStatusUpdatedAt);

  // Check for null/undefined variations
  console.log("🔍 lenderType === null:", lenderType === null);
  console.log("🔍 lenderType === undefined:", lenderType === undefined);
  console.log("🔍 lenderType == null:", lenderType == null);
  console.log("🔍 Boolean(lenderType):", Boolean(lenderType));
  console.log(
    "🔍 lenderType length (if string):",
    typeof lenderType === "string" ? lenderType.length : "N/A"
  );

  const now = new Date();
  const updatedAt = currentStatusUpdatedAt
    ? new Date(currentStatusUpdatedAt)
    : null;
  const daysSince = updatedAt
    ? (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  // Base set of all possible actions
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

  console.log(
    "📋 Initial items:",
    items.map((i) => i.label)
  );

  //
  //——— Common filters for Admin and Manager ———
  //

  // CONDITION 1: Hide status if lenderType is null/undefined/empty for ADMIN and MANAGER
  const shouldHideStatusForNullLender =
    (!lenderType || lenderType.trim() === "") &&
    (userRole === "admin" || userRole === "manager");
  console.log(
    "🚫 Condition 1 - Hide status for null/empty lenderType:",
    shouldHideStatusForNullLender
  );

  if (shouldHideStatusForNullLender) {
    console.log("❌ REMOVING STATUS: lenderType is null for admin/manager");
    items = items.filter((i) => i.label !== "status");
    console.log(
      "📋 Items after lenderType filter:",
      items.map((i) => i.label)
    );
  }

  // CONDITION 2: if it's a brand-new, closed or expired deal, you also can't change status
  const restrictedStatuses = ["new lead", "closed", "expired"];
  const shouldHideStatusForRestrictedStatus =
    restrictedStatuses.includes(currentStatus);
  console.log(
    "🚫 Condition 2 - Hide status for restricted statuses:",
    shouldHideStatusForRestrictedStatus
  );
  console.log(
    "🔍 Current status in restricted list:",
    currentStatus,
    "->",
    restrictedStatuses.includes(currentStatus)
  );

  if (shouldHideStatusForRestrictedStatus) {
    console.log(
      "❌ REMOVING STATUS: currentStatus is in restricted list:",
      currentStatus
    );
    items = items.filter((i) => i.label !== "status");
    console.log(
      "📋 Items after restricted status filter:",
      items.map((i) => i.label)
    );
  }

  //
  //——— Admin specific rules ———
  //
  if (userRole === "admin") {
    console.log("👑 Processing ADMIN rules");

    // admin never sees "disbursement" until it's been disbursed (i.e. status===disbursed)
    const shouldHideDisbursementForAdmin = currentStatus !== "disbursed";
    console.log(
      "🚫 Admin - Hide disbursement (status not disbursed):",
      shouldHideDisbursementForAdmin
    );

    if (shouldHideDisbursementForAdmin) {
      console.log("❌ ADMIN: REMOVING DISBURSEMENT: status is not 'disbursed'");
      items = items.filter((i) => i.label !== "disbursement");
      console.log(
        "📋 Items after admin disbursement filter:",
        items.map((i) => i.label)
      );
    }
  }

  //
  //——— Manager specific rules ———
  //
  if (userRole === "manager") {
    console.log("👔 Processing MANAGER rules");

    // no delete or assign
    console.log("❌ MANAGER: REMOVING delete and assign");
    items = items.filter((i) => i.label !== "delete" && i.label !== "assign");
    console.log(
      "📋 Items after manager delete/assign filter:",
      items.map((i) => i.label)
    );

    // Manager should only see disbursement when status is disbursed AND disbursedData is null
    // If disbursedData exists, manager should never see disbursement option
    const disbursedExists = disbursedData != null;

    const shouldHideDisbursementForManager =
      currentStatus !== "disbursed" || disbursedExists;
    console.log(
      "🚫 Manager - Hide disbursement (status not disbursed OR disbursedData exists):",
      shouldHideDisbursementForManager
    );
    console.log("🔍 disbursedData exists:", disbursedData !== null);

    if (shouldHideDisbursementForManager) {
      console.log(
        "❌ MANAGER: REMOVING DISBURSEMENT: status is not 'disbursed'"
      );
      items = items.filter((i) => i.label !== "disbursement");
      console.log(
        "📋 Items after manager disbursement filter:",
        items.map((i) => i.label)
      );
    }

    // CONDITION 3: once disbursed, you can no longer change status
    const shouldHideStatusForDisbursed = currentStatus === "disbursed";
    console.log(
      "🚫 Condition 3 - Manager hide status for disbursed:",
      shouldHideStatusForDisbursed
    );

    if (shouldHideStatusForDisbursed) {
      console.log("❌ MANAGER: REMOVING STATUS: currentStatus is 'disbursed'");
      items = items.filter((i) => i.label !== "status");
      console.log(
        "📋 Items after manager disbursed status filter:",
        items.map((i) => i.label)
      );
    }

    // only allow edit if it's still pending and <=30 days old
    const shouldHideEditForManager =
      currentStatus !== "pending" || daysSince > 30;
    console.log(
      "🚫 Manager - Hide edit (not pending or >30 days):",
      shouldHideEditForManager
    );
    console.log("🔍 Status is pending:", currentStatus === "pending");
    console.log("🔍 Days since update:", daysSince);

    if (shouldHideEditForManager) {
      console.log("❌ MANAGER: REMOVING EDIT: not pending or >30 days old");
      items = items.filter((i) => i.label !== "edit");
      console.log(
        "📋 Items after manager edit filter:",
        items.map((i) => i.label)
      );
    }
  }

  //
  //——— Partner & Associate specific rules ———
  //
  if (userRole === "partner" || userRole === "associate") {
    console.log("🤝 Processing PARTNER/ASSOCIATE rules");

    // Remove these options for partners and associates (status is NEVER available for them)
    console.log(
      "❌ PARTNER/ASSOCIATE: REMOVING duplicate, assign, status, disbursement"
    );
    items = items.filter(
      (i) =>
        !["duplicate", "assign", "status", "disbursement"].includes(i.label)
    );
    console.log(
      "📋 Items after partner/associate filter:",
      items.map((i) => i.label)
    );

    // Only allow edit/delete for new leads
    const shouldHideEditDeleteForPartners = currentStatus !== "new lead";
    console.log(
      "🚫 Partner/Associate - Hide edit/delete (not new lead):",
      shouldHideEditDeleteForPartners
    );

    if (shouldHideEditDeleteForPartners) {
      console.log(
        "❌ PARTNER/ASSOCIATE: REMOVING edit/delete: status is not 'new lead'"
      );
      items = items.filter((i) => !["edit", "delete"].includes(i.label));
      console.log(
        "📋 Items after partner/associate edit/delete filter:",
        items.map((i) => i.label)
      );
    }
  }

  // Label mapper
  const getLabel = (label: string) => {
    if (label === "disbursement") {
      // Manager ALWAYS sees plain "Disbursement" (view-only, never edit)
      if (userRole === "manager") return "Disbursement";
      // Others toggle to Edit if data exists
      return disbursedData ? "Edit Disbursement" : "Disbursement";
    }
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  console.log("✅ FINAL RESULT:");
  console.log(
    "📋 Final menu items:",
    items.map((i) => i.label)
  );
  console.log(
    "🎯 Status present in final items:",
    items.some((i) => i.label === "status")
  );
  console.log("=== END DEBUG ===");

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
