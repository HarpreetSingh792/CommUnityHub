"use client";

import { useDroppable } from "@dnd-kit/core";
import { Task } from "@prisma/client";
import { X } from 'lucide-react';
import { useState } from "react";
import DeleteColummnModal from "../modals/delete-column-modal";
import TaskCard from "./task-card";


interface Props {
  id: Number;
  title: string;
  tasks: Task[]|[];
  profileId:String;
  role:String;
  refetch: () => void;
}

export default function TaskColumn({ id, title,tasks,refetch,profileId,role}: Props) {
  const { setNodeRef } = useDroppable({ id:id.toString() });
  const [delColumm,setDelColumn] =useState(false);
 
  
  return (
    <div ref={setNodeRef} className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-3 w-64 min-h-[100%]">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold">{title}</h2>
      { (role==="ADMIN" || role==="MODERATOR")&&<button onClick={()=>setDelColumn(true)} className="w-8 h-8 bg-red-100 rounded-full flex justify-center items-center p-2 border-none outline-none "><X className="text-red-500" /> </button>}
      </div>

      {
        delColumm && <DeleteColummnModal id={id} columnName={title} setDelColumn={setDelColumn} refetch={refetch}/>
      }

      <hr className="mb-4 border-[0.4px] dark:border-white/40 border-gray-400" />
    
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} refetch={refetch} profileId={profileId} role={role} />
      ))}
    </div>
  );
}
