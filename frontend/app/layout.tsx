import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import QueryProvider from "@/components/shared/QueryProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Apex Resume — AI-Powered Resume Optimization",
    template: "%s | Apex Resume",
  },
  description:
    "Don't just pass the ATS. Make humans remember you. Get AI-powered resume analysis, rejection risk detection, and specific fixes in minutes.",
  keywords: ["resume optimizer", "ATS checker", "AI resume", "job search"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
  signInFallbackRedirectUrl="/dashboard"
  signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <QueryProvider>
            {children}
            <Toaster
              theme="dark"
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fafafa",
                },
              }}
            />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
