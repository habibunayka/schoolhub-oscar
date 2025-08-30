import { useState } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import {
  AlertDialogOverlay,
  AlertDialogPortal,
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
    <AlertDialogPrimitive.Root
      open={!!state}
      onOpenChange={(open) => !open && handleClose()}
    >
      <AlertDialogPortal>
        <AlertDialogOverlay className="bg-black/50" />
        <AlertDialogPrimitive.Content
          className="bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation</AlertDialogTitle>
            <AlertDialogDescription>{state?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
    </AlertDialogPrimitive.Root>
  );

  return { confirm, ConfirmDialog };
}
