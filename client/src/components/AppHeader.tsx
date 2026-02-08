import { AppBar, Toolbar, IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { DarkMode, GitHub, LightMode, Logout } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

export default function AppHeader() {
  const { isAuthenticated, logout } = useAuth();
  const { mode, setMode, systemMode } = useColorScheme();
  const resolvedMode = (mode === "system" ? systemMode : mode) ?? "light";

  return (
    <AppBar position="relative" sx={{ flexShrink: 0, zIndex: 1400 }}>
      <Toolbar sx={{ gap: 1 }}>
        <div style={{ flexGrow: 1 }} />
        <Tooltip title={resolvedMode === "dark" ? "Hellmodus" : "Dunkelmodus"}>
          <IconButton onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}>
            {resolvedMode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
        <Tooltip title="GitHub">
          <IconButton
            component="a"
            href="https://github.com/jonnasson/phonebook-test"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub />
          </IconButton>
        </Tooltip>
        {isAuthenticated && (
          <Tooltip title="Abmelden">
            <IconButton onClick={logout}>
              <Logout />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}
