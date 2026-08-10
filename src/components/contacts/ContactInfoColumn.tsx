import Box from "@mui/material/Box";
import type { ReactNode } from "react";

interface ContactInfoColumnProps {
  icon: string;
  title: string;
  children: ReactNode;
}

// Ported from the repeated column layout in contacts_page.dart.
export default function ContactInfoColumn({ icon, title, children }: ContactInfoColumnProps) {
  return (
    <Box sx={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Box component="img" src={icon} alt="" sx={{ width: 32, height: 32 }} />
      <Box sx={{ mt: "20px", fontSize: 20, fontWeight: 300 }}>{title}</Box>
      <Box sx={{ mt: "42px" }}>{children}</Box>
    </Box>
  );
}
