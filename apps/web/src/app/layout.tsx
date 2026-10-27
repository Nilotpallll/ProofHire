import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FloatingThemeWidget } from "@/components/ui/FloatingThemeWidget";

export const metadata: Metadata = {
  title: "ProofHire — Trust Skills. Verify Credentials. Hire Faster.",
  description:
    "AI-powered decentralized academic and professional credential verification platform. Verified on Ethereum blockchain with zero-knowledge proof architecture.",
  keywords: [
    "credential verification",
    "blockchain credentials",
    "AI recruitment",
    "smart contract degrees",
    "ProofHire",
    "cryptographic proofs",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('proofhire-theme');
                  var isDark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#090D1A] dark:text-slate-100 antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <FloatingThemeWidget />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
