import * as React from "react";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { routes } from "./routes";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

const ThemePaletteModeContext = React.createContext({
  toggleThemePaletteMode: () => {}
});

const ToggleThemePaletteMode = () => {
  const theme = useTheme();
  const themePaletteModeContext = React.useContext(ThemePaletteModeContext);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary"
      }}
    >
      <IconButton onClick={themePaletteModeContext.toggleThemePaletteMode} color="inherit">
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
};

export default function App() {
  const isSystemDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themePaletteMode, setThemePaletteMode] = React.useState("light");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleMenuItemClick = (path) => {
    setIsDrawerOpen(false);
    window.location.href = path;
  };
  const themePaletteModeContextProvider = React.useMemo(
    () => ({
      toggleThemePaletteMode: () => {
        setThemePaletteMode((prevMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      }
    }),
    []
  );

  const themeProvider = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themePaletteMode
        }
      }),
    [themePaletteMode]
  );

  return (
    <ThemePaletteModeContext.Provider value={themePaletteModeContextProvider}>
      <ThemeProvider theme={themeProvider}>
        <AppBar position="sticky" component='nav'>
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ marginRight: 2 }} onClick={() => setIsDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" color="inherit" component="div">
              Apps from TheTechCruise
            </Typography>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: "5%" }}>
          <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <List>
              {routes.map((item) => {
                if (item.showInDrawer) {
                  return ( // You were missing the return statement here
                    <ListItem key={item.path} onClick={() => handleMenuItemClick(item.path)}>
                      <ListItemText primary={item.title} />
                    </ListItem>
                  );
                }
                return null;
              })}
            </List>
          </Drawer>
          <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
              <Routes>
                {routes.map(item => <Route exact path={item.path} element={item.element} key={item.path} />)}
              </Routes>
            </BrowserRouter>
            <ToggleThemePaletteMode />
          </Suspense>
        </Container>
      </ThemeProvider>
    </ThemePaletteModeContext.Provider>
  );
}
