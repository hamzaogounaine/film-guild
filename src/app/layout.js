// ./src/app/layout.js (NO "use client" at the top)

import "./globals.css";
// Import the new client wrapper component
import Providers from "./Providers"; 

// The static metadata export must be in a Server Component
export const metadata = {
  title: {
    template: "%s - Film Guild",
    default: "Home - Film Guild", 
  },
  description:
    "The official site for the Film Guild...",
  icons: {
    icon: "/favicon.ico",
  },
  // ... rest of your metadata
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link precedence="default" href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet" />
      
      <body>
        {/* Wrap your MainLayout/Redux logic inside the Client Component */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}