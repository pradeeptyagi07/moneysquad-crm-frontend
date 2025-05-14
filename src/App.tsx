import React, { Suspense } from "react"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { Box, CircularProgress } from "@mui/material"
import Layout from "./components/Layout"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

// Lazy load pages
const Overview = React.lazy(() => import("./pages/Overview/Overview"))
const Leads = React.lazy(() => import("./pages/Leads/Leads"))
const Offers = React.lazy(() => import("./pages/Offers/Offers"))
const Commissions = React.lazy(() => import("./pages/Commissions/Commissions"))
const Settings = React.lazy(() => import("./pages/Settings/Settings"))
const Login = React.lazy(() => import("./pages/Auth/Login"))
const BecomePartner = React.lazy(() => import("./pages/Auth/BecomePartner"))

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
    }}
  >
    <CircularProgress />
  </Box>
)

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === "/" || location.pathname.startsWith("/sign-up")

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Suspense fallback={<LoadingFallback />}>
        {isAuthPage ? (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sign-up/become-partner" element={<BecomePartner />} />
          </Routes>
        ) : (
          <Layout>
            <Routes>
              <Route path="/overview" element={<Overview />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/commissions" element={<Commissions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/overview" replace />} />
            </Routes>
          </Layout>
        )}
      </Suspense>
    </LocalizationProvider>
  )
}

export default App
