import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onCancel: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline";
  showFooter?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  children,
  onCancel,
  onConfirm,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  showFooter = true,
}) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      {description && <p>{description}</p>}
      {children}

      {showFooter && (
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : confirmText}
            </Button>
          )}
        </DialogFooter>
      )}
    </DialogContent>
  </Dialog>
);
export default ConfirmDialog;
