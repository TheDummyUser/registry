import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  setTheme: (theme) => {
    AsyncStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleTheme: async () => {
    const currentTheme = await AsyncStorage.getItem('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    AsyncStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },
}));

const loadThemeFromStorage = async () => {
  const savedTheme = await AsyncStorage.getItem('theme');
  return savedTheme ? savedTheme : 'dark';
};

loadThemeFromStorage().then((savedTheme) => {
  useThemeStore.getState().setTheme(savedTheme as 'light' | 'dark');
});

export default useThemeStore;
