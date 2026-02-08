import { Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useIsDark } from "../hooks/useIsDark";
import AuthDialog from "../components/AuthDialog";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const isDark = useIsDark();

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        py: 4,

        background: isDark
          ? "linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(203, 213, 225, 0.12) 100%)"
          : "linear-gradient(135deg, rgba(51, 65, 85, 0.06) 0%, rgba(99, 102, 241, 0.12) 100%)",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <AuthDialog />
    </Box>
  );
}
