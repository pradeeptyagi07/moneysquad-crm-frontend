"use client";

import React, { useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  Edit,
  Block,
  CheckCircle,
  Person,
  Email,
  Phone,
  Save,
  Work,
  Description,
  LocationOn,
  InsertDriveFile,
  Close,
  VerifiedUser,
} from "@mui/icons-material";
import BasicInfoSection from "../components/BasicInfoSection";
import PersonalDetailsSection from "../components/PersonalDetailsSection";
import AddressDetailsSection from "../components/AddressDetailsSection";
import BankDetailsSection from "../components/BankDetailsSection";
import DocumentsSection from "../components/DocumentsSection";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { fetchPartnerById } from "../../../store/slices/managePartnerSlice";
import { updatePartnerById } from "../../../store/slices/managePartnerSlice"; // Import the thunk

interface PartnersTableProps {
  partners: Partner[];
}

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
      id={`partner-detail-tabpanel-${index}`}
      aria-labelledby={`partner-detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `partner-detail-tab-${index}`,
    "aria-controls": `partner-detail-tabpanel-${index}`,
  };
};

const PartnersTable: React.FC<PartnersTableProps> = ({ partners }) => {
  console.log("partners", partners);
  const dispatch = useAppDispatch();

  const partnerDetails = useAppSelector(
    (state) => state.managePartners.selectedPartner
  );

  console.log("partnerDetails in component →", partnerDetails);

  console.log("partners", partners);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPartnerId, setSelectedPartnerId] = React.useState<
    string | null
  >(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState<Partner | null>(
    null
  );
  const [editedPartner, setEditedPartner] = React.useState<Partial<Partner>>(
    {}
  );
  const [tabValue, setTabValue] = React.useState(0);
  const [partnerLeads, setPartnerLeads] = React.useState<any[]>([]);
  const [showDocumentDialog, setShowDocumentDialog] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<{
    title: string;
    url: string;
  } | null>(null);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    partnerId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPartnerId(partnerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPartnerId(null);
  };

  const handleViewDetails = async (partnerId: string) => {
    const partner = partners.find((p) => p.partnerId === partnerId);
    if (partner?._id) {
      console.log("Dispatching fetchPartnerById for:", partner._id);
      setDetailsDialogOpen(true);

      const result = await dispatch(fetchPartnerById(partner._id));
      console.log("Thunk result →", result);
    }
  };



  const handleEditPartner = (partnerId: string) => {
    handleMenuClose();
    const partner = partners.find((p) => p.partnerId === partnerId) || null;
    setSelectedPartner(partner);
  
    if (partner) {
      setEditedPartner({
        email: partner.basicInfo?.email || "",
        fullName: partner.basicInfo?.fullName || "",
        mobileNumber: partner.basicInfo?.mobile || "",
        gender: partner.personalInfo?.gender?.toLowerCase() || "",
        employmentType: partner.personalInfo?.employmentType
          ?.toLowerCase()
          .replace(/\s+/g, "-") || "",
        focusProduct: partner.personalInfo?.focusProduct
          ?.toLowerCase()
          .replace(/\s+/g, "-") || "",
        role: partner.personalInfo?.roleSelection || "",
      });
      setEditDialogOpen(true);
    }
  };
  
  

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedPartner(null);
    setTabValue(0);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditedPartner({});
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setEditedPartner((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditSubmit = async () => {
    if (selectedPartner && selectedPartner._id) {
      const updatePayload = {
        partnerId: selectedPartner._id,
        data: {
          mobile: editedPartner.mobileNumber || "",
          email: editedPartner.email || "",
          fullName: editedPartner.fullName || "",
          gender: editedPartner.gender || "",
          employmentType: editedPartner.employmentType || "",
          focusProduct: editedPartner.focusProduct || "",
          roleSelection: editedPartner.role || "",
        },
      };

      try {
        await dispatch(updatePartnerById(updatePayload)).unwrap();
        setShowSnackbar(true); // ✅ Show success notification
        setEditDialogOpen(false);
      } catch (error) {
        console.error("Failed to update partner:", error);
      }
    }
  };

  const handleViewDocument = (title: string, url: string) => {
    setSelectedDocument({ title, url });
    setShowDocumentDialog(true);
  };

  const handleCloseDocumentDialog = () => {
    setShowDocumentDialog(false);
    setSelectedDocument(null);
  };

  if (partners.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No partners found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Try adjusting your search or filters
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: "none" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Partner</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Registration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Leads</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Joined On</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.partnerId} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={partner.documents.profilePhoto}
                      sx={{ mr: 2, bgcolor: "primary.main" }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {partner.basicInfo.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {partner.partnerId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                    >
                      <Email
                        fontSize="small"
                        sx={{ color: "text.secondary", mr: 1, fontSize: 14 }}
                      />
                      <Typography variant="body2">
                        {partner.basicInfo.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone
                        fontSize="small"
                        sx={{ color: "text.secondary", mr: 1, fontSize: 14 }}
                      />
                      <Typography variant="body2">
                        {partner.basicInfo.mobile}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {partner.basicInfo.registeringAs}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      partner.role === "leadSharing"
                        ? "Lead Sharing"
                        : "File Sharing"
                    }
                    size="small"
                    sx={{
                      bgcolor:
                        partner.role === "leadSharing"
                          ? "primary.lighter"
                          : "secondary.lighter",
                      color:
                        partner.role === "leadSharing"
                          ? "primary.dark"
                          : "secondary.dark",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={
                      partner.status === "active" ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                        <Block fontSize="small" />
                      )
                    }
                    label={partner.status === "active" ? "Active" : "Inactive"}
                    size="small"
                    color={partner.status === "active" ? "success" : "default"}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {partner.leadCount || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(partner.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Actions">
                    <IconButton
                      aria-label="actions"
                      aria-controls={`partner-menu-${partner.partnerId}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, partner.partnerId)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Menu
          id={`partner-menu-${selectedPartnerId}`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              if (selectedPartnerId) {
                handleViewDetails(selectedPartnerId);
                handleMenuClose(); // ✅ close after action
              }
            }}
          >
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (selectedPartnerId) {
                handleEditPartner(selectedPartnerId);
                handleMenuClose(); // ✅ close after action
              }
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Partner</ListItemText>
          </MenuItem>
        </Menu>
      </TableContainer>

      {/* Partner Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Partner Details
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetailsDialog} edge="end">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {partnerDetails && (
            <>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  mb: 4,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={partnerDetails.documents?.profilePhoto}
                        sx={{
                          width: 80,
                          height: 80,
                          mr: 3,
                          bgcolor: "primary.main",
                          border: "3px solid white",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Person sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, mr: 1 }}
                          >
                            {partnerDetails.basicInfo?.fullName}
                          </Typography>
                          <Chip
                            size="small"
                            label={partnerDetails.partnerId}
                            sx={{
                              fontWeight: 600,
                              bgcolor: "primary.lighter",
                              color: "primary.dark",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Email
                            fontSize="small"
                            sx={{ color: "text.secondary", mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {partnerDetails.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Phone
                            fontSize="small"
                            sx={{ color: "text.secondary", mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {partnerDetails.mobile}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "flex-start", md: "flex-end" },
                        height: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Chip
                          icon={
                            partnerDetails.status === "active" ? (
                              <CheckCircle />
                            ) : (
                              <Block />
                            )
                          }
                          label={
                            partnerDetails.status === "active"
                              ? "Active"
                              : "Inactive"
                          }
                          color={
                            partnerDetails.status === "active"
                              ? "success"
                              : "default"
                          }
                          sx={{ fontWeight: 600, mb: 1 }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <VerifiedUser
                            fontSize="small"
                            sx={{ color: "success.main", mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Verified Partner
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Joined on{" "}
                          {new Date(
                            partnerDetails.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: "primary.lighter",
                          color: "primary.dark",
                          mr: 2,
                        }}
                      >
                        <Work />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Registration Type
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {partnerDetails.basicInfo?.registeringAs}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: "secondary.lighter",
                          color: "secondary.dark",
                          mr: 2,
                        }}
                      >
                        <Description />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Partner Role
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {partnerDetails.personalInfo?.roleSelection ===
                          "leadSharing"
                            ? "Lead Sharing"
                            : "File Sharing"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: "success.lighter",
                          color: "success.dark",
                          mr: 2,
                        }}
                      >
                        <LocationOn />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {partnerDetails.addressDetails?.city}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="partner details tabs"
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
                  <Tab label="Profile Details" {...a11yProps(0)} />
                  <Tab label="Documents" {...a11yProps(1)} />
                  <Tab label="Leads" {...a11yProps(2)} />
                  <Tab label="Commission History" {...a11yProps(3)} />
                </Tabs>
              </Box>

              <Box>
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <BasicInfoSection partner={partnerDetails} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <PersonalDetailsSection partner={partnerDetails} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AddressDetailsSection partner={partnerDetails} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <BankDetailsSection partner={partnerDetails} />
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <DocumentsSection
                    partner={partnerDetails}
                    onViewDocument={handleViewDocument}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                      No lead data available for this partner.
                    </Typography>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                      No commission history available
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Commission transactions will appear here
                    </Typography>
                  </Box>
                </TabPanel>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Edit sx={{ mr: 1 }} />
              <Typography variant="h6">Edit Partner Details</Typography>
            </Box>
            <IconButton onClick={handleCloseEditDialog} edge="end">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="fullName"
                value={editedPartner.fullName || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={editedPartner.email || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={editedPartner.mobileNumber || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={editedPartner.gender || ""}
                  label="Gender"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Employment Type</InputLabel>
                <Select
                  name="employmentType"
                  value={editedPartner.employmentType || ""}
                  label="Employment Type"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="salaried">Salaried</MenuItem>
                  <MenuItem value="self-employed">Self-Employed</MenuItem>
                  <MenuItem value="business">Business Owner</MenuItem>
                  <MenuItem value="freelancer">Freelancer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Focus Product</InputLabel>
                <Select
                  name="focusProduct"
                  value={editedPartner.focusProduct || ""}
                  label="Focus Product"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="personal-loan">Personal Loan</MenuItem>
                  <MenuItem value="home-loan">Home Loan</MenuItem>
                  <MenuItem value="business-loan">Business Loan</MenuItem>
                  <MenuItem value="credit-card">Credit Card</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Partner Role</InputLabel>
                <Select
                  name="role"
                  value={editedPartner.role || ""}
                  label="Partner Role"
                  onChange={handleEditChange as any}
                >
                  <MenuItem value="leadSharing">Lead Sharing</MenuItem>
                  <MenuItem value="fileSharing">File Sharing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog
  open={showDocumentDialog}
  onClose={handleCloseDocumentDialog}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">{selectedDocument?.title}</Typography>
      <IconButton onClick={handleCloseDocumentDialog}>
        <Close />
      </IconButton>
    </Box>
  </DialogTitle>
  <DialogContent>
    <Box sx={{ width: "100%", height: "500px", overflow: "auto" }}>
      {selectedDocument?.url ? (
        selectedDocument.url.toLowerCase().endsWith(".pdf") ? (
          <iframe
            src={selectedDocument.url}
            title={selectedDocument.title}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        ) : (
          <img
            src={selectedDocument.url}
            alt={selectedDocument.title}
            style={{ width: "100%", height: "auto" }}
          />
        )
      ) : (
        <Typography>No document selected</Typography>
      )}
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDocumentDialog}>Close</Button>
  </DialogActions>
</Dialog>


      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          variant="outlined"
        >
          Partner details updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PartnersTable;
