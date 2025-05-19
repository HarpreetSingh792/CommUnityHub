"use client";

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@prisma/client";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AddTaskModal } from "../modals/add-task-column-modal";
import TaskColumnModal from "../modals/create-task-column-model";
import TaskColumn from "./task-column";
import TaskFilter from "./task-filter";
import { useProgressStore } from "@/hooks/use-progress-store";




// TaskState is a Column with associated tasks
interface TaskState {
  id: number;
  name: string;
  tasks: Task[];
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function TodoBoard({profileId,role}:{ profileId:String,role:String}) {
  const [columns, setColumns] = useState<TaskState[]>([]);
  const [refetch,setRefetch]= useState<Boolean>(false);
  const[isColumnModal,setIsColumnModal] = useState(false)
  const[addTaskModal,setAddTaskModal] = useState(false)
  const { setChannelProgress ,setOverallProgress} = useProgressStore.getState();
  const path = usePathname();
  const channelId = path?.split("/").pop()??"" // Get channel ID from URL
  const serverId = path?.split("/")[2]??""
  useEffect(() => {
    if (!channelId) return;
    const fetch=async()=>{
      try {
        
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/${channelId}`).then((res) => {
          const data: TaskState[] = res.data.data;
          console.log(data);
          setColumns(data);
        });

        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/channel/progress?channelId=${channelId}`)
        setChannelProgress(channelId, res.data.progress);
        
        const overAllRes = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/overall/progress?serverId=${serverId}`)
        setOverallProgress(overAllRes.data.overallProgress);

        localStorage.setItem("channelProgress",JSON.stringify(res.data.progress))
        localStorage.setItem("overallProgress",JSON.stringify(overAllRes.data.overallProgress))

      } catch (error) {
        console.log("Error while reloading initially at todo board ----->",error)
      }
    }

    fetch()
  }, [channelId,refetch]);

const triggerRefetch = () => {
    setRefetch(prev => !prev);
  };
const handleDragEnd = async (event: DragEndEvent) => {
    
    const { active, over } = event;
  
    if (!over || active.id === over.id) return;
  
    const taskId = active.id as string;
    const newColumnId = Number(over.id);

    const task = columns
    .flatMap((col) => col.tasks)
    .find((t) => t.id === taskId);

    if (!task || task.assigneeId !== profileId) return;
  
    setColumns((prevColumns) => {
      let movedTask: Task | null = null;
  
      // Remove task from original column
      const updatedColumns = prevColumns.map((column) => {
        const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
  
        if (taskIndex !== -1) {
          movedTask = column.tasks[taskIndex];
          const updatedTasks = [...column.tasks];
          updatedTasks.splice(taskIndex, 1);
          return { ...column, tasks: updatedTasks };
        }
  
        return column;
      });
  
      // If task was not found, do nothing
      if (!movedTask) return prevColumns;
  
      // Add task to new column
      return updatedColumns.map((column) => {
        if (column.id === newColumnId && movedTask) {
          return {
            ...column,
            tasks: [...column.tasks, { ...movedTask, columnId: newColumnId }],
          };
        }
        return column;
      });
    });
  
    // Persist change to backend
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${taskId}/status`, {
        columnId: newColumnId,
      });


      // for getting the channel progress 
      
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/channel/progress?channelId=${channelId}`)
      setChannelProgress(channelId, res.data.progress);

      const overAllRes = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/overall/progress?serverId=${serverId}`)
        setOverallProgress(overAllRes.data.overallProgress);

        localStorage.setItem("channelProgress",JSON.stringify(res.data.progress))
        localStorage.setItem("overallProgress",JSON.stringify(overAllRes.data.overallProgress))
    } catch (error) {
      console.error("Error updating task columnId:", error);
      // Optional: rollback logic
    }
  };
  
  const closeAddTaskModal = ()=>{
    triggerRefetch()
    setAddTaskModal(false)
  }

  return (
    <>
      <div className="mt-4 px-2 flex justify-start items-center">

      <TaskFilter serverId={serverId} channelId={channelId} setColumns={setColumns} />
       { (role==='ADMIN'||role==='MODERATOR')&& <div className=" flex justify-center items-center w-full gap-4 ">

        <button className="w-36 h-10 p-2 flex justify-center items-center border border-blue-900 rounded-sm text-blue-950 font-semibold dark:border-gray-400 dark:text-gray-300 hover:opacity-70" onClick={()=>setIsColumnModal(true)}>Add Column</button>
        { isColumnModal&&<TaskColumnModal refetch={triggerRefetch} />}
              <button className="w-36 h-10 p-2 flex justify-center items-center border border-blue-900 rounded-sm text-blue-950 font-semibold dark:border-gray-400 dark:text-gray-300 hover:opacity-70" onClick={()=>setAddTaskModal(true)}>Add Task</button>
                <AddTaskModal profileId={profileId} isOpen={addTaskModal} onClose={closeAddTaskModal} />
        </div>}
      </div>
      <div className="flex gap-4 p-4 overflow-auto justify-evenly items-start h-full">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {columns?.map((col) => {
            // Sort tasks within the column by ID (ascending)
            const sortedTasks = [...col.tasks].sort((a, b) => parseInt(a.id)  - parseInt(b.id));


            return (
              <SortableContext
                key={col.id}
                items={sortedTasks.map((t) => t.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <TaskColumn
                  id={col.id}
                  title={col.name}
                  tasks={sortedTasks}
                  profileId={profileId}
                  role={role}
                  refetch={triggerRefetch}
                />
              </SortableContext>
            );
          })}
        </DndContext>
      </div>
    </>
  );
}
