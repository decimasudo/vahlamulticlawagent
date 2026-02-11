// app/layout.tsx
import type { Metadata } from "next";
import { Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

// Font untuk Judul & UI Armor
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

// Font untuk Terminal & Data
const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tech-mono",
});

export const metadata: Metadata = {
  title: "Vahla MultiClaw | Agent Foundry",
  description: "Secure OpenClaw Agent Builder & Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rajdhani.variable} ${shareTechMono.variable} antialiased bg-[#151515] text-[#FFCC00] selection:bg-[#FFCC00] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}