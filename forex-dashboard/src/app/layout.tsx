import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PropDesk — Forex & Prop Firm Trade Manager",
  description:
    "Professional Forex & prop firm trade management dashboard. Calculate position sizing, manage risk, monitor drawdown rules and track challenge progress.",
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
