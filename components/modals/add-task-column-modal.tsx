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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AssigneeAddTaskDropdown } from "../ui/add-assignee-task-dropdown";



interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: String; // createdById
}

export const AddTaskModal = ({ isOpen, onClose, profileId }: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState<number | null>(null);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<{ id: number; name: string }[]>([]);
  const [members, setMembers] = useState<any[]>([]); // Replace any with your member type if you have one

  const path = usePathname();
  const channelId = path?.split("/").pop();
  const serverId = path?.split("/")[2];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [colRes, memRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/${channelId}/columns/all`),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${serverId}/members/all`)
        ]);
        setColumns(colRes.data.column);
        setMembers(memRes.data.members);
      } catch (error) {
        console.error("Error fetching column/member data", error);
      }
    };
    if (isOpen) fetchOptions();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!title || !description || !columnId || !assigneeId || !profileId) return;
    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/add`, {
        title,
        description,
        columnId,
        assigneeId,
        createdById: profileId
      });
      onClose();
      setTitle("");
      setDescription("");
      setColumnId(null);
      setAssigneeId(null);
    } catch (err) {
      console.error("Error creating task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#1f1f1f] text-black dark:text-white p-0 overflow-hidden rounded-xl shadow-lg max-w-xl w-full">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl font-bold text-center">Create Task</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">Fill the fields to create a task</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 text-sm">
          <div className="space-y-2">
            <div>
              <label className="font-semibold">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div>
              <label className="font-semibold">Status</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                value={columnId ?? ""}
                onChange={(e) => setColumnId(Number(e.target.value))}
              >
                <option value="">Select Status</option>
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold">Assignee</label>
              <AssigneeAddTaskDropdown
                membersData={members}
                setTaskAssigneeId={setAssigneeId}
                isEditing={true}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-100 dark:bg-gray-800 px-6 py-4">
          <Button onClick={onClose} variant="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !title || !description || !columnId || !assigneeId}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
