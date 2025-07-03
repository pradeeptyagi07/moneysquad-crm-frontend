"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useTheme,
  useMediaQuery,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Tooltip,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalOffer as LocalOfferIcon,
  AttachMoney as AttachMoneyIcon,
  Settings as SettingsIcon,
  Groups as GroupsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  HelpOutline as HelpOutlineIcon,
  LibraryBooks as LibraryBooksIcon,
  GroupWork as GroupWorkIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchUserData,
  selectUserData,
  isManagerUser,
  isPartnerUser,
  isAssociateUser,
} from "../../store/slices/userDataSlice";
import { useAppSelector } from "../../hooks/useAppSelector";
import Footer from "./Footer";

// Responsive drawer widths - optimized for better space utilization
const drawerWidths = {
  xs: 240,
  sm: 240,
  md: 240,
  lg: 260,
  xl: 260,
};

export interface DashboardMenuItem {
  text: string;
  icon: string;
  path: string;
  children?: DashboardMenuItem[];
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: DashboardMenuItem[];
  userRole?: string;
  userName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  menuItems,
  userRole: propUserRole,
  userName: propUserName,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isXlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const dispatch = useAppDispatch();

  // Get responsive drawer width
  const getCurrentDrawerWidth = () => {
    if (isXlUp) return drawerWidths.xl;
    if (isLgUp) return drawerWidths.lg;
    if (isMdUp) return drawerWidths.md;
    return drawerWidths.sm;
  };

  const drawerWidth = getCurrentDrawerWidth();

  // fetch full user data
  const userData = useAppSelector(selectUserData);
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // determine display ID
  let displayId: string | null = null;
  if (isManagerUser(userData)) displayId = userData.managerId;
  else if (isPartnerUser(userData)) displayId = userData.partnerId;
  else if (isAssociateUser(userData)) displayId = userData.associateDisplayId;

  // resolve name & role
  const auth = useAppSelector((s) => (s as any).auth);
  let resolvedName = propUserName || "";
  if (!resolvedName && auth.user) {
    const { firstName, lastName, basicInfo } = auth.user;
    resolvedName =
      [firstName, lastName].filter(Boolean).join(" ") ||
      basicInfo?.fullName ||
      "";
  }
  const resolvedRole = propUserRole || (auth as any).userRole || "";

