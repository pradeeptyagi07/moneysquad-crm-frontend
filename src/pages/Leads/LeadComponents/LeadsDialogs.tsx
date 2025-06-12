// src/components/Leads/LeadsDialogs.tsx

import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import LeadFormDialog, { LeadFormData } from "../leadManagement/formDialog/LeadFormDialog";
import AssignLeadDialog from "../components/AssignLeadDialog";
import StatusUpdateDialog from "../components/StatusUpdateDialog";
import LeadTimelineDialog from "../components/LeadTimelineDialog";
import LeadDetailsDialog from "../components/LeadDetailsDialog";
import DisbursementDialog from "../components/DisbursementDialog";
import LeadDeleteDialog from "../components/LeadDeleteDialog";

interface LeadsDialogsProps {
  formDialogOpen: boolean;
  onFormClose: () => void;
  formMode: "create" | "edit" | "duplicate";
  selectedLead: LeadFormData | null;

  assignOpen: boolean;
  onAssignClose: () => void;

  statusOpen: boolean;
  onStatusClose: () => void;

  timelineOpen: boolean;
  onTimelineClose: () => void;

  detailsOpen: boolean;
  onDetailsClose: () => void;

  disbursementOpen: boolean;
  onDisbursementClose: () => void;

  deleteOpen: boolean;
  onDeleteClose: () => void;

  onRefresh: () => void;
}

const LeadsDialogs: React.FC<LeadsDialogsProps> = ({
  formDialogOpen,
  onFormClose,
  formMode,
  selectedLead,

  assignOpen,
  onAssignClose,

  statusOpen,
  onStatusClose,

  timelineOpen,
  onTimelineClose,

  detailsOpen,
  onDetailsClose,

  disbursementOpen,
  onDisbursementClose,
  apiDisbursementLead,

  deleteOpen,
  onDeleteClose,

  onRefresh,
}) => {
  const { userRole } = useAuth();

  return (
    <>
      <LeadFormDialog
        open={formDialogOpen}
        onClose={onFormClose}
        mode={formMode}
        role={userRole as any}
        selectedLead={selectedLead ?? undefined}
        onSuccess={onRefresh}
      />

      {selectedLead && (
        <AssignLeadDialog
          open={assignOpen}
          onClose={onAssignClose}
          lead={selectedLead}
          onSuccess={onRefresh}
        />
      )}

      {selectedLead && (
        <StatusUpdateDialog
          open={statusOpen}
          onClose={onStatusClose}
          lead={selectedLead}
          onSuccess={onRefresh}
        />
      )}

      {selectedLead && (
        <LeadTimelineDialog
          open={timelineOpen}
          onClose={onTimelineClose}
          lead={selectedLead}
        />
      )}

      {selectedLead && (
        <LeadDetailsDialog
          open={detailsOpen}
          onClose={onDetailsClose}
          leadId={selectedLead.id!}
        />
      )}

      {selectedLead && (
        <DisbursementDialog
          open={disbursementOpen}
          onClose={onDisbursementClose}
          lead={apiDisbursementLead}
        />
      )}

      {selectedLead && (
        <LeadDeleteDialog
          open={deleteOpen}
          onClose={onDeleteClose}
          leadId={selectedLead.id!}
          leadName={selectedLead.applicantName}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

export default LeadsDialogs;
