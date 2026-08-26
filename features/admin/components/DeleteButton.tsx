"use client";

import { useState } from "react";
import { Button } from "@/features/global/components/Button";
import { deleteEventAction } from "@/features/admin/actions/adminActions";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/features/global/components/ConfirmDialog";

export const DeleteEventButton = ({ id }: { id: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDialogOpen(false);
    const toastId = toast.loading("Menghapus event...");

    const result = await deleteEventAction(id);

    if (result?.success) {
      toast.success(result.message, { id: toastId });
    } else {
      toast.error(result?.error, { id: toastId });
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="danger"
        className="px-3 py-1 text-sm"
      >
        🗑️
      </Button>

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Hapus Event?"
        description="Apakah Anda yakin ingin menghapus event ini? Aksi ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
};