import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
        danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
        danger?: string;
    };
  }
  }

  export const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#111a4a',
        light: '#4f568a',
        dark: '#070f37',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#010a29',
        paper: '#e8e8e8',
      },
    },
  });