"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

interface DeleteColumnModalProps {
  id: Number;
  columnName: string;
  setDelColumn: Dispatch<SetStateAction<boolean>>;
  refetch:()=>void;
}

const DeleteColumnModal = ({
  id,
  columnName,
  setDelColumn,
  refetch
}: DeleteColumnModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDelColumn(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/${id}`);
      handleClose();
      refetch();
    } catch (error) {
      console.error("Failed to delete column:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Column
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
          Are you sure you want to delete the column{" "}
        <span className="font-semibold text-indigo-500">&quot;{columnName}&quot;</span>?<br />
        This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={loading}
              onClick={handleClose}
              variant="ghost"
              className="outline-none"
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={handleConfirm}
              variant="destructive"
              className="outline-none"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteColumnModal;
