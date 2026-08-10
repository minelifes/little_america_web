import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@fontsource/comfortaa/300.css";
import "@fontsource/comfortaa/400.css";
import "@fontsource/comfortaa/500.css";
import "@fontsource/comfortaa/600.css";
import "@fontsource/comfortaa/700.css";
import "./index.css";

import theme from "./theme/theme";
import App from "./App";
import { CartProvider } from "./cart/CartContext";
import { AuthProvider } from "./auth/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default (retry: 3 + exponential backoff) means a blocked/failing
      // request keeps the whole section stuck in its skeleton state for
      // 7-10+ seconds, which reads as the page freezing. Fail fast instead.
      retry: 1,
      retryDelay: 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
