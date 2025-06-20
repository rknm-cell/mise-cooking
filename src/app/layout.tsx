import "~/styles/globals.css";

import { type Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Meez",
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
        <NavBar />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
