"use client";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { store } from "../store";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: "!font-sans !text-sm",
                        style: { background: "var(--toast-bg, #1f2937)", color: "#fff", borderRadius: "12px" },
                    }}
                />
            </ThemeProvider>
        </Provider>
    );
}
