import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClientProvider } from "@/components/ClientProvider";

// Using Fredoka for a "cute" and bubbly aesthetic
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rumah Hewan",
  description: "Premium E-commerce app for Animals",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-pink-50">
        <ClientProvider>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}
