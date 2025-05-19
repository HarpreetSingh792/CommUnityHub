"use client";

import { useDraggable } from "@dnd-kit/core";
import { Task } from "@prisma/client";
import { useRef, useState } from "react";
import TaskDetailModal from "../modals/task-details-modal";

export default function TaskCard({ task ,refetch,profileId,role}: { task: Task, refetch: () => void;profileId:String;role:String;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const [isOpen, setIsOpen] = useState(false);
  const clickStartTime = useRef<number | null>(null);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="border border-white/70">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ ...style, touchAction: "auto" }}
        className="bg-white dark:bg-[#2f2f2f] rounded shadow p-4 mb-2 cursor-pointer flex flex-col gap-2"
        onMouseDown={() => {
          clickStartTime.current = Date.now();
        }}
        onMouseUp={(e) => {
          const now = Date.now();
          if (
            clickStartTime.current &&
            now - clickStartTime.current < 200 // less than 200ms = click
          ) {
            e.stopPropagation();
            setIsOpen(true);
          }
          clickStartTime.current = null;
        }}
      >
        <h3 className="font-semibold text-lg">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {task.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
          <span>{formatDate(task.createdAt)}</span>
          <img
            src={`${(task as any).assignee?.imageUrl}`}
            className="w-8 h-8 rounded-full"
          />
          <span>{(task as any).assignee.name}</span>
        </div>
      </div>

      <TaskDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        task={task}
        refetch={refetch}
        profileId={profileId}
        role={role}
      />
    </div>
  );
}
