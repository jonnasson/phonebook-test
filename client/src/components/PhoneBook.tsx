import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import {
  TextField,
  List,
  ListItemButton,
  ListItemAvatar,
  ListSubheader,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Fab,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import AddIcon from "@mui/icons-material/Add";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";
import { usePhoneBookEntries } from "../hooks/usePhoneBookEntries";
import { useSnackbar } from "../hooks/useSnackbar";
import AddEntryDialog from "./AddEntryDialog";
import EntryListItem from "./EntryListItem";
import Tutorial from "./Tutorial";
import { useIsDark } from "../hooks/useIsDark";

const virtuosoComponents = {
  List: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
    <List component="div" disablePadding {...props} ref={ref} />
  )),
  Group: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
    <div {...props} ref={ref} style={{ ...props.style, top: 0 }} />
  )),
  Item: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
    <div {...props} ref={ref} />
  )),
};

export default function PhoneBook() {
  const isDark = useIsDark();
  const [term, setTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);
  const snackbar = useSnackbar();

  const { allEntries, filteredEntries, groupedData, loading, isSearching, deferredTerm } =
    usePhoneBookEntries(term);

  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll new entry into view via Virtuoso
  useEffect(() => {
    if (!newEntryId) return;
    const timer = setTimeout(() => {
      const index = filteredEntries.findIndex((e) => e.id === newEntryId);
      if (index >= 0) {
        virtuosoRef.current?.scrollToIndex({
          index,
          align: "center",
          behavior: "smooth",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [newEntryId, filteredEntries]);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/") {
        const tag = (document.activeElement as HTMLElement)?.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          (document.activeElement as HTMLElement)?.isContentEditable
        )
          return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleCopy = useCallback(
    (phone: string) => {
      void navigator.clipboard.writeText(phone).then(
        () => snackbar.show(`${phone} kopiert`),
        () => snackbar.show("Kopieren fehlgeschlagen"),
      );
    },
    [snackbar],
  );

  const groupContent = useCallback(
    (index: number) => (
      <ListSubheader
        disableSticky
        sx={{
          height: 32,
          lineHeight: "32px",
          display: "flex",
          alignItems: "center",
          fontWeight: 700,
          fontSize: "0.8rem",
          bgcolor: "background.paper",
          zIndex: 2,
        }}
      >
        {groupedData.groups[index]}
      </ListSubheader>
    ),
    [groupedData.groups],
  );

  const itemContent = useCallback(
    (index: number) => (
      <EntryListItem
        entry={filteredEntries[index]}
        isDark={isDark}
        isNew={filteredEntries[index].id === newEntryId}
        isLast={index >= filteredEntries.length - 1}
        onCopy={handleCopy}
        onNewAnimationEnd={() => setTimeout(() => setNewEntryId(null), 0)}
      />
    ),
    [filteredEntries, isDark, handleCopy, newEntryId],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "hidden",
        paddingTop: 0.5,
      }}
    >
      <TextField
        id="search-bar"
        inputRef={inputRef}
        placeholder="Name oder Telefonnummer suchen..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        fullWidth
        autoFocus
        sx={{
          flexShrink: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: "24px",
            fontSize: "1.1rem",
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ width: 20, justifyContent: "center" }}>
                {isSearching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon color="action" />
                )}
              </InputAdornment>
            ),
            endAdornment: term ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setTerm("")} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                <Typography
                  component="kbd"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    border: 1,
                    borderColor: "divider",
                    color: "text.disabled",
                    lineHeight: 1.5,
                  }}
                >
                  /
                </Typography>
              </InputAdornment>
            ),
          },
        }}
      />

      {deferredTerm && filteredEntries.length > 0 && (
        <Box sx={{ mt: 1.5, mb: 0.5, flexShrink: 0 }}>
          <Chip
            label={`${filteredEntries.length} Ergebnis${filteredEntries.length !== 1 ? "se" : ""}`}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>
      )}

      {loading && allEntries.length === 0 && (
        <Paper variant="outlined" sx={{ mt: 2, flexGrow: 1, overflow: "auto" }}>
          <List disablePadding>
            {Array.from({ length: 8 }).map((_, i) => (
              <ListItemButton key={i} divider={i < 7}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      {!loading && deferredTerm && filteredEntries.length === 0 && allEntries.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            opacity: isDark ? 0.65 : 0.5,
            gap: 2,
            py: 8,
          }}
        >
          <SearchOffIcon sx={{ fontSize: 64, color: "text.disabled" }} />
          <Typography variant="h6" color="text.disabled">
            Keine Ergebnisse
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Keine Treffer f&uuml;r &ldquo;{deferredTerm}&rdquo;
          </Typography>
        </Box>
      )}

      {filteredEntries.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            mt: 2,
            flexGrow: 1,
            flexShrink: 1,
            overflow: "hidden",
            opacity: isSearching ? 0.6 : 1,
            transition: "opacity 200ms ease-in-out",
          }}
        >
          <GroupedVirtuoso
            ref={virtuosoRef}
            groupCounts={groupedData.groupCounts}
            groupContent={groupContent}
            itemContent={itemContent}
            components={virtuosoComponents}
            style={{ height: "100%" }}
            overscan={200}
            fixedGroupHeight={32}
          />
        </Paper>
      )}

      <Fab
        id="add-entry-fab"
        color="secondary"
        aria-label="Neuer Eintrag"
        onClick={(e) => {
          e.currentTarget.blur();
          setAddDialogOpen(true);
        }}
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <AddIcon />
      </Fab>

      <AddEntryDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={(entry) => {
          setAddDialogOpen(false);
          setTerm("");
          setNewEntryId(entry.id);
          snackbar.show("Eintrag hinzugef\u00FCgt");
        }}
        onExited={() => inputRef.current?.focus()}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={snackbar.close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={snackbar.close} severity="success" variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Tutorial />
    </Box>
  );
}
