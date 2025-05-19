// in components/todo/todo.tsx
"use client";

import TodoBoard from "./todo-board";

const Todo = ({profileId,role}:{ profileId:String,role:String}) => {
  return (
    <div className="h-screen overflow-auto">
  
      <TodoBoard profileId={profileId} role={role}/>
    </div>
  )
};

export default Todo;
