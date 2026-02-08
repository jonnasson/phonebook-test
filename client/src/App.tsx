import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./hooks/useAuth";
import AppHeader from "./components/AppHeader";
import LoginPage from "./pages/LoginPage";
import PhoneBookPage from "./pages/PhoneBookPage";
import theme from "./theme";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <InitColorSchemeScript defaultMode="light" />
      <CssBaseline />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader />
        <Box sx={{ flexGrow: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PhoneBookPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
