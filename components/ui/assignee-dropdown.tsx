import { Task } from "@prisma/client";
import { useState, useRef, useEffect, Dispatch, SetStateAction, MouseEvent } from "react";


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

interface AssigneeDropdownProp {
    membersData:any;
    setTaskAssigneeId:Dispatch<SetStateAction<string | null>>
  task?: TaskWithUsers;
  isEditing:Boolean
  
}


export const AssigneeDropdown = ({ membersData, task, setTaskAssigneeId, isEditing }:AssigneeDropdownProp) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [selected, setSelected] = useState(
    membersData.find((m:any) => m.profile.id === task?.assigneeId) || membersData[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (member:any) => {
    setSelected(member);
    setTaskAssigneeId(member.profile.id);
    setIsOpen(false);
  };

  //close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <img src={selected.profile.imageUrl} className="w-8 h-8 rounded-full" />
        <span>{selected.profile.name}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 w-full flex items-center gap-2 rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
      >
        <img src={selected.profile.imageUrl} className="w-6 h-6 rounded-full" />
        {selected.profile.name}
        <svg
          className="ml-auto h-4 w-4 transform transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white dark:bg-gray-800 shadow-md">
          {membersData.map((member:any) => (
            <li
              key={member.profile.id}
              onClick={() => handleSelect(member)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img src={member.profile.imageUrl} className="w-10 h-10 rounded-full" />
              {member.profile.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
