import { create } from "zustand";

type UserType = {
  username: string | null;
  favTeam: string | null;
  setUsername: (username: string) => void;
  setFavTeam: (favTeam: string) => void;
};

export const useUser = create<UserType>((set) => ({
  username: null,
  favTeam: null,
  setUsername: (username) => set({ username }),
  setFavTeam: (favTeam) => set({ favTeam }),
}));
