import { useColorScheme } from "@mui/material/styles";

export function useIsDark(): boolean {
  const { mode, systemMode } = useColorScheme();
  return ((mode === "system" ? systemMode : mode) ?? "light") === "dark";
}
