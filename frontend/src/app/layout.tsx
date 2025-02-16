"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { EdgeStoreProvider } from "../lib/edgestore";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/model-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Focus",
  icons: [
    {
      media: "(prefers-color-scheme: dark)",
      url: "/coffee-_1_.svg",
      href: "/coffee-_1_.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
          mutations: {
            onError: (error: any) => {
              let msg: string = error?.body?.message || error?.message;
              if (!msg) return toast.error("Erro");
              if (msg.includes("status code 403")) {
                msg = "You are not authorized to perform this action";
              } else if (msg.includes("status code 401")) {
                msg = "You are not authenticated";
              } else if (msg.includes("status code 500")) {
                msg = "Internal server error";
              }
              toast.error("Erro", { description: msg });
            },
          },
        },
      })
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <EdgeStoreProvider>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <ModeToggle />
              </div>
              {children}
            </EdgeStoreProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
