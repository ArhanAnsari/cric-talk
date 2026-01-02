import { create } from "zustand";

type UserType = {
  username: string | null;
  email: string | null;
  favTeam: string | null;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setFavTeam: (favTeam: string) => void;
};

export const useUser = create<UserType>((set) => ({
  username: null,
  favTeam: null,
  email: null,
  setUsername: (username) => set({ username }),
  setEmail: (email) => set({ email }),
  setFavTeam: (favTeam) => set({ favTeam }),
}));
