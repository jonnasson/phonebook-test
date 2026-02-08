import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ListItemButton, ListItemText, ListItemAvatar, Avatar, Grow } from "@mui/material";
import { stringToColor, getInitials } from "../utils/strings";
import type { Entry } from "../hooks/usePhoneBookEntries";

interface EntryListItemProps {
  entry: Entry;
  isDark: boolean;
  isNew: boolean;
  isLast: boolean;
  onCopy: (phone: string) => void;
  onNewAnimationEnd: () => void;
}

export default function EntryListItem({
  entry,
  isDark,
  isNew,
  isLast,
  onCopy,
  onNewAnimationEnd,
}: EntryListItemProps) {
  const entryItem = (
    <ListItemButton
      data-entry-id={entry.id}
      divider={!isLast}
      onClick={() => onCopy(entry.phone)}
      sx={{
        "&:hover .copy-icon": { opacity: 1 },
        "&:active .copy-icon": { opacity: 1 },
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: stringToColor(entry.name, isDark),
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          {getInitials(entry.name)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={entry.name}
        secondary={entry.phone}
        slotProps={{
          primary: { sx: { fontWeight: 500 } },
          secondary: {
            sx: {
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            },
          },
        }}
      />
      <ContentCopyIcon
        className="copy-icon"
        sx={{
          fontSize: "1rem",
          color: "text.secondary",
          opacity: 0,
          transition: "opacity 150ms ease-in-out",
          ml: 1,
          flexShrink: 0,
        }}
      />
    </ListItemButton>
  );

  if (isNew) {
    return (
      <Grow
        in
        timeout={400}
        onEntered={() => {
          setTimeout(onNewAnimationEnd, 1100);
        }}
      >
        {entryItem}
      </Grow>
    );
  }

  return entryItem;
}
