import { Collapse, Stack, Typography } from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import HighlightOff from "@mui/icons-material/HighlightOff";
import { PASSWORD_RULES } from "../validation/authSchema";

interface Props {
  password: string;
  visible: boolean;
  showErrors: boolean;
}

export default function PasswordRequirements({ password, visible, showErrors }: Props) {
  return (
    <Collapse in={visible}>
      <Stack spacing={0.5} sx={{ mt: -0.5, mb: 0.5 }}>
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.pattern.test(password);
          const color = passed ? "success.main" : showErrors ? "error.main" : "text.disabled";
          return (
            <Stack key={rule.key} direction="row" alignItems="center" spacing={0.75}>
              {passed ? (
                <CheckCircleOutline sx={{ fontSize: 16, color }} />
              ) : (
                <HighlightOff sx={{ fontSize: 16, color }} />
              )}
              <Typography variant="caption" sx={{ color }}>
                {rule.label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Collapse>
  );
}
