"use client";

import { useProgressStore } from "@/hooks/use-progress-store";
import ProgressBar from "../ui/progress-bar";

export const OverallProgress = () => {

    const percentage = useProgressStore(state =>
        state.overallProgress || parseInt(localStorage.getItem("overallProgress") ?? "0")
      );
      
  
  return (
    <strong className="mt-4 mb-4 text-sm flex justify-between items-center">
      Overall Progress
      <ProgressBar progressPercentage={percentage} size={50} color={percentage<=25?"#ae0e0e":percentage<=50?"#eb6f0c":percentage<=75?"#e6e40b":"#52b174"} fill={percentage<=25?"#ae0e0e":percentage<=50?"#eb6f0c":percentage<=75?"#e6e40b":"#52b174"} />
    </strong>
  );
};
