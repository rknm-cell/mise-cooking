import "~/styles/globals.css";

import { type Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./components/auth/AuthContext";

export const metadata: Metadata = {
  title: "Mise",
  description: "An AI powered recipe app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={``}>
      <GoogleTagManager gtmId="GTM-XYZ" />

      <body>
        <TRPCReactProvider>
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
