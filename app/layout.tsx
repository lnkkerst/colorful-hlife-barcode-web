import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";
import { GlobalEffect } from "@/components/global-effects";

export const metadata: Metadata = {
  title: "校园汇生活条码",
  description: "查看校园汇生活接水条码",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-cn">
      <body>
        <ClientProviders>
          <GlobalEffect />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
