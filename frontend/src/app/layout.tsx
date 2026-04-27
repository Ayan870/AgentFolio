import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentFolio",
  description: "Your AI-powered portfolio agent",
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
      <html lang="en">
        <body className="bg-gray-950 text-white antialiased">{children}</body>
      </html>
  );
}