import type { Metadata } from "next";

import "./globals.css";

import UserProvider from "./context/user";
import AllOverlay from "./components/AllOverlay";

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
          <AllOverlay />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
