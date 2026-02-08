import { Container } from "@mui/material";
import PhoneBook from "../components/PhoneBook";

export default function PhoneBookPage() {
  return (
    <Container
      maxWidth="md"
      sx={{ py: 4, display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}
    >
      <PhoneBook />
    </Container>
  );
}
