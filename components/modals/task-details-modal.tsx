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
import { useProgressStore } from "@/hooks/use-progress-store";
import { Task } from "@prisma/client";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AssigneeDropdown } from "../ui/assignee-dropdown";
import { Textarea } from "../ui/textarea";
import DeleteTaskModal from "./delete-task-modal";


type TaskWithUsers = Task & {
  assignee?: {
    name: string;
    imageUrl: string;
    email: string;
  };
  createdBy?: {
    name: string;
    imageUrl: string;
    email: string;
  };
};

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithUsers;
  profileId:String;
  role:String;
  refetch: () => void;
  
}

const TaskDetailModal = ({ isOpen, onClose, task,refetch,profileId,role }: TaskDetailModalProps) => {
  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [columnData, setColumnData] = useState<{name:String,id:Number}[]>([]);
  const [membersData, setMembersData] = useState([]);
  const [description, setDescription] = useState(task.description || "");
  const [selectedStatus, setSelectedStatus] = useState<number | null>(task.columnId);
  const [taskAssigneeId, setTaskAssigneeId] = useState<string | null>(task.assigneeId|| null);
  const { setChannelProgress,setOverallProgress } = useProgressStore.getState();
  const [loading, setLoading] = useState(false);
  const path=usePathname()


  const channelId = path?.split("/").pop()??"";

  const serverId = path?.split("/")[2];


  useEffect(()=>{
    setLoading(true);
    try {
      const fetchCol=async()=>{
          const res=await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/${channelId}/columns/all`);

          setColumnData(res.data.column);
      }

      const fetchMembers=async()=>{

        const res=await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${serverId}/members/all`);


        setMembersData(res.data.members);
    }

      fetchCol();
      fetchMembers()
    } catch (err) {
      console.error("Failed to getting columns data:", err);
    } finally {
      setLoading(false);
    }   
  },[])
  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${task.id}/change`, {
        title:title,
        description:description,
      });



      // Update status if changed
    if (selectedStatus !== task.columnId) {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${task.id}/status`, {
        columnId: selectedStatus,
      });
    }


    if (taskAssigneeId && taskAssigneeId !== task.assigneeId) {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${task.id}/assignee`, {
        assigneeId: taskAssigneeId,
      });
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/channel/progress?channelId=${channelId}`)
    setChannelProgress(channelId, res.data.progress);

    const overAllRes = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/overall/progress?serverId=${serverId}`)
    setOverallProgress(overAllRes.data.overallProgress);
    
    localStorage.setItem("channelProgress",JSON.stringify(res.data.progress))
    localStorage.setItem("overallProgress",JSON.stringify(overAllRes.data.overallProgress))

      setIsEditing(false);
      refetch()
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setLoading(false);
    }
  };

  const status = columnData.find((ele) => ele.id === task.columnId)?.name;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#1f1f1f] text-black dark:text-white p-0 overflow-hidden rounded-xl shadow-lg max-w-xl w-full">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Task Details
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            All the info about this task
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 text-sm">
          <div className="space-y-2">
            <div>
              <strong>Title:</strong>
              {isEditing ? (
                <Input
                  className="mt-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              ) : (
                <p>{title}</p>
              )}
            </div>
            <div>
              <strong>Description:</strong>
              {isEditing ? (
                <Textarea
                  className="mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <p>{description || "—"}</p>
              )}
            </div>
            <div className="flex jsutify-center items-center gap-2 w-full">

              <strong>Status:</strong>{isEditing ? (
                <select
                  className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  value={selectedStatus ?? ""}
                  onChange={(e) => setSelectedStatus(Number(e.target.value))}
                >
                  {columnData.map((col) => (
                    <option key={col.id.toString()} value={col.id.toString()}>
                      {col.name.toString()}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{status || "—"}</p>
              )}
              
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
            <div className="font-semibold">Assignee:</div>
            {isEditing ? (
               <AssigneeDropdown
               membersData={membersData}
               task={task}
               setTaskAssigneeId={setTaskAssigneeId}
               isEditing={isEditing}
             />
            ) : task.assignee ? (
              <div className="flex items-center gap-3">
                <img
                  src={task.assignee.imageUrl}
                  alt="Assignee"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p>{task.assignee.name}</p>
                  <p className="text-xs text-zinc-500">{task.assignee.email}</p>
                </div>
              </div>
            ) : (
              <p>Unassigned</p>
            )
        }
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
            <div className="font-semibold">Created By:</div>
            {task.createdBy ? (
              <div className="flex items-center gap-3">
                <img
                  src={task.createdBy.imageUrl}
                  alt="Creator"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p>{task.createdBy.name}</p>
                  <p className="text-xs text-zinc-500">
                    {task.createdBy.email}
                  </p>
                </div>
              </div>
            ) : (
              <p>—</p>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-300 dark:border-gray-600">
            <p>
              <strong>Created At:</strong> {formatDate(task.createdAt)}
            </p>
            <p>
              <strong>Updated At:</strong> {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>

        <DialogFooter className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex justify-between">
          <Button
            onClick={()=>{
                setIsEditing(false);
                onClose();
              }
            }
            variant="secondary"
            className="hover:bg-blue-700 hover:text-white"
          >
            Close
          </Button>
          {
            (role==="ADMIN" || role==="MODERATOR")&&
              <Button
                onClick={()=>setIsDeleting(true)}
                variant="destructive"
                className="hover:bg-red-700 hover:text-white"
              >
                Delete
              </Button>
          }

          {isDeleting&&<DeleteTaskModal id={task.id} title={task.title} setDelTask={setIsDeleting} refetch={refetch} />}
          {!isEditing ? (
           (role==="ADMIN" || role==="MODERATOR" || task.assigneeId===profileId)&&<Button onClick={() => setIsEditing(true)} >
              Edit
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
