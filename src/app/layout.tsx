import type { Metadata } from "next";
import "../styles/index.css";
import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: { default: "AdminHub", template: "%s | AdminHub" },
  description: "Senior-level admin panel built with Next.js, Express, and MongoDB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
