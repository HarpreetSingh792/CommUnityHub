import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";

interface AssigneeDropdownProp {
  membersData: any[];
  setTaskAssigneeId: Dispatch<SetStateAction<string | null>>;
  isEditing: boolean;
}

export const AssigneeAddTaskDropdown = ({
  membersData,
  setTaskAssigneeId,
  isEditing,
}: AssigneeDropdownProp) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(membersData[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (member: any) => {
    setSelected(member);
    setTaskAssigneeId(member.profile.id); // Send assignee profile id back
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ensure selected + setTaskAssigneeId is initialized
  useEffect(() => {
    if (!selected && membersData.length > 0) {
      setSelected(membersData[0]);
      setTaskAssigneeId(membersData[0].profile.id);
    }
  }, [membersData]);

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <img src={selected?.profile.imageUrl} className="w-8 h-8 rounded-full" />
        <span>{selected?.profile.name}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 w-full flex items-center gap-2 rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
      >
        <img src={selected?.profile.imageUrl} className="w-6 h-6 rounded-full" />
        <span>{selected?.profile.name}</span>
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
          {membersData.map((member) => (
            <li
              key={member.profile.id}
              onClick={() => handleSelect(member)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img src={member.profile.imageUrl} className="w-8 h-8 rounded-full" />
              <span>{member.profile.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
