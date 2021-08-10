import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{margin:"10px"}}>
          <App />
        </div>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);