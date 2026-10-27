import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