  const handleDrawerToggle = () => setMobileOpen((open) => !open);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleExpandClick = (itemText: string) => {
    setExpandedItems(prev => 
      prev.includes(itemText) 
        ? prev.filter(item => item !== itemText)
        : [...prev, itemText]
    );
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Dashboard":
        return <DashboardIcon />;
      case "People":
        return <PeopleIcon />;
      case "LocalOffer":
        return <LocalOfferIcon />;
      case "AttachMoney":
        return <AttachMoneyIcon />;
      case "Settings":
        return <SettingsIcon />;
      case "Groups":
        return <GroupsIcon />;
      case "SupervisorAccount":
        return <SupervisorAccountIcon />;
      case "Help":
        return <HelpOutlineIcon />;
      case "TrainingResources":
        return <LibraryBooksIcon />;
      case "PartnerManagement":
        return <GroupWorkIcon />;
      default:
        return <DashboardIcon />;
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const avatarText = resolvedName
    ? resolvedName.charAt(0).toUpperCase()
    : "U";

  // Truncate text with ellipsis for responsive display
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Responsive text lengths - optimized for smaller drawer
  const getMaxTextLength = () => {
    if (isXlUp) return 22;
    if (isLgUp) return 20;
    if (isMdUp) return 18;
    return 22; // Mobile has more space when drawer is full width
  };

  const renderMenuItem = (item: DashboardMenuItem, level: number = 0) => {
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.text);
    const maxTextLength = getMaxTextLength();
    const displayText = truncateText(item.text, maxTextLength);
    const shouldShowTooltip = item.text.length > maxTextLength;

    return (
      <React.Fragment key={item.text}>
        <ListItem disablePadding>
          <Tooltip 
            title={shouldShowTooltip ? item.text : ""} 
            placement="right"
            arrow
          >
            <ListItemButton
              onClick={() => {
                if (hasChildren) {
                  handleExpandClick(item.text);
                } else {
                  navigate(item.path);
                  if (!isMdUp) setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 0,
                ml: level * 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                backgroundColor: active
                  ? "rgba(15,118,110,0.08)"
                  : "transparent",
                minHeight: 48,
                "&:hover": {
                  backgroundColor: active
                    ? "rgba(15,118,110,0.12)"
                    : "rgba(15,118,110,0.04)",
                  transform: "translateX(4px)",
                  boxShadow: active
                    ? "0 4px 20px rgba(15,118,110,0.15)"
                    : "0 2px 10px rgba(0,0,0,0.08)",
                },
                "&:active": {
                  transform: "translateX(2px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: { xs: 36, sm: 40 },
                  color: active ? "#0f766e" : "rgba(0,0,0,0.7)",
                  transition: "all 0.2s",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: active ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.3s",
                  }}
                >
                  {getIcon(item.icon)}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={displayText}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: active ? 600 : 500,
                    color: active ? "#0f766e" : "rgba(0,0,0,0.87)",
                    fontSize: { xs: "0.85rem", sm: "0.875rem" },
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
              {hasChildren && (
                <IconButton
                  size="small"
                  sx={{ 
                    color: active ? "#0f766e" : "rgba(0,0,0,0.54)",
                    minWidth: "auto",
                    p: 0,
                  }}
                >
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
              {active && (
                <Box
                  sx={{
                    width: { xs: 4, sm: 5, lg: 6 },
                    height: { xs: 4, sm: 5, lg: 6 },
                    borderRadius: "50%",
                    backgroundColor: "#0f766e",
                    ml: 1,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.5 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%)",
        },
      }}
    >
      {/* Compact Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 1.5, sm: 2 },
          px: 2,
          minHeight: { xs: 56, sm: 60 },
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "1px",
            background: "rgba(0,0,0,0.08)",
          },
        }}
      >
        <Box
          component="img"
          src="/images/MoneySquad-logo.png"
          alt="MoneySquad Logo"
          sx={{
            height: { xs: 28, sm: 32, md: 36 },
            width: "auto",
            maxWidth: "85%",
            objectFit: "contain",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        />
      </Box>

      {/* Navigation List */}
      <List
        sx={{
          flexGrow: 1,
          px: { xs: 1.5, sm: 2 },
          py: 1,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 24,
            background: "linear-gradient(rgba(248,250,252,0), #f8fafc 90%)",
            pointerEvents: "none",
          },
        }}
      >
        {menuItems.map((item) => renderMenuItem(item))}
      </List>

      {/* Compact Professional Profile Section */}
      <Box
        sx={{
          p: { xs: 1.2, sm: 1.5 },
          m: { xs: 0.8, sm: 1 },
          borderRadius: 2,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          position: "relative",
        }}
      >
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: { xs: 1, sm: 1.2 },
        }}>
          <Avatar
            sx={{
              bgcolor: "#0f766e",
              color: "white",
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(15,118,110,0.2)",
              border: "2px solid white",
            }}
          >
            {avatarText}
          </Avatar>
          <Box sx={{ ml: 1.5, minWidth: 0, flex: 1 }}>
            <Tooltip title={resolvedName || "User"} placement="top">
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.825rem", sm: "0.875rem" },
                  color: "#1e293b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                }}
              >
                {truncateText(resolvedName || "User", 16)}
              </Typography>
            </Tooltip>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
              <Typography
                variant="caption"
                sx={{ 
                  fontSize: { xs: "0.7rem", sm: "0.75rem" }, 
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                {truncateText(resolvedRole || "Role", 10)}
              </Typography>
              {displayId && (
                <>
                  <Box 
                    sx={{ 
                      width: 2, 
                      height: 2, 
                      borderRadius: "50%", 
                      backgroundColor: "#cbd5e1" 
                    }} 
                  />
                  <Typography
                    variant="caption"
                    sx={{ 
                      fontSize: { xs: "0.7rem", sm: "0.75rem" }, 
                      color: "#475569",
                      fontFamily: "monospace",
                      fontWeight: 500,
                    }}
                  >
                    {displayId}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon sx={{ fontSize: "16px !important" }} />}
          onClick={handleLogout}
          fullWidth
          size="small"
          sx={{
            borderColor: "#cbd5e1",
            color: "#475569",
            textTransform: "none",
            fontSize: { xs: "0.75rem", sm: "0.8rem" },
            py: 0.6,
            fontWeight: 500,
            minHeight: { xs: 32, sm: 36 },
            "&:hover": {
              borderColor: "#94a3b8",
              backgroundColor: "rgba(71, 85, 105, 0.04)",
              color: "#334155",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
 <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Mobile Menu Button */}
      {!isMdUp && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: { xs: 12, sm: 16 },
            left: { xs: 12, sm: 16 },
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: "white",
            color: "#0f766e",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            width: { xs: 48, sm: 52 },
            height: { xs: 48, sm: 52 },
            "&:hover": { 
              transform: "scale(1.05)",
              backgroundColor: "#f8fafc",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Responsive Drawer */}
      <Drawer
        variant={isMdUp ? "permanent" : "temporary"}
        open={isMdUp || mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMdUp ? drawerWidth : "min(80vw, 280px)",
            border: "none",
            boxShadow: isMdUp
              ? "0 0 20px rgba(0,0,0,0.06)"
              : "0 10px 40px rgba(0,0,0,0.12)",
            transition: "width 0.2s ease",
          },
        }}
      >
        {drawer}
      </Drawer>
      

      {/* Main Content Area */}
        {/* Main Content Area with sticky footer */}
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        p: { xs: 2, sm: 3, lg: 4 },
        pt: { xs: 8, sm: 3, lg: 4 },
        width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: "#fafbfc",
        minHeight: "100vh",
        transition: "margin 0.3s ease, width 0.3s ease",
      }}
    >
      {/* your page content grows here */}
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* footer will now sit at the bottom */}
    </Box>


    </Box>
    </>
   
    
  );
};

export default DashboardLayout;