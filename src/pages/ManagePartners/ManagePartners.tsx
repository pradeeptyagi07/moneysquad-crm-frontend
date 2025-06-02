"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import PartnersTable from "./components/PartnersTable";
import PartnerEditRequestsTable from "./components/PartnerEditRequestsTable";
import PartnerStats from "./components/PartnerStats";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";

import { fetchAllPartners } from "../../store/slices/managePartnerSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`partner-tabpanel-${index}`}
      aria-labelledby={`partner-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => ({
  id: `partner-tab-${index}`,
  "aria-controls": `partner-tabpanel-${index}`,
});

const ManagePartners: React.FC = () => {
  const dispatch = useAppDispatch();
  const managePartnersState =
    useAppSelector((state) => state.managePartners) || {};
  const { partners: apiPartners = [], loading = false } = managePartnersState;

  const [tabValue, setTabValue] = useState(0);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    dispatch(fetchAllPartners());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPartners(apiPartners);
  }, [apiPartners]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterPartners(query, statusFilter);
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    filterPartners(searchQuery, status);
  };

  const filterPartners = (
    query: string,
    status: "all" | "active" | "inactive"
  ) => {
    let filtered = apiPartners;

    if (query) {
      filtered = filtered.filter((partner) => {
        const fullName = partner?.basicInfo?.fullName?.toLowerCase() || "";
        const email = partner?.basicInfo?.email?.toLowerCase() || "";
        const mobile = partner?.basicInfo?.mobile || "";
        const partnerId = partner?.partnerId?.toLowerCase() || "";
        return (
          fullName.includes(query) ||
          email.includes(query) ||
          mobile.includes(query) ||
          partnerId.includes(query)
        );
      });
    }

    if (status !== "all") {
      filtered = filtered.filter((partner) => partner.status === status);
    }

    setFilteredPartners(filtered);
  };

  useEffect(() => {
    console.log("Fetched API Partners:", apiPartners);
    setFilteredPartners(apiPartners);
  }, [apiPartners]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Partner Management
        </Typography>
      </Box>

      <PartnerStats partners={apiPartners} />

      <Paper sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="partner management tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                px: 4,
              },
            }}
          >
            <Tab label="All Partners" {...a11yProps(0)} />
            <Tab label="Edit Requests" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {(["all", "active", "inactive"] as const).map((status) => (
                  <Chip
                    key={status}
                    label={status[0].toUpperCase() + status.slice(1)}
                    variant={statusFilter === status ? "filled" : "outlined"}
                    onClick={() => handleStatusFilter(status)}
                    sx={{
                      fontWeight: 600,
                      backgroundColor:
                        statusFilter === status
                          ? "primary.main"
                          : "transparent",
                      color: statusFilter === status ? "white" : "text.primary",
                      "&:hover": {
                        backgroundColor:
                          statusFilter === status
                            ? "primary.dark"
                            : "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  />
                ))}
              </Box>
              <TextField
                placeholder="Search partners..."
                size="small"
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
                sx={{ width: 300 }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />
            <PartnersTable partners={filteredPartners} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PartnerEditRequestsTable partners={apiPartners} />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManagePartners;
