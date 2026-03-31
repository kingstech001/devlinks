"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Hide the header on login page ("/") and preview page ("/preview")
  if (pathname === "/" || pathname === "/preview") return null;

  return <Header />;
}