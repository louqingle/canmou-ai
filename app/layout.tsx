import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "餐谋 AI｜懂餐饮，更懂赚钱",
  description: "餐饮老板的 AI 智能经营助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
