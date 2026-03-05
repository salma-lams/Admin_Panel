"use client";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "../store";
import { ErrorBoundary } from "./ErrorBoundary";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <ErrorBoundary name="Global">
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            className: "!font-sans !text-sm",
                            style: {
                                background: "var(--toast-bg, #1f2937)",
                                color: "#fff",
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.1)"
                            },
                        }}
                    />
                </ErrorBoundary>
            </ThemeProvider>
        </Provider>
    );
}
