import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleAccessForm } from "./RoleAccessForm";

interface EditRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleData: any; // We'll type this properly when implementing the edit functionality
}

export const EditRoleDialog = ({ isOpen, onClose, roleData }: EditRoleDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role Permission</DialogTitle>
        </DialogHeader>
        <RoleAccessForm initialData={roleData} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};