import type { Metadata } from "next";

import "./globals.css";
import AuthOverlay from "./components/AuthOverlay";
import UserProvider from "./context/user";

export const metadata: Metadata = {
  title: "RulTok App",
  description: "an tiktok app clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <AuthOverlay />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
