import Providers from "./providers";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Player",
  description: "A simple music player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
