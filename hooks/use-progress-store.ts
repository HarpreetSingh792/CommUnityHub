// stores/useProgressStore.ts
import { create } from "zustand";

interface ChannelProgress {
  channelId: string;
  progress: number;
}

interface ProgressState {
    channelProgress: ChannelProgress[];
    overallProgress: number;
    setChannelProgress: (channelId: string, progress: number) => void;
    setOverallProgress: (progress: number) => void; // 👈 NEW
    calculateOverallProgress: () => void;
  }
  

export const useProgressStore = create<ProgressState>((set, get) => ({
  channelProgress: [],
  overallProgress: 0,

  setChannelProgress: (channelId, progress) => {
    const updatedProgress = get().channelProgress.filter(cp => cp.channelId !== channelId);
    updatedProgress.push({ channelId, progress });

    set({ channelProgress: updatedProgress }, false);
    get().calculateOverallProgress();
  },

  setOverallProgress: (progress) => set({ overallProgress: progress }),

  calculateOverallProgress: () => {
    const progressArray = get().channelProgress;
    if (progressArray.length === 0) {
      set({ overallProgress: 0 });
      return;
    }

    const total = progressArray.reduce((sum, cp) => sum + cp.progress, 0);
    const average = total / progressArray.length;

    set({ overallProgress: Math.round(average) });
  },
}));
