import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cake Shop - Delicious Custom Cakes Delivered",
  description: "Order custom cakes for all occasions. Fresh, delicious, and beautifully crafted cakes delivered to your doorstep.",
  keywords: "cakes, custom cakes, birthday cakes, wedding cakes, cake delivery, Kenya cakes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
