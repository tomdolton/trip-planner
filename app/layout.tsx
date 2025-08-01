"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter, Outfit } from "next/font/google";
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

const outfit = Outfit({
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
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="">{children}</main>
              <Toaster richColors closeButton position="top-right" />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
