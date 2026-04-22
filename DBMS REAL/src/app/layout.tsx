import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"),  { ssr: false });
const LoadingScreenWrapper = dynamic(() => import("@/components/LoadingScreenWrapper"), { ssr: false });
const LenisProvider = dynamic(() => import("@/components/LenisProvider"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const EmployeeToggle = dynamic(() => import("@/components/EmployeeToggle"), { ssr: false });

export const metadata: Metadata = {
  title: "AURA | Digital Mobility Experience",
  description: "Not a car rental. A particle-driven, WebGL-powered digital experience of speed, identity, and motion.",
  openGraph: {
    title: "AURA | Digital Mobility Experience",
    description: "Award-tier experimental car rental interface built with Three.js, GSAP, and Framer Motion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: '#050505', overflowX: 'hidden' }}>
        <LenisProvider>
          {/* Global overlay layers */}
          <CustomCursor />
          <NoiseOverlay />
          <LoadingScreenWrapper />
          <Navbar />

          {/* Page content — sits on top of WebGL background */}
          <main style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
