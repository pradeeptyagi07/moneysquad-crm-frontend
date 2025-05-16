"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Grid,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material"
import {
  Save,
  Notifications,
  Email,
  Sms,
  Campaign,
  NotificationsActive,
  NotificationsOff,
  MonetizationOn,
  BusinessCenter,
  Update,
  MarkEmailRead,
  MarkEmailUnread,
  Info,
} from "@mui/icons-material"

interface NotificationsSectionProps {
  user?: any
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  user = {
    notifications: {
      email: true,
      sms: false,
      leadUpdates: true,
      commissionPayouts: true,
      partnerRequests: true,
      systemUpdates: false,
      marketingEmails: false,
    },
  },
}) => {
  const [formData, setFormData] = useState({
    emailNotifications: user.notifications?.email || true,
    smsNotifications: user.notifications?.sms || false,
    leadUpdates: user.notifications?.leadUpdates || true,
    commissionPayouts: user.notifications?.commissionPayouts || true,
    partnerRequests: user.notifications?.partnerRequests || true,
    systemUpdates: user.notifications?.systemUpdates || false,
    marketingEmails: user.notifications?.marketingEmails || false,
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    })
  }

  const handleSave = () => {
    console.log("Saving notification preferences:", formData)
    setSnackbar({
      open: true,
      message: "Notification preferences updated successfully!",
      severity: "success",
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  // Sample recent notifications
  const recentNotifications = [
    {
      id: 1,
      type: "leadUpdate",
      title: "New Lead Assigned",
      message: "A new lead has been assigned to you: John Smith",
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "commission",
      title: "Commission Payout",
      message: "You have received a commission payout of ₹15,000",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: true,
    },
    {
      id: 3,
      type: "system",
      title: "System Maintenance",
      message: "The system will be down for maintenance on Sunday, 10 PM to 2 AM",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leadUpdate":
        return <BusinessCenter sx={{ color: "#0369a1" }} />
      case "commission":
        return <MonetizationOn sx={{ color: "#16a34a" }} />
      case "system":
        return <Update sx={{ color: "#7c3aed" }} />
      default:
        return <Notifications sx={{ color: "#0f766e" }} />
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="#0f172a">
          Notification Preferences
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card
            elevation={1}
            sx={{
              borderRadius: 2,
              mb: { xs: 3, md: 0 },
              background: "linear-gradient(145deg, #ffffff, #f9fafb)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#0f172a"
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Notifications sx={{ mr: 1, color: "#0f766e" }} />
                  Notification Channels
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.emailNotifications}
                          onChange={handleChange}
                          name="emailNotifications"
                          color="primary"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#0f766e",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#0f766e",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Email sx={{ mr: 1, fontSize: 20, color: "#64748b" }} />
                          <Typography>Email Notifications</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.smsNotifications}
                          onChange={handleChange}
                          name="smsNotifications"
                          color="primary"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#0f766e",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#0f766e",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Sms sx={{ mr: 1, fontSize: 20, color: "#64748b" }} />
                          <Typography>SMS Notifications</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#0f172a"
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Campaign sx={{ mr: 1, color: "#0f766e" }} />
                  Notification Types
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Receive notifications when leads are assigned, updated, or converted" arrow>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.leadUpdates}
                            onChange={handleChange}
                            name="leadUpdates"
                            color="primary"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#0f766e",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#0f766e",
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography>Lead Updates</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Assignments, status changes
                            </Typography>
                          </Box>
                        }
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Receive notifications about commission calculations and payouts" arrow>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.commissionPayouts}
                            onChange={handleChange}
                            name="commissionPayouts"
                            color="primary"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#0f766e",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#0f766e",
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography>Commission Payouts</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Payment confirmations
                            </Typography>
                          </Box>
                        }
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Receive notifications about partner applications and approvals" arrow>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.partnerRequests}
                            onChange={handleChange}
                            name="partnerRequests"
                            color="primary"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#0f766e",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#0f766e",
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography>Partner Requests</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Applications, approvals
                            </Typography>
                          </Box>
                        }
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Receive notifications about system updates and maintenance" arrow>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.systemUpdates}
                            onChange={handleChange}
                            name="systemUpdates"
                            color="primary"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#0f766e",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#0f766e",
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography>System Updates</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Maintenance, new features
                            </Typography>
                          </Box>
                        }
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={600} color="#0f172a" sx={{ mb: 2 }}>
                  Marketing Communications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.marketingEmails}
                      onChange={handleChange}
                      name="marketingEmails"
                      color="primary"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#0f766e",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#0f766e",
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography>Marketing Emails</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Promotions, newsletters, and product updates
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{
                    backgroundColor: "#0f766e",
                    "&:hover": {
                      backgroundColor: "#0e6660",
                    },
                  }}
                >
                  Save Preferences
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            elevation={1}
            sx={{
              borderRadius: 2,
              background: "linear-gradient(145deg, #ffffff, #f9fafb)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#0f172a"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <NotificationsActive sx={{ mr: 1, color: "#0f766e" }} />
                  Recent Notifications
                </Typography>
                <Chip
                  label="2 Unread"
                  size="small"
                  sx={{
                    bgcolor: "rgba(15, 118, 110, 0.1)",
                    color: "#0f766e",
                    fontWeight: 500,
                  }}
                />
              </Box>

              {recentNotifications.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentNotifications.map((notification) => (
                    <ListItem
                      key={notification.id}
                      alignItems="flex-start"
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: notification.read ? "transparent" : "rgba(15, 118, 110, 0.05)",
                        border: "1px solid",
                        borderColor: notification.read ? "transparent" : "rgba(15, 118, 110, 0.1)",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: "#0f766e",
                                  ml: 1,
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                              {new Date(notification.date).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={notification.read ? "Mark as unread" : "Mark as read"}>
                          <IconButton edge="end" size="small">
                            {notification.read ? (
                              <MarkEmailUnread fontSize="small" />
                            ) : (
                              <MarkEmailRead fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                  <NotificationsOff sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }} />
                  <Typography color="#64748b">No recent notifications</Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "#0f766e",
                    color: "#0f766e",
                    "&:hover": {
                      borderColor: "#0e6660",
                      backgroundColor: "rgba(15, 118, 110, 0.04)",
                    },
                  }}
                >
                  View All Notifications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert
        severity="info"
        icon={<Info />}
        sx={{
          mt: 3,
          borderRadius: 2,
          backgroundColor: "rgba(3, 105, 161, 0.08)",
          color: "#0369a1",
          "& .MuiAlert-icon": {
            color: "#0369a1",
          },
        }}
      >
        <Typography variant="body2">
          You can also manage notification preferences for specific leads and partners from their respective detail
          pages.
        </Typography>
      </Alert>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default NotificationsSection
