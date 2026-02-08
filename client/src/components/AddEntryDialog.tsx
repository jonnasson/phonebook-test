import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ADD_ENTRY, CHECK_DUPLICATE, GET_ENTRIES } from "../graphql/queries";
import { entrySchema, PHONE_REGEX, type EntryInput } from "../validation/entrySchema";
import { filterPhoneChars } from "../utils/strings";
import { useDebouncedQuery } from "../hooks/useDebouncedQuery";
import type { Entry } from "../hooks/usePhoneBookEntries";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (entry: Entry) => void;
  onExited?: () => void;
}

export default function AddEntryDialog({ open, onClose, onSuccess, onExited }: Props) {
  const [generalError, setGeneralError] = useState("");
  const [phoneBlurred, setPhoneBlurred] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid, isSubmitting, submitCount },
  } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
    mode: "onChange",
    defaultValues: { name: "", phone: "" },
  });

  const [addEntry, { loading: addLoading }] = useMutation<{
    addEntry: Entry;
  }>(ADD_ENTRY, {
    update(cache, { data }) {
      if (!data) return;
      const existing = cache.readQuery<{ entries: Entry[] }>({ query: GET_ENTRIES });
      if (!existing) return;
      const newEntry = data.addEntry;
      const entries = [...existing.entries];
      const idx = entries.findIndex((e) => e.name.localeCompare(newEntry.name, "de") > 0);
      if (idx === -1) {
        entries.push(newEntry);
      } else {
        entries.splice(idx, 0, newEntry);
      }
      cache.writeQuery({ query: GET_ENTRIES, data: { entries } });
      cache.evict({ fieldName: "search" });
      cache.gc();
    },
  });

  const watchedName = watch("name");
  const watchedPhone = watch("phone");

  const submitting = addLoading || isSubmitting;

  const {
    status: dupStatus,
    reset: resetDupCheck,
    resume: resumeDupCheck,
  } = useDebouncedQuery<{ checkDuplicate: boolean }, { name: string; phone: string }>({
    query: CHECK_DUPLICATE,
    variables: () => {
      const trimmedName = watchedName?.trim();
      const trimmedPhone = watchedPhone?.trim();
      if (!trimmedName || !trimmedPhone || !PHONE_REGEX.test(trimmedPhone)) return null;
      return { name: trimmedName, phone: trimmedPhone };
    },
    pickResult: (data) => data.checkDuplicate,
    deps: [watchedName, watchedPhone],
  });

  const duplicateWarning = dupStatus === "hit";

  useEffect(() => {
    if (open) resumeDupCheck();
  }, [open, resumeDupCheck]);

  const resetForm = () => {
    resetDupCheck();
    reset();
    setGeneralError("");
    setPhoneBlurred(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data: EntryInput) => {
    setGeneralError("");

    try {
      const result = await addEntry({
        variables: { input: { name: data.name, phone: data.phone } },
      });
      resetForm();
      onSuccess(result.data!.addEntry);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Fehler beim Speichern.";
      setGeneralError(msg);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ transition: { onExited } }}
    >
      <DialogTitle>Neuer Eintrag</DialogTitle>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}
        >
          {generalError && (
            <Alert severity="error" onClose={() => setGeneralError("")}>
              {generalError}
            </Alert>
          )}
          {duplicateWarning && !generalError && (
            <Alert severity="warning">
              Ein Eintrag mit diesem Namen und dieser Nummer existiert bereits.
            </Alert>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                autoFocus
                fullWidth
                disabled={submitting}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  field.onChange(filterPhoneChars(e.target.value));
                }}
                onBlur={() => {
                  field.onBlur();
                  setPhoneBlurred(true);
                }}
                label="Telefonnummer"
                type="tel"
                fullWidth
                disabled={submitting}
                error={!!fieldState.error && (phoneBlurred || submitCount > 0)}
                helperText={(phoneBlurred || submitCount > 0) ? fieldState.error?.message : undefined}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button type="button" onClick={handleClose} disabled={submitting}>
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!isValid || duplicateWarning || submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            Hinzufügen
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
