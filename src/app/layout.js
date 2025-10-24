"use client"; // needed because we use hooks

import "@/app/styles/globals.css";
import Layout from "@/app/components/Layout.jsx";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Pages that should NOT have the Layout wrapper
  const noLayoutPages = ["/", "/mfa", "/login"];

  const useLayout = !noLayoutPages.includes(pathname);

  return (
    <html lang="en">
      <body>{useLayout ? <Layout>{children}</Layout> : children}</body>
    </html>
  );
}