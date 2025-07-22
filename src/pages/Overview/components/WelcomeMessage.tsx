import type React from "react"
import { Box, Typography, Card, styled } from "@mui/material"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { AdminPanelSettings, Dashboard, TrendingUp, People, Assignment } from "@mui/icons-material"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  marginBottom: 24,
}))

const WelcomeMessage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const userData = useAppSelector((state) => state.userData.userData)

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getUserName = () => {
    if (userData) {
      // Check for partner user type
      if (userData.role === "partner" && userData.basicInfo?.fullName) {
        return userData.basicInfo.fullName
      }

      // Check for admin, manager, associate user types
      if (
        (userData.role === "admin" || userData.role === "manager" || userData.role === "associate") &&
        userData.firstName &&
        userData.lastName
      ) {
        return `${userData.firstName} ${userData.lastName}`
      }

      // Fallback to other possible name fields
      if (userData.fullName) {
        return userData.fullName
      }
      if (userData.name) {
        return userData.name
      }
    }

    // Fallback to user from auth state
    if (user?.name) {
      return user.name
    }

    // Default fallback
    return "User"
  }

  const getRoleBasedMessage = () => {
    const role = user?.role?.toLowerCase() || userData?.role?.toLowerCase() || ""

    switch (role) {
      case "admin":
        return "Command Center Active — Monitor and optimize platform performance."
      case "partner":
        return "Your performance snapshot — Let's grow your disbursals."
      case "manager":
        return "Team performance overview — Drive success and mentor your team."
      case "associate":
        return "Your daily dashboard — Track leads and achieve your targets."
      default:
        return "Welcome back to your dashboard"
    }
  }

  const getRoleIcon = () => {
    const role = user?.role?.toLowerCase() || userData?.role?.toLowerCase() || ""

    switch (role) {
      case "admin":
        return AdminPanelSettings
      case "partner":
        return TrendingUp
      case "manager":
        return People
      case "associate":
        return Assignment
      default:
        return Dashboard
    }
  }

  const getRoleGradient = () => {
    const role = user?.role?.toLowerCase() || userData?.role?.toLowerCase() || ""

    switch (role) {
      case "admin":
        return "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
      case "partner":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      case "manager":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      case "associate":
        return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  }

  const getRoleEmoji = () => {
    const role = user?.role?.toLowerCase() || userData?.role?.toLowerCase() || ""

    switch (role) {
      case "admin":
        return "👑"
      case "partner":
        return "🚀"
      case "manager":
        return "👨‍💼"
      case "associate":
        return "💼"
      default:
        return "👋"
    }
  }

  const IconComponent = getRoleIcon()

  return (
    <StyledCard sx={{ p: 3, background: getRoleGradient(), color: "#fff" }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconComponent sx={{ color: "#fff", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {getTimeOfDay()}, {getUserName()}! {getRoleEmoji()}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {getRoleBasedMessage()}
          </Typography>
        </Box>
      </Box>

      
    </StyledCard>
  )
}

export default WelcomeMessage
