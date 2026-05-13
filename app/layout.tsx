import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommitCraft – Generate Perfect Commit Messages from Git Diff",
  description:
    "Paste your git diff and get 3 Conventional Commits–style commit messages in seconds. Powered by Claude AI.",
  openGraph: {
    title: "CommitCraft",
    description: "Generate perfect commit messages from your git diff in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
