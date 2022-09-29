import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PermitDetails from "./pages/PermitDetails";
import Dashboard from "./pages/Dashboard";
import AuthorityDetails from "./pages/AuthorityDetails";
import RequireAuth from "./components/auth/RequireAuth";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <RequireAuth>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route path="/" element={<Home />} />
              <Route path="authorities/:code" element={<AuthorityDetails />} />
              <Route path="permits/:id" element={<PermitDetails />} />
            </Route>
          </Routes>
        </RequireAuth>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
