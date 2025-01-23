import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the types for the store state
interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void; // To set the theme explicitly
}

// Create the Zustand store
const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark', // Default theme, will be updated later
  setTheme: (theme) => {
    AsyncStorage.setItem('theme', theme); // Persist the theme in AsyncStorage
    set({ theme });
  },
  toggleTheme: async () => {
    // Get the current theme from AsyncStorage
    const currentTheme = await AsyncStorage.getItem('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Save the new theme in AsyncStorage and update the store
    AsyncStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },
}));

// Load the theme from AsyncStorage when the app starts
const loadThemeFromStorage = async () => {
  const savedTheme = await AsyncStorage.getItem('theme');
  return savedTheme ? savedTheme : 'dark'; // If no theme is stored, default to 'light'
};

// Initialize theme from AsyncStorage
loadThemeFromStorage().then((savedTheme) => {
  useThemeStore.getState().setTheme(savedTheme as 'light' | 'dark');
});

export default useThemeStore;
