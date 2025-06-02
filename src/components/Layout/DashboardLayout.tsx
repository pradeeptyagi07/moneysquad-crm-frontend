"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
  ListItemAvatar,
  Button,
} from "@mui/material"
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
} from "@mui/icons-material"
import { useAuth } from "../../hooks/useAuth"
import { useAppSelector } from "../../hooks/useAppSelector"

const drawerWidth = 240

interface DashboardMenuItem {
  text: string
  icon: string
  path: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  menuItems: DashboardMenuItem[]
  userRole?: string
  userName?: string
}

const DashboardLayout = ({
  children,
  menuItems,
  userRole: propUserRole,
  userName: propUserName,
}: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Get user info from Redux state, fallback to props for backward compatibility
  const auth = useAppSelector((state) => state.auth)

  // Get user name from either the user object or the userName property
  let userName = propUserName || ""
  if (!userName && auth.user) {
    if (auth.user.firstName || auth.user.lastName) {
      userName = `${auth.user.firstName || ""} ${auth.user.lastName || ""}`.trim()
    } else if ((auth as any).user?.basicInfo?.fullName) {
      userName = (auth as any).user.basicInfo.fullName
    }
  }
  

  // Get user role
  const userRole = propUserRole || auth.userRole || ""

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Dashboard":
        return <Dashboard />
      case "People":
        return <People />
      case "LocalOffer":
        return <LocalOffer />
      case "AttachMoney":
        return <AttachMoney />
      case "Settings":
        return <Settings />
      case "Groups":
        return <Groups />
      case "SupervisorAccount":
        return <SupervisorAccount />
      default:
        return <Dashboard />
    }
  }

  // Get the first character for the avatar, safely
  const avatarText = userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : "U"

  const drawer = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "#0f766e" }}>
          Money Squad
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path)
                setMobileOpen(false)
              }}
            >
              <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItem sx={{ px: 0 }}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "#0f766e" }}>{avatarText}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={userName || "User"}
            secondary={userRole || "Role"}
            primaryTypographyProps={{ fontWeight: "medium" }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </ListItem>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Logout fontSize="small" />}
          onClick={handleLogout}
          fullWidth
          sx={{ mt: 1 }}
        >
          Logout
        </Button>
      </Box>
    </div>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: "none" }, position: "fixed", top: 10, left: 10, zIndex: 1100 }}
      >
        <MenuIcon />
      </IconButton>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
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
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default DashboardLayout
