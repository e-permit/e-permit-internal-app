import React from "react";
import ReactDOM from "react-dom/client";
import router from "./lib/router";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./lib/useAuth";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";
import "./i18n";
import { worker } from "./mocks/browser";

if (process.env.NODE_ENV === "development") {
    worker.start();
}
const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </QueryClientProvider>
        </ChakraProvider>
    </React.StrictMode>
);
