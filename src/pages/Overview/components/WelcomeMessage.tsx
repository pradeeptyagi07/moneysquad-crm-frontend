import type React from "react"
import { Box, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store"
import { TrendingUp, EmojiEvents, Dashboard, Groups } from "@mui/icons-material"

const WelcomeMessage: React.FC = () => {
  const userData = useSelector((state: RootState) => state.userData.userData)

  const getWelcomeData = () => {
    if (!userData)
      return {
        name: "User",
        message: "Your performance snapshot — Let's achieve your goals.",
        icon: Dashboard,
      }

    const role = userData.role
    let name = ""
    let message = ""
    let IconComponent = Dashboard

    switch (role) {
      case "partner":
        const partnerData = userData as any
        name = partnerData.basicInfo?.fullName || "Partner"
        message = "Your performance snapshot — Let's grow your disbursals."
        IconComponent = TrendingUp
        break

      case "associate":
        const associateData = userData as any
        name = `${associateData.firstName} ${associateData.lastName}` || "Associate"
        message = "Your performance snapshot — Let's boost your lead conversions."
        IconComponent = EmojiEvents
        break

      case "manager":
        const managerData = userData as any
        name = `${managerData.firstName} ${managerData.lastName}` || "Manager"
        message = "Your assigned lead performance snapshot — Let's drive excellence together."
        IconComponent = Groups
        break

      case "admin":
        const adminData = userData as any
        name = `${adminData.firstName} ${adminData.lastName}` || "Admin"
        message = "Your platform overview — Let's monitor and optimize performance."
        IconComponent = Dashboard
        break

      default:
        name = "User"
        message = "Your performance snapshot — Let's achieve your goals."
        IconComponent = Dashboard
    }

    return { name, message, icon: IconComponent }
  }

  const { name, message, icon: IconComponent } = getWelcomeData()

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {/* Premium Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          background: "linear-gradient(135deg, #12AA9E 0%, #0D8B7F 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 16px rgba(18, 170, 158, 0.3)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <IconComponent
          sx={{
            color: "#fff",
            fontSize: 24,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        />
      </Box>

      {/* Welcome Content */}
      <Box flex={1}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#12AA9E",
            mb: 0.5,
            fontSize: { xs: "1.1rem", sm: "1.3rem" },
            lineHeight: 1.2,
            background: "linear-gradient(135deg, #12AA9E 0%, #0D8B7F 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 4px rgba(18, 170, 158, 0.1)",
          }}
        >
          Welcome back, {name} 🎉
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            fontSize: "0.85rem",
            fontWeight: 500,
            lineHeight: 1.4,
            opacity: 0.9,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  )
}

export default WelcomeMessage
