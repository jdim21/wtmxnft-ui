import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#82e9de',
      main: '#4db6ac',
      dark: '#00867d',
      contrastText: '#fff',
    },
    secondary: {
      light: '#82e9de',
      main: '#4db6ac',
      dark: '#00867d',
      contrastText: '#000',
    },
    background: {
      default: '#4db6ac',
    },
  },
  typography: {
    fontFamily: [
      "Inter","Noto Sans SC","Noto Sans JP","Noto Sans KR","Roboto","-apple-system","BlinkMacSystemFont","Segoe UI","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue","Helvetica","Arial","sans-serif"
    ].join(','),
    fontWeight: 400,
    color: 'white',
  },
});

export default theme;