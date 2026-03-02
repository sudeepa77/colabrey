
//src/app/layout.tsx:

import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import Script from 'next/script';
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Colabrey - Connect. Collaborate. Create.",
  description: "Find like-minded students, build communities, and create something amazing together within your campus.",
  keywords: "student networking, campus community, collaboration, university",
  metadataBase: new URL("https://colabrey.in"),
  openGraph: {
    title: "Colabrey - Connect. Collaborate. Create.",
    description: "Find like-minded students, build communities, and create something amazing together.",
    type: "website",
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
          disableTransitionOnChange
        >

          {children}
            <Toaster position="top-right" richColors />
        </ThemeProvider>
        <Script src="https://js.sonner.dev" strategy="afterInteractive" />
                  
      </body>
    </html>
  );
}