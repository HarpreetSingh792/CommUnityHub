'use client';

import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { Task } from '@prisma/client';

interface Member {
  id: string;
  profileId: string;
  profile: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface TaskFilterProps {
  serverId: String;
  channelId:String
  setColumns:Dispatch<SetStateAction<TaskState[]>>;
}

interface TaskState {
  id: number;
  name: string;
  tasks: Task[];
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
}


const TaskFilter: React.FC<TaskFilterProps> = ({ serverId,channelId, setColumns }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [activeAssigneeId, setActiveAssigneeId] = useState<string | null>(null);

  // Get members (assignees)
  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${serverId}/members/all`
      );
      setMembers(res.data.members);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  // Filter by title (debounced)
  useEffect(()=>{
    console.log("runnin")
    const filterByTitle = async () => {
      try {
        
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/filter?channelId=${channelId}&title=${searchTitle}`);
        console.log(res.data)
        setColumns(res.data)
        
      } catch (error) {
        console.error('Title filtering failed:', error);
      }
    };

    const timer = setTimeout(filterByTitle,1000);

    return ()=>clearTimeout(timer)
  },[searchTitle])

  // Filter by assignee
  const filterByAssignee = async (assigneeId: string) => {
    try {

      if(assigneeId===activeAssigneeId) {
        setActiveAssigneeId("")
        assigneeId=""
      } else{
          setActiveAssigneeId(assigneeId);
        }
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/filter?channelId=${channelId}&assigneeId=${assigneeId}`);
    setColumns(res.data);
    } catch (error) {
      console.error('Assignee filtering failed:', error);
    }
  };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTitle(val);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="min-[320px]:gap-5 md:gap-6 flex justify-between items-center w-full mr-2">
      <input
        type="text"
        placeholder="Search by task title..."
        value={searchTitle}
        onChange={handleInputChange}
        className="md:w-72 min-[320px]:w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex min-[320px]:gap-2 md:gap-4 items-center justify-start overflow-x-auto md:w-64 min-[320px]:w-32">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => filterByAssignee(member.profile.id)}
            className={`relative rounded-full border-2 ${
              activeAssigneeId === member.profile.id
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
            title={member.profile.name}
          >
            <img
              src={member?.profile.imageUrl}
              alt={member?.profile.name}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;
