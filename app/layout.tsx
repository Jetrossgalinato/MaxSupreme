import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from "@/utils/supabase/server";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import GlobalAlertListener from "@/components/global-alert-listener";
import StaffPresence from "@/components/staff-presence";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Max Supreme",
  description: "Real Estate Investment Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalAlertListener />
          <StaffPresence user={user} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
