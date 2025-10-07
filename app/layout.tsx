"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter, DM_Sans } from "next/font/google";
import { useState } from "react";
import { Provider } from "react-redux";

import { store } from "@/store";
import "../styles/globals.css";

import Navbar from "@/components/Layout/Navbar";
import { ThemeProvider } from "@/components/Layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Trip Planner</title>
        <meta name="description" content="Plan and manage your trips with ease" />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main>{children}</main>
              <Toaster richColors closeButton position="top-right" />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
