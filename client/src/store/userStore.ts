import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserDetails {
  id: any;
  email: string;
  is_admin: boolean;
  time: string;
  username: string;
}

interface UserStore {
  user: UserDetails | null;
  setUser: (userData: { details: UserDetails }) => void;
  clearUser: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      token: null,
      setUser: (userData) =>
        set({
          user: userData.details,
        }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
