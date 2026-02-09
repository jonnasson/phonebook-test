import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  Fade,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import HighlightOff from "@mui/icons-material/HighlightOff";
import { useAuth } from "../hooks/useAuth";
import { useDebouncedQuery } from "../hooks/useDebouncedQuery";
import { CHECK_USERNAME_AVAILABLE } from "../graphql/queries";
import { authSchema, type AuthInput } from "../validation/authSchema";
import { isPasswordValid } from "../validation/shared";
import { useIsDark } from "../hooks/useIsDark";
import PasswordRequirements from "./PasswordRequirements";

function extractError(err: unknown): string {
  return err instanceof Error ? err.message : "Fehler aufgetreten";
}

export default function AuthDialog() {
  const { login, signup, loginAsGuest } = useAuth();
  const isDark = useIsDark();
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, submitCount },
  } = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
    mode: "onSubmit",
    defaultValues: { username: "", password: "" },
  });

  const isRegister = tab === 1;
  const watchedUsername = useWatch({ control, name: "username" });
  const watchedPassword = useWatch({ control, name: "password" });
  const passwordValid = isPasswordValid(watchedPassword);

  const { status: usernameQueryStatus } = useDebouncedQuery<
    { checkUsernameAvailable: boolean },
    { username: string }
  >({
    query: CHECK_USERNAME_AVAILABLE,
    variables: () => {
      if (!isRegister || watchedUsername.trim().length < 3) return null;
      return { username: watchedUsername.trim() };
    },
    pickResult: (data) => !data.checkUsernameAvailable,
    deps: [watchedUsername, isRegister],
  });

  // Map hook status to component semantics: hit = taken, miss = available
  const usernameStatus =
    usernameQueryStatus === "hit"
      ? ("taken" as const)
      : usernameQueryStatus === "miss"
        ? ("available" as const)
        : usernameQueryStatus;

  const onSubmit = async (data: AuthInput) => {
    setError("");
    if (isRegister && usernameStatus === "taken") {
      setError("Benutzername bereits vergeben");
      return;
    }
    if (isRegister && !passwordValid) {
      setError("Passwort erfüllt nicht alle Anforderungen.");
      return;
    }
    try {
      if (tab === 0) {
        await login(data.username, data.password);
      } else {
        await signup(data.username, data.password);
      }
    } catch (err) {
      setError(extractError(err));
    }
  };

  return (
    <Fade in timeout={500}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          ...(isDark
            ? {
                elevation: 0,
                border: `1px solid rgba(129, 140, 248, 0.15)`,
                backdropFilter: "blur(12px)",
                bgcolor: "rgba(30, 41, 59, 0.85)",
              }
            : {}),
        }}
        elevation={isDark ? 0 : 8}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                width: 56,
                height: 56,
                mb: 1,
              }}
            >
              <PhoneIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" align="center">
              Telefonbuch
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ihr digitales Adressbuch
            </Typography>
          </Stack>
          <Divider
            sx={{
              width: "60%",
              mx: "auto",
              mb: 2,
              borderColor: isDark ? "rgba(129, 140, 248, 0.3)" : "rgba(99, 102, 241, 0.3)",
            }}
          />
          <Tabs
            value={tab}
            onChange={(_, v: number) => {
              setTab(v);
              setError("");
              setPasswordTouched(false);
              setPasswordBlurred(false);
              reset();
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Anmelden" />
            <Tab label="Registrieren" />
          </Tabs>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Benutzername"
                    required
                    fullWidth
                    autoFocus
                    autoComplete="username"
                    error={isRegister && usernameStatus === "taken"}
                    helperText={
                      isRegister && usernameStatus === "available"
                        ? "Benutzername verfügbar"
                        : isRegister && usernameStatus === "taken"
                          ? "Benutzername bereits vergeben"
                          : undefined
                    }
                    FormHelperTextProps={
                      isRegister && usernameStatus === "available"
                        ? { sx: { color: "success.main" } }
                        : undefined
                    }
                    slotProps={{
                      input: {
                        endAdornment:
                          isRegister && usernameStatus !== "idle" ? (
                            <InputAdornment position="end">
                              {usernameStatus === "checking" ? (
                                <CircularProgress size={20} />
                              ) : usernameStatus === "available" ? (
                                <CheckCircleOutline color="success" />
                              ) : (
                                <HighlightOff color="error" />
                              )}
                            </InputAdornment>
                          ) : undefined,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Passwort"
                    type={showPassword ? "text" : "password"}
                    required
                    fullWidth
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    error={isRegister && !passwordValid && (passwordBlurred || submitCount > 0)}
                    onFocus={() => {
                      if (isRegister) setPasswordTouched(true);
                    }}
                    onBlur={() => {
                      field.onBlur();
                      if (isRegister) setPasswordBlurred(true);
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((s) => !s)}
                              edge="end"
                              size="small"
                              aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              {isRegister && (
                <PasswordRequirements
                  password={watchedPassword}
                  visible={passwordTouched}
                  showErrors={passwordBlurred || submitCount > 0}
                />
              )}
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                sx={{
                  mt: 1,
                  background: isDark
                    ? "linear-gradient(135deg, #818CF8 0%, #A5B4FC 100%)"
                    : "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
                  "&:hover": {
                    background: isDark
                      ? "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)"
                      : "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                  },
                  "&.Mui-disabled": {
                    background: undefined,
                  },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : tab === 0 ? (
                  "Anmelden"
                ) : (
                  "Registrieren"
                )}
              </Button>
            </Stack>
          </form>
          <Divider sx={{ my: 3 }}>oder</Divider>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            size="large"
            disabled={guestLoading}
            onClick={() => {
              setError("");
              setGuestLoading(true);
              loginAsGuest()
                .catch((err: unknown) => {
                  setError(extractError(err));
                })
                .finally(() => {
                  setGuestLoading(false);
                });
            }}
          >
            {guestLoading ? <CircularProgress size={24} color="inherit" /> : "Als Gast fortfahren"}
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
}
