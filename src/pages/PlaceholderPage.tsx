import Box from "@mui/material/Box";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Header />
      <Box component="main">
        {/* Header is pinned/fixed and no longer takes up flow space — reserve
            room for it so this content doesn't start underneath it. */}
        <Box sx={{ height: { xs: 100, sm: 140 } }} />
        <Box sx={{ py: 10, textAlign: "center", fontSize: 20 }}>
          {title} — незабаром
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
