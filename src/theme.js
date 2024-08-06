// src/theme.js
import { createTheme } from '@mui/material/styles';
import React, { createContext, useContext } from 'react';

// Create a context for the theme
export const ColorModeContext = createContext();

export const useMode = () => {
  // Fixed to light mode
  const theme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#f5f5f5', // Light background
        paper: '#ffffff',   // Paper background
      },
      primary: {
        main: '#1976d2',   // Primary color
      },
      secondary: {
        main: '#dc004e',   // Secondary color
      },
    },
  });

  return [theme];
};
