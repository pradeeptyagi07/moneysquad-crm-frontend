"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Divider,
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  LocalOffer,
  AttachMoney,
  Settings,
  Groups,
  SupervisorAccount,
  Logout,
  HelpOutline,
  MenuBook,
  LibraryBooks,
  GroupWork,
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

const drawerWidth = 260; // Slightly wider for premium feel

interface DashboardMenuItem {
  text: string;
  icon: string;
  path: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: DashboardMenuItem[];
  userRole?: string;
  userName?: string;
}

const DashboardLayout = ({
  children,
  menuItems,
  userRole: propUserRole,
  userName: propUserName,
}: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const dispatch = useAppDispatch();

  // Fetch full user data (to get display IDs)
  const userData = useAppSelector(selectUserData);
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // Determine display ID based on user type
  // Determine display ID based on user type
  let displayId: string | null = null;
  if (isManagerUser(userData)) {
    displayId = userData.managerId;
  } else if (isPartnerUser(userData)) {
    displayId = userData.partnerId;
  } else if (isAssociateUser(userData)) {
    displayId = userData.associateDisplayId;
  }

  // Get user name from props or auth fallback
  const auth = useAppSelector((state) => state.auth);
  let userName = propUserName || "";
  if (!userName && auth.user) {
    if (auth.user.firstName || auth.user.lastName) {
      userName = `${auth.user.firstName || ""} ${
        auth.user.lastName || ""
      }`.trim();
    } else if ((auth as any).user?.basicInfo?.fullName) {
      userName = (auth as any).user.basicInfo.fullName;
    }
  }

  // Determine user role string
  const userRole = propUserRole || auth.userRole || "";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Dashboard":
        return <Dashboard />;
      case "People":
        return <People />;
      case "LocalOffer":
        return <LocalOffer />;
      case "AttachMoney":
        return <AttachMoney />;
      case "Settings":
        return <Settings />;
      case "Groups":
        return <Groups />;
      case "SupervisorAccount":
        return <SupervisorAccount />;
      case "Help":
        return <HelpOutline />;
      case "TrainingResources":
        return <LibraryBooks />;
      case "PartnerManagement":
        return <GroupWork />;
      default:
        return <Dashboard />;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const avatarText =
    userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : "U";

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
      {/* Logo Section */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
          px: 2,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          },
        }}
      >
        <Box
          component="img"
          src="/images/MoneySquad-logo.png"
          alt="MoneySquad Logo"
          sx={{
            height: { xs: 35, sm: 45, md: 50 },
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
            },
          }}
        />
      </Toolbar>

      {/* Navigation */}
      <List
        sx={{ flexGrow: 1, px: 2, py: 1, "& .MuiListItem-root": { mb: 0.5 } }}
      >
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  mx: 0,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: active
                    ? "rgba(15, 118, 110, 0.08)"
                    : "transparent",
                  "&::before": active
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "3px",
                        backgroundColor: "#0f766e",
                        borderRadius: "0 2px 2px 0",
                      }
                    : {},
                  "&:hover": {
                    backgroundColor: active
                      ? "rgba(15, 118, 110, 0.12)"
                      : "rgba(15, 118, 110, 0.04)",
                    transform: "translateX(2px)",
                    boxShadow: active
                      ? "0 4px 20px rgba(15, 118, 110, 0.15)"
                      : "0 2px 10px rgba(0, 0, 0, 0.08)",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 44,
                    color: active ? "#0f766e" : "rgba(0, 0, 0, 0.7)",
                    transition: "all 0.3s ease",
                  },
                  "& .MuiListItemText-primary": {
                    fontWeight: active ? 600 : 500,
                    color: active ? "#0f766e" : "rgba(0, 0, 0, 0.87)",
                    fontSize: "0.925rem",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.3s ease",
                      transform: active ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {getIcon(item.icon)}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
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
            </ListItem>
          );
        })}
      </List>

      {/* Profile Section */}
      <Box
        sx={{
          p: 1.5,
          m: 1.5,
          mt: 0,
          borderRadius: 2,
          background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(15, 118, 110, 0.2)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1.5,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              width: 36,
              height: 36,
              fontSize: "1rem",
              fontWeight: 600,
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {avatarText}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "white",
                fontSize: "0.875rem",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.75rem",
                lineHeight: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userRole || "Role"}
            </Typography>
            {displayId && (
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.75rem",
                  lineHeight: 1,
                }}
              >
                ID: {displayId}
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Logout fontSize="small" />}
          onClick={handleLogout}
          fullWidth
          size="small"
          sx={{
            position: "relative",
            zIndex: 1,
            borderColor: "rgba(255, 255, 255, 0.3)",
            color: "white",
            fontWeight: 500,
            textTransform: "none",
            borderRadius: 1.5,
            py: 0.5,
            fontSize: "0.8rem",
            minHeight: 32,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.5)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          mr: 2,
          display: { sm: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          "&:hover": {
            backgroundColor: "#f9fafb",
            transform: "scale(1.05)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "0 0 40px rgba(0, 0, 0, 0.08)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#fafbfc",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
