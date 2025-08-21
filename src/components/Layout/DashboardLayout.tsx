"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
  Typography,
  Avatar,
  Button,
  Tooltip,
  Collapse,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
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
  ChevronLeft,
  Analytics,
} from "@mui/icons-material"
import { useAuth } from "../../hooks/useAuth"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import {
  fetchUserData,
  selectUserData,
  isManagerUser,
  isPartnerUser,
  isAssociateUser,
} from "../../store/slices/userDataSlice"
import { useAppSelector } from "../../hooks/useAppSelector"

// Increased responsive drawer widths for better text visibility
const drawerWidths = {
  xs: 240,
  sm: 240,
  md: 250,
  lg: 285,
  xl: 270,
}

const miniWidth = 64

export interface DashboardMenuItem {
  text: string
  icon: string
  path: string
  children?: DashboardMenuItem[]
}

export interface DashboardLayoutProps {
  children: React.ReactNode
  menuItems: DashboardMenuItem[]
  userRole?: string
  userName?: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  menuItems,
  userRole: propUserRole,
  userName: propUserName,
}) => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"))
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"))
  const isXlUp = useMediaQuery(theme.breakpoints.up("xl"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(true) // Auto-collapse by default
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const dispatch = useAppDispatch()

  // Get responsive drawer width
  const getCurrentDrawerWidth = () => {
    if (isXlUp) return drawerWidths.xl
    if (isLgUp) return drawerWidths.lg
    if (isMdUp) return drawerWidths.md
    return drawerWidths.sm
  }

  const fullWidth = getCurrentDrawerWidth()
  const drawerWidth = isMdUp ? (collapsed ? miniWidth : fullWidth) : fullWidth

  // fetch full user data
  const userData = useAppSelector(selectUserData)
  useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch])

  // determine display ID
  let displayId: string | null = null
  if (isManagerUser(userData)) displayId = userData.managerId
  else if (isPartnerUser(userData)) displayId = userData.partnerId
  else if (isAssociateUser(userData)) displayId = userData.associateDisplayId

  // resolve name & role
  const auth = useAppSelector((s) => (s as any).auth)
  let resolvedName = propUserName || ""
  if (!resolvedName && auth.user) {
    const { firstName, lastName, basicInfo } = auth.user
    resolvedName = [firstName, lastName].filter(Boolean).join(" ") || basicInfo?.fullName || ""
  }
  const resolvedRole = propUserRole || (auth as any).userRole || ""

  const handleDrawerToggle = () => setMobileOpen((open) => !open)
  const handleCollapseToggle = () => setCollapsed((c) => !c)
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Auto-collapse functionality
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    if (collapsed && isMdUp) {
      setCollapsed(false)
    }
  }

  const handleMouseLeave = () => {
    if (isMdUp) {
      const timeout = setTimeout(() => {
        setCollapsed(true)
      }, 300) // 300ms delay before collapsing
      setHoverTimeout(timeout)
    }
  }

  const handleExpandClick = (itemText: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemText) ? prev.filter((item) => item !== itemText) : [...prev, itemText],
    )
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Dashboard":
        return <DashboardIcon />
        case "Analytics":
        return <Analytics />
      case "People":
        return <PeopleIcon />
      case "LocalOffer":
        return <LocalOfferIcon />
      case "AttachMoney":
        return <AttachMoneyIcon />
      case "Settings":
        return <SettingsIcon />
      case "Groups":
        return <GroupsIcon />
      case "SupervisorAccount":
        return <SupervisorAccountIcon />
      case "Help":
        return <HelpOutlineIcon />
      case "TrainingResources":
        return <LibraryBooksIcon />
      case "PartnerManagement":
        return <GroupWorkIcon />
      default:
        return <DashboardIcon />
    }
  }

  const isActive = (path: string) => location.pathname === path
  const avatarText = resolvedName ? resolvedName.charAt(0).toUpperCase() : "U"

  const renderMenuItem = (item: DashboardMenuItem, level = 0) => {
    const active = isActive(item.path)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.text)
    const shouldShowTooltip = collapsed && isMdUp
    const showText = !collapsed || !isMdUp

    return (
      <React.Fragment key={item.text}>
        <ListItem disablePadding>
          <Tooltip title={shouldShowTooltip ? item.text : ""} placement="right" arrow>
            <ListItemButton
              onClick={() => {
                if (hasChildren) {
                  handleExpandClick(item.text)
                } else {
                  navigate(item.path)
                  if (!isMdUp) setMobileOpen(false)
                }
              }}
              sx={{
                justifyContent: collapsed && isMdUp ? "center" : "initial",
                borderRadius: 2,
                mb: 0.5,
                mx: 0,
                ml: level * 2,
                px: collapsed && isMdUp ? 1 : 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                backgroundColor: active ? "rgba(15,118,110,0.08)" : "transparent",
                minHeight: 48,
                "&:hover": {
                  backgroundColor: active ? "rgba(15,118,110,0.12)" : "rgba(15,118,110,0.04)",
                  transform: collapsed && isMdUp ? "none" : "translateX(4px)",
                  boxShadow: active ? "0 4px 20px rgba(15,118,110,0.15)" : "0 2px 10px rgba(0,0,0,0.08)",
                },
                "&:active": {
                  transform: collapsed && isMdUp ? "none" : "translateX(2px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed && isMdUp ? 0 : { xs: 32, sm: 28 },
                  mr: collapsed && isMdUp ? 0 : 1.5,
                  justifyContent: "center",
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
                primary={item.text}
                sx={{
                  display: showText ? "block" : "none",
                  "& .MuiListItemText-primary": {
                    fontWeight: active ? 600 : 500,
                    color: active ? "#0f766e" : "rgba(0,0,0,0.87)",
                    fontSize: { xs: "0.8rem", sm: "0.82rem" },
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
              {hasChildren && showText && (
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
              {active && !(collapsed && isMdUp) && (
                <Box
                  sx={{
                    width: { xs: 4, sm: 5, lg: 6 },
                    height: { xs: 4, sm: 5, lg: 6 },
                    borderRadius: "50%",
                    backgroundColor: "#0f766e",
                    position: "absolute",
                    right: collapsed && isMdUp ? 12 : 16,
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
        {hasChildren && showText && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  const drawer = (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#ffffff",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "1px",
          height: "100%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: { xs: 1.5, sm: 2 },
          px: collapsed && isMdUp ? 1 : 2,
          minHeight: { xs: 56, sm: 60 },
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: collapsed && isMdUp ? "80%" : "60%",
            height: "1px",
            background: "rgba(0,0,0,0.08)",
          },
        }}
      >


        {collapsed && isMdUp ? (
          <Box
            component="img"
            src="/images/MoneySquad_sidebar.png"
            alt="MoneySquad Sidebar"
            sx={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
              display: "block",
              mx: "auto",
              transition: "all 0.3s ease",
            }}
          />
        ) : (
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
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          />
        )}
      </Box>

      <List
        sx={{
          flexGrow: 1,
          px: collapsed && isMdUp ? 1 : { xs: 1.5, sm: 2 },
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
        }}
      >
        {menuItems.map((item) => renderMenuItem(item))}
      </List>

      <Box
        sx={{
          p: collapsed && isMdUp ? 1 : { xs: 1.2, sm: 1.5 },
          m: collapsed && isMdUp ? 0.5 : { xs: 0.8, sm: 1 },
          borderRadius: 2,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          position: "relative",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderColor: "#cbd5e1",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed && isMdUp ? "center" : "flex-start",
            mb: collapsed && isMdUp ? 0 : { xs: 1, sm: 1.2 },
          }}
        >
          <Tooltip title={collapsed && isMdUp ? resolvedName || "User" : ""} placement="right" arrow>
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  bgcolor: "#0f766e",
                  color: "white",
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: 600,
                  mx: collapsed && isMdUp ? "auto" : 0,
                  transition: "all 0.2s ease",
                }}
              >
                {avatarText}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  right: -1,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  border: "2px solid white",
                  display: collapsed && isMdUp ? "none" : "block",
                }}
              />
            </Box>
          </Tooltip>

          {!(collapsed && isMdUp) && (
            <Box sx={{ ml: 1.5, flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  color: "#1e293b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {resolvedName || "User"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 0.1,
                  mt: 0.2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.7rem" },
                    color: "#64748b",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.025em",
                  }}
                >
                  {resolvedRole || "Role"}
                </Typography>

                {displayId && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      color: "#64748b",
                      fontFamily: "ui-monospace, Monaco, 'Cascadia Code', monospace",
                      fontWeight: 400,
                    }}
                  >
                    {displayId}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {!(collapsed && isMdUp) && (
          <Button
            variant="outlined"
            startIcon={<LogoutIcon sx={{ fontSize: "14px !important" }} />}
            onClick={handleLogout}
            fullWidth
            size="small"
            sx={{
              borderColor: "#e2e8f0",
              color: "#0f766e",
              backgroundColor: "#ffffff",
              textTransform: "none",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              py: 0.6,
              fontWeight: 500,
              minHeight: { xs: 28, sm: 32 },
              borderRadius: 1.5,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#0f766e",
                backgroundColor: "#ffffff",
                color: "#0d5a54",
                boxShadow: "0 2px 8px rgba(15, 118, 110, 0.15)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 1px 3px rgba(15, 118, 110, 0.2)",
              },
            }}
          >
            Sign Out
          </Button>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

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

        <Drawer
          variant={isMdUp ? "permanent" : "temporary"}
          open={isMdUp || mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: isMdUp ? drawerWidth : "min(85vw, 300px)",
              border: "none",
              boxShadow: isMdUp ? "0 0 20px rgba(0,0,0,0.06)" : "0 10px 40px rgba(0,0,0,0.12)",
              transition: "width 0.3s ease",
              overflowX: "hidden",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            p: { xs: 1, sm: 1.5, lg: 1 },
            pt: { xs: 4, sm: 1.5, lg: 2 },
            width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            backgroundColor: "#fafbfc",
            minHeight: "100vh",
            transition: "margin 0.3s ease, width 0.3s ease",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
      </Box>
    </>
  )
}

export default DashboardLayout