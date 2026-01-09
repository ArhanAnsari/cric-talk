import { create } from "zustand";

type UserType = {
  username: string | null;
  email: string | null;
  favTeam: string | null;
  messageCount: number;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setFavTeam: (favTeam: string) => void;
  setMessageCount: (count: number) => void;
};

export const useUser = create<UserType>((set) => ({
  username: null,
  favTeam: null,
  email: null,
  messageCount: 0,
  setUsername: (username) => set({ username }),
  setEmail: (email) => set({ email }),
  setFavTeam: (favTeam) => set({ favTeam }),
  setMessageCount: (count) =>
    set((s) => ({ messageCount: s.messageCount + count })),
}));
