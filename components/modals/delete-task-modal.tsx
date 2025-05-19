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

interface DeleteTaskModalProps {
  id: String;
  title: string;
  setDelTask: Dispatch<SetStateAction<boolean>>;
  refetch:()=>void;
}

const DeleteTaskModal = ({
  id,
  title,
  setDelTask,
  refetch
}: DeleteTaskModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDelTask(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${id}`);
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
            Are you sure you want to delete the task{" "}
            <span className="font-semibold text-indigo-500">"{title}"</span>?<br />
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

export default DeleteTaskModal;
