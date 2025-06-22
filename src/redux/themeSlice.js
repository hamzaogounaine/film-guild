'use client';

import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely get the theme from localStorage
const getInitialTheme = () => {
  // Check if window is defined (i.e., running in the browser)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'light';
  }
  // Return default theme for server-side rendering
  return 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { theme: getInitialTheme() },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Only set localStorage if running in the browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;