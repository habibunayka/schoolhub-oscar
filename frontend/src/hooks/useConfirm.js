import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@components/common/ui";

export default function useConfirm() {
  const [state, setState] = useState(null);

  const confirm = (message) =>
    new Promise((resolve) => {
      setState({ message, resolve });
    });

  const handleClose = () => {
    if (state) state.resolve(false);
    setState(null);
  };

  const handleConfirm = () => {
    if (state) state.resolve(true);
    setState(null);
  };

  const ConfirmDialog = () => (
    <AlertDialog open={!!state} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation</AlertDialogTitle>
          <AlertDialogDescription>{state?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmDialog };
}
