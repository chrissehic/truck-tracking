import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/ui/app-sidebar";
import AppProviders from "@/components/providers/AppProviders";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add weights you want to use
  display: "swap", // Optional for performance
});

export const metadata: Metadata = {
  title: "Truck Tracking API",
  description: "Simple API for real-time truck tracking and route management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased flex flex-row h-screen`}
      >
        <AppProviders>
          <AppSidebar />

          {children}
        </AppProviders>
      </body>
    </html>
  );
}
